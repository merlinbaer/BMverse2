---
sessionId: session-260726-154505-1u5w
---

# Requirements

### Overview & Goals
The goal is to implement a dynamic background gradient for the `TrackPlayer` modal. The top color of the gradient should match the dominant color of the currently playing track's cover image, while the bottom color should be a standard dark transparent color.

### Scope
- **In Scope**:
    - Extending `AppModalScreen` to support custom background gradients via props.
    - Updating `TrackPlayer` to calculate the dominant color of the current track from the `coverFiles$` store.
    - Synchronizing the track's dominant color with the `AppModalScreen` background using a Legend State observable.
- **Out of Scope**:
    - Changing the background of other modals (they will retain their default behavior).
    - Persisting the "current dominant color" across app restarts (it's purely for the active UI).

### User Stories
- As a user, I want the track player to have a background that matches the album artwork so that the experience feels more immersive.
- As a developer, I want a generic way to customize the modal background gradient while keeping the component reusable.

### Functional Requirements
- `AppModalScreen` must accept an optional `gradientColors` prop.
- When the track in `TrackPlayer` changes, the `AppModalScreen` background must smoothly update (via React rendering) to use the new dominant color.
- If no dominant color is found, the modal should fall back to its default background color.
- The dominant color calculation must use `currentTrack.appCoverUri` to find the matching `CoverFile` in the `coverFiles$` store.

# Technical Design

### Current Implementation
- `AppModalScreen` has a hardcoded solid background gradient using `COLORS.MODAL_BACKGROUND`.
- `TrackPlayer` uses `AppModalScreen` but doesn't pass any specific styling information to it.
- `coverFiles$` stores `dominantColor` for both app assets and imported covers.

### Key Decisions
- **Use Legend State for UI synchronization**: We will use a memory-based Legend State observable `currentPlayerDominantColor$` to pass the color from the `TrackContent` (where the player state lives) to the `TrackPlayerScreen` (where `AppModalScreen` is rendered). This avoids prop drilling and complex lifting of the `useTrackPlayer` hook.
- **Generic `AppModalScreen` Props**: We will add a `gradientColors` prop to `AppModalScreen` to keep it generic and reusable for other features that might need custom backgrounds in the future.

### Proposed Changes

#### Legend State (`src/services/legend/memory/variables.ts`)
- Add `currentPlayerDominantColor$` observable.

#### Generic Component (`src/components/AppModalScreen.tsx`)
- Add `gradientColors?: readonly (string | number)[]` to `AppModalScreenProps`.
- Use this prop if provided; otherwise, use the default solid `COLORS.MODAL_BACKGROUND` gradient.

#### Track Player (`src/app/(main)/(global)/TrackPlayer.tsx`)
- In `TrackContent`, use `useEffect` to find the current track's dominant color in `coverFiles$` and update `currentPlayerDominantColor$`.
- In `TrackPlayerScreen`, use `useValue(currentPlayerDominantColor$)` to retrieve the color and construct the `gradientColors` array `[color, COLORS.MODAL_GRADIENT_BOTTOM]`.
- Pass the constructed colors to `AppModalScreen`.

### File Structure
- `src/services/legend/memory/variables.ts`: Added `currentPlayerDominantColor$`.
- `src/components/AppModalScreen.tsx`: Updated `AppModalScreen` to support `gradientColors` prop.
- `src/app/(main)/(global)/TrackPlayer.tsx`: Integrated dominant color syncing and custom gradient.

### Risks
- **Performance**: Frequent updates to `currentPlayerDominantColor$` might trigger re-renders. However, this only happens when the track changes, which is infrequent.
- **Color Contrast**: Some dominant colors might be too bright or have poor contrast with the player controls. Using `COLORS.MODAL_GRADIENT_BOTTOM` as the bottom color helps ensure a dark base for the controls at the bottom of the screen.

# Testing

### Validation Approach
Verification will be done by opening the `TrackPlayer` and switching between tracks with different cover arts.

### Key Scenarios
- **Dynamic Color Update**: Start playback and open the player modal. Verify that the background gradient top color matches the artwork. Skip to the next track and verify the background color updates.
- **Default Fallback**: Play a track that has no cover or whose cover color extraction failed. Verify that the modal uses the default background.
- **Other Modals**: Open another modal (e.g., `SongSort`). Verify that its background remains the default solid color.

### Edge Cases
- **Closing Modal**: Ensure that `currentPlayerDominantColor$` is cleared when the `TrackPlayer` is unmounted.
- **Rapid Track Skipping**: Verify that the background updates correctly even if tracks are skipped quickly.

# Delivery Steps

### ✓ Step 1: Add currentPlayerDominantColor$ observable
Add `currentPlayerDominantColor$` to the memory variables store.
- Edit `src/services/legend/memory/variables.ts` to add `export const currentPlayerDominantColor$ = observable<string | null>(null)`.

### ✓ Step 2: Update AppModalScreen to support custom gradients
Modify `AppModalScreen` to accept an optional `gradientColors` prop and use it for the background.
- Update `AppModalScreenProps` in `src/components/AppModalScreen.tsx` to include `gradientColors?: readonly (string | number)[]`.
- Update the component logic to use the provided `gradientColors` or fall back to the default `COLORS.MODAL_BACKGROUND` solid gradient.

### ✓ Step 3: Update TrackPlayer to sync dominant color and use custom gradient
Integrate dominant color extraction and synchronization into the `TrackPlayer` screen.
- Update `TrackPlayerScreen` in `src/app/(main)/(global)/TrackPlayer.tsx` to use `useValue(currentPlayerDominantColor$)` and pass the calculated gradient to `AppModalScreen`.
- Update `TrackContent` to use `useEffect` and `useValue(coverFiles$)` to find the current track's dominant color and update `currentPlayerDominantColor$`.
- Ensure the observable is cleared when the component unmounts.