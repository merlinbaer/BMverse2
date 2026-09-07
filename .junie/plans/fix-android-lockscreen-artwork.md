---
sessionId: session-260907-131848-br3g
---

# Requirements

### Overview & Goals
The objective is to fix Android lock-screen artwork rendering for asset images in `@src/hooks/useTrackPlayer.ts` while simplifying the codebase for improved maintainability. Currently, iOS displays asset artwork correctly on the lock screen, but Android fails to display asset covers (such as bundled `require(...)` images or the fallback `notFound` image).

### Scope
- **In Scope (Android Target Fixes & Code Cleanup)**:
  - Fix Android lock-screen artwork resolution for bundled asset images (`type is number`) and fallbacks.
  - Eliminate double-update race conditions caused by premature `transparent_pixel.png` metadata assignments on Android.
  - Simplify `@src/hooks/useTrackPlayer.ts` by replacing deeply nested try/catch blocks and duplicated logic with clean, readable helper functions.
  - Add diagnostic logging for Android artwork loading.
- **Out of Scope**:
  - Web target audio playback (track player is mobile-only).
  - Any changes to iOS lock-screen behavior (iOS is working as expected).

### Functional Requirements
1. **File Picker Artwork**: User-imported cover images (`file://...`) must continue to display on Android and iOS lock screens.
2. **Asset Cover Artwork**: Bundled asset covers (`require(...)` number IDs) must reliably display on the Android lock screen.
3. **Fallback Cover Artwork**: When a track has no cover image (`null`/`undefined`), the fallback `notFound` image must display on the Android lock screen.
4. **No Artwork Persistence**: When clearing or stopping tracks, previous artwork must be cleared cleanly without causing flicker or race conditions.

# Technical Design

### Current Implementation & Log Analysis
`useTrackPlayer.ts` utilizes `expo-audio`'s `useAudioPlaylist` for audio playback and a secondary muted `proxyPlayer` (`useAudioPlayer(null)`) to synchronize track metadata (title, artist, album, artworkUrl) to OS lock-screen controls via `proxyPlayer.setActiveForLockScreen(...)`.

#### Analysis of Current Behavior & Logs
1. **Asset Resolution Process**:
   - For string URIs (`file://...`), the URI is used directly.
   - For numeric asset IDs (`require(...)`), `Asset.fromModule(rawUri).downloadAsync()` downloads the asset to Expo's cache directory (`file:///data/user/0/.../cache/ExponentAsset-<hash>.png`).
2. **The Transparent Pixel**:
   - On hook initialization, a 1x1 base64 transparent PNG is written to `${cacheDirectory}transparent_pixel.png`.
   - Before `loadArtwork()` finishes resolving, `proxyPlayer.setActiveForLockScreen()` is called immediately with `artworkUrl = TRANSPARENT_PIXEL_PATH`.
   - **Purpose**: Designed to clear previous track artwork when a new track loads or when no artwork exists.
   - **Android Bug Impact**: Setting `transparent_pixel.png` immediately triggers `AudioControlsService.kt` on Android to build a `MediaSession` and notification with a 1x1 transparent bitmap. A few milliseconds later, when `loadArtwork()` resolves, `setActiveForLockScreen` is called again. Rapidly recreating `MediaSession` / notification on Android causes `AudioControlsService.kt` to drop or fail to render the second bitmap update.
3. **Android Asset Handling Issues**:
   - In release/standalone Android builds, bundled assets use Android resource schemes (`res:///`, `android.resource://`). The current code attempts `FileSystemLegacy.copyAsync` from these schemes, which consistently fails on Android.
   - In dev builds, `Asset.downloadAsync()` caches files as `ExponentAsset-<hash>.png`. However, Android's `AudioControlsService.kt` decodes `URL(artworkUrl)` via `BitmapFactory.decodeStream()`. When raw cache URIs or incomplete copies are passed during rapid metadata changes, image decoding fails silently.

### Proposed Technical Changes

