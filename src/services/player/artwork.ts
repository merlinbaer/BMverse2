import { File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { getAssetLocalUri, getFallbackArtworkAssetUri } from '@/services/assets'
import { isValidUrl } from '@/services/urlHelper'
import { MusicFile } from '@/types/player'

/**
 * Copies a local file or asset to the Android cache directory to ensure MediaSession and lock screen access.
 */
async function ensureAndroidCachedFile(
  uri: string,
  customName?: string,
): Promise<string | null> {
  if (Platform.OS !== 'android') return uri

  try {
    let formattedUri = uri
    if (formattedUri.startsWith('/') && !formattedUri.startsWith('file://')) {
      formattedUri = `file://${formattedUri}`
    }

    const cacheDir = Paths.cache
    const filename =
      customName || formattedUri.split('/').pop() || 'artwork.png'
    const destinationFile = new File(cacheDir, `artwork_cache_${filename}`)

    if (destinationFile.exists) {
      return destinationFile.uri
    }

    const sourceFile = new File(formattedUri)
    if (sourceFile.exists) {
      try {
        await sourceFile.copy(destinationFile)
        return destinationFile.uri
      } catch (copyErr) {
        console.warn(
          `BMverse: ensureAndroidCachedFile copy failed for ${formattedUri}, trying base64 fallback:`,
          copyErr,
        )
        const base64 = await sourceFile.base64()
        await destinationFile.write(base64, { encoding: 'base64' })
        return destinationFile.uri
      }
    } else {
      console.warn(
        `BMverse: ensureAndroidCachedFile source file does not exist: ${formattedUri}`,
      )
      return null
    }
  } catch (e) {
    console.error('BMverse: ensureAndroidCachedFile error:', e)
    return null
  }
}

/**
 * Resolves and prepares a safe lock screen artwork URI (file:// in cache on Android or standard file/URL on iOS/Web).
 */
export async function prepareLockScreenArtworkUri(
  rawCoverUri: string | number | null | undefined,
): Promise<string | null> {
  try {
    if (!rawCoverUri) {
      const fallbackUri = await getFallbackArtworkAssetUri()
      if (!fallbackUri) return null

      if (Platform.OS === 'android') {
        return await ensureAndroidCachedFile(fallbackUri, 'fallback.png')
      }
      return fallbackUri
    }

    if (typeof rawCoverUri === 'string') {
      if (
        isValidUrl(rawCoverUri) &&
        (rawCoverUri.startsWith('http://') ||
          rawCoverUri.startsWith('https://'))
      ) {
        return rawCoverUri
      }

      let formattedUri = rawCoverUri
      if (formattedUri.startsWith('/') && !formattedUri.startsWith('file://')) {
        formattedUri = `file://${formattedUri}`
      }

      if (Platform.OS === 'android') {
        const cached = await ensureAndroidCachedFile(formattedUri)
        if (cached) return cached

        // Fallback if missing
        const fallbackUri = await getFallbackArtworkAssetUri()
        if (fallbackUri) {
          return await ensureAndroidCachedFile(fallbackUri, 'fallback.png')
        }
        return null
      }

      return formattedUri
    }

    if (typeof rawCoverUri === 'number') {
      const assetUri = await getAssetLocalUri(rawCoverUri)
      if (!assetUri) {
        const fallbackUri = await getFallbackArtworkAssetUri()
        if (!fallbackUri) return null
        if (Platform.OS === 'android') {
          return await ensureAndroidCachedFile(fallbackUri, 'fallback.png')
        }
        return fallbackUri
      }

      if (Platform.OS === 'android') {
        return await ensureAndroidCachedFile(
          assetUri,
          `asset_${rawCoverUri}.png`,
        )
      }

      return assetUri
    }

    return null
  } catch (error) {
    console.error('BMverse: prepareLockScreenArtworkUri failed:', error)
    try {
      const fallbackUri = await getFallbackArtworkAssetUri()
      if (fallbackUri && Platform.OS === 'android') {
        return await ensureAndroidCachedFile(fallbackUri, 'fallback.png')
      }
      return fallbackUri ?? null
    } catch {
      return null
    }
  }
}

/**
 * Prepares an array of MusicFiles for playback by resolving and populating safe lock screen URIs in `coverUri`.
 * Memoizes artwork preparation across tracks that share the same `appCoverUri` to eliminate duplicate I/O operations.
 */
export async function prepareTracksForPlayback(
  tracks: MusicFile[],
): Promise<MusicFile[]> {
  const coverCache = new Map<string | number, string | null>()
  const preparedTracks: MusicFile[] = []

  for (const track of tracks) {
    const rawCover = track.appCoverUri
    let safeCoverUri: string | null = null

    if (rawCover === null || rawCover === undefined) {
      if (coverCache.has('__FALLBACK__')) {
        safeCoverUri = coverCache.get('__FALLBACK__') ?? null
      } else {
        safeCoverUri = await prepareLockScreenArtworkUri(null)
        coverCache.set('__FALLBACK__', safeCoverUri)
      }
    } else if (coverCache.has(rawCover)) {
      safeCoverUri = coverCache.get(rawCover) ?? null
    } else {
      safeCoverUri = await prepareLockScreenArtworkUri(rawCover)
      coverCache.set(rawCover, safeCoverUri)
    }

    preparedTracks.push({
      ...track,
      coverUri: safeCoverUri,
    })
  }

  return preparedTracks
}