#### 1. Eliminate Transient Metadata Updates
- Avoid passing `TRANSPARENT_PIXEL_PATH` *before* `loadArtwork()` completes.
- Keep the current `artworkUrl` stable until the new artwork URL is resolved, or set `transparent_pixel.png` only after artwork resolution completes and confirms no artwork is available.

#### 2. Robust Android Asset Artwork Resolution
- Create a dedicated helper `resolveArtworkUri(rawUri)`:
  - If `rawUri` is a valid `http`/`https` or local `file://` path, return it directly.
  - If `rawUri` is a module ID (`number`), download the asset via `Asset.fromModule(rawUri)`.
  - For Android, verify file availability or copy the downloaded/resolved asset into a dedicated, clean cache file (e.g. `cacheDirectory + 'artwork_cache_' + hash + '.png'`) using `FileSystemLegacy`.
  - Handle bundled asset fallbacks gracefully without failing multi-URI loops.

#### 3. Code Simplification & Readability
- Extract asset resolution logic into pure async helper functions outside the hook (`resolveTrackArtwork`, `getFallbackArtwork`).
- Reduce `useTrackPlayer.ts` line count by consolidating duplicate fallback code and deep nesting.
- Retain targeted `console.log` statements prefixed with `BMverse: useTrackPlayer:` for Android troubleshooting.

### Code Structure in `useTrackPlayer.ts`
```typescript
// Helper: Resolves raw cover URI (file path, web URL, or asset number) to an Android-compatible file URI
async function resolveArtworkUri(rawUri: string | number | null | undefined): Promise<string> {
  if (!rawUri) return await getFallbackArtworkUri();
  if (typeof rawUri === 'string' && isValidUrl(rawUri)) return rawUri;

  try {
    const asset = Asset.fromModule(rawUri);
    await asset.downloadAsync();
    let uri = asset.localUri || asset.uri;

    if (Platform.OS === 'android') {
      return await prepareAndroidArtworkFile(asset, uri);
    }
    return uri?.startsWith('/') ? `file://${uri}` : (uri || await getFallbackArtworkUri());
  } catch (error) {
    console.warn('BMverse: useTrackPlayer: Artwork resolution failed:', error);
    return await getFallbackArtworkUri();
  }
}
```

# Testing

### Validation Approach
Verification will be performed on physical Android and iOS devices (Dev Builds and Production/Preview Builds).

### Key Scenarios
1. **User Picked File Cover (Android & iOS)**:
   - Select a custom image file (`file://...`). Play track and verify cover artwork displays on lock screen.
2. **Bundled Asset Cover (Android & iOS)**:
   - Play a song with a numeric asset cover (`require(...)`). Verify cover artwork displays on Android lock screen.
3. **Fallback Cover (Android & iOS)**:
   - Play a song with no cover (`appCoverUri = null`). Verify `notFound` fallback artwork displays on lock screen.
4. **Track Switch Flow**:
   - Skip rapidly between tracks with different cover types. Verify lock screen updates correctly without sticking or remaining transparent.

# Delivery Steps

### ✓ Step 1: Refactor artwork resolution and Android asset handling in useTrackPlayer.ts
Asset resolution in useTrackPlayer.ts is simplified and made fully Android-compatible for all cover types.

- Extract artwork URI resolution out of the main hook body into modular helper functions (`resolveArtworkUri`, `prepareAndroidArtworkFile`).
- Fix Android asset file resolution for numeric asset IDs (`require(...)`) to produce valid, accessible local file URIs for lock screen metadata.
- Implement robust fallback logic for missing artwork (`IMAGES.cover200.notFound`).
- Add structured `BMverse: useTrackPlayer:` diagnostic logging for Android artwork loading.

### ✓ Step 2: Fix metadata synchronization and eliminate lockscreen update race conditions
Lockscreen metadata updates on Android occur seamlessly without dropped updates or transparent pixel race conditions.

- Update proxy player metadata sync effect in `useTrackPlayer.ts` to prevent premature `transparent_pixel.png` assignment during track transitions.
- Ensure `proxyPlayer.setActiveForLockScreen()` is called with resolved artwork URLs once resolution is complete.
- Validate track switching behavior on Android and iOS to ensure lockscreen metadata stays synchronized with the active track.