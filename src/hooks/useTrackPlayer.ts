import { useValue } from '@legendapp/state/react'
import { Asset } from 'expo-asset'
import {
  AudioLockScreenOptions,
  AudioMetadata,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from 'expo-audio'
import * as FileSystemLegacy from 'expo-file-system/legacy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, Platform } from 'react-native'

import { IMAGES } from '@/constants/images'
import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'
import { isValidUrl } from '@/services/urlHelper'

/**
 * Fallback artwork URI resolution for missing covers using IMAGES.cover200.notFound.
 */
async function getFallbackArtworkUri(): Promise<string | undefined> {
  try {
    const fallbackAssetModule = IMAGES.cover200.notFound
    if (!fallbackAssetModule) {
      console.log('BMverse: useTrackPlayer: Fallback asset module not found')
      return undefined
    }

    const asset = Asset.fromModule(fallbackAssetModule)
    await asset.downloadAsync()

    let uri = asset.localUri || asset.uri

    if (!uri || (!isValidUrl(uri) && !uri.startsWith('/'))) {
      try {
        const resolved = Image.resolveAssetSource(
          typeof fallbackAssetModule === 'number'
            ? fallbackAssetModule
            : { uri: fallbackAssetModule },
        )
        if (resolved?.uri) {
          uri = resolved.uri
        }
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: resolveAssetSource fallback failed:',
          e,
        )
      }
    }

    if (uri && Platform.OS === 'android') {
      return await prepareAndroidArtworkFile(asset, uri)
    }

    if (uri?.startsWith('/') && !uri.startsWith('file://')) {
      return `file://${uri}`
    }

    return uri || undefined
  } catch (error) {
    console.log(
      'BMverse: useTrackPlayer: Failed to load fallback artwork:',
      error,
    )
    return undefined
  }
}

/**
 * Ensures an Android-compatible local file URI exists for lock screen artwork metadata from bundled assets.
 */
async function prepareAndroidArtworkFile(
  asset: Asset,
  candidate: string,
): Promise<string | undefined> {
  if (
    isValidUrl(candidate) &&
    (candidate.startsWith('http://') || candidate.startsWith('https://'))
  ) {
    return candidate
  }

  const cacheDir = FileSystemLegacy.cacheDirectory
  if (
    candidate.startsWith('file://') &&
    cacheDir &&
    candidate.startsWith(cacheDir)
  ) {
    try {
      const fileInfo = await FileSystemLegacy.getInfoAsync(candidate)
      if (fileInfo.exists) {
        return candidate
      }
    } catch (e) {
      console.log(
        'BMverse: useTrackPlayer: getInfoAsync failed for cached candidate:',
        candidate,
        e,
      )
    }
  }

  try {
    const ext = asset.type ? `.${asset.type}` : '.png'
    const cacheFilename = `artwork_cache_${asset.hash || asset.name || 'fallback'}${ext}`
    const cachePath = `${cacheDir}${cacheFilename}`

    const cacheInfo = await FileSystemLegacy.getInfoAsync(cachePath)
    if (cacheInfo.exists) {
      return cachePath
    }

    let sourceUri = asset.localUri || candidate
    if (sourceUri.startsWith('/') && !sourceUri.startsWith('file://')) {
      sourceUri = `file://${sourceUri}`
    }

    if (sourceUri && sourceUri !== cachePath) {
      try {
        await FileSystemLegacy.copyAsync({ from: sourceUri, to: cachePath })
        console.log(
          'BMverse: useTrackPlayer: Copied asset artwork to cache for Android:',
          cachePath,
        )
        return cachePath
      } catch (copyErr) {
        console.log(
          'BMverse: useTrackPlayer: copyAsync failed from',
          sourceUri,
          'to',
          cachePath,
          copyErr,
        )
      }
    }
  } catch (e) {
    console.log('BMverse: useTrackPlayer: prepareAndroidArtworkFile failed:', e)
  }

  if (isValidUrl(candidate) || candidate.startsWith('file://')) {
    return candidate
  }

  return undefined
}

/**
 * Ensures an Android-compatible local file URI exists for lock screen artwork from documents / file picker.
 */
async function prepareAndroidLocalFile(
  localUri: string,
): Promise<string | undefined> {
  let formattedUri = localUri
  if (formattedUri.startsWith('/') && !formattedUri.startsWith('file://')) {
    formattedUri = `file://${formattedUri}`
  }

  const cacheDir = FileSystemLegacy.cacheDirectory

  // If already in cache directory and exists
  if (cacheDir && formattedUri.startsWith(cacheDir)) {
    try {
      const fileInfo = await FileSystemLegacy.getInfoAsync(formattedUri)
      if (fileInfo.exists) {
        return formattedUri
      }
    } catch (e) {
      console.log(
        'BMverse: useTrackPlayer: cache getInfoAsync failed:',
        formattedUri,
        e,
      )
    }
  }

  // Copy document / local file to cache directory for Android lockscreen/MediaSession access
  try {
    const rawFilename =
      formattedUri.split('/').pop() || `doc_artwork_${Date.now()}.png`
    const sanitizedFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const cachePath = `${cacheDir}artwork_cache_${sanitizedFilename}`

    const cacheInfo = await FileSystemLegacy.getInfoAsync(cachePath)
    if (cacheInfo.exists) {
      return cachePath
    }

    const sourceInfo = await FileSystemLegacy.getInfoAsync(formattedUri)
    if (sourceInfo.exists) {
      await FileSystemLegacy.copyAsync({ from: formattedUri, to: cachePath })
      console.log(
        'BMverse: useTrackPlayer: Copied document artwork to cache for Android:',
        cachePath,
      )
      return cachePath
    }
  } catch (e) {
    console.log(
      'BMverse: useTrackPlayer: prepareAndroidLocalFile failed:',
      formattedUri,
      e,
    )
  }

  return formattedUri
}

/**
 * Helper: Resolves raw cover URI (file path, web URL, or asset number) to an Android/iOS lockscreen compatible URI.
 */
export async function resolveArtworkUri(
  rawUri: string | number | null | undefined,
): Promise<string | undefined> {
  console.log('BMverse: useTrackPlayer: resolveArtworkUri called with:', rawUri)
  if (!rawUri) {
    return await getFallbackArtworkUri()
  }

  if (typeof rawUri === 'string') {
    if (
      isValidUrl(rawUri) &&
      (rawUri.startsWith('http://') || rawUri.startsWith('https://'))
    ) {
      return rawUri
    }

    if (Platform.OS === 'android') {
      const androidCachedPath = await prepareAndroidLocalFile(rawUri)
      if (androidCachedPath) return androidCachedPath
      return await getFallbackArtworkUri()
    }

    if (rawUri.startsWith('/')) {
      return `file://${rawUri}`
    }

    if (isValidUrl(rawUri) || rawUri.startsWith('file://')) {
      return rawUri
    }
  }

  try {
    const asset = Asset.fromModule(rawUri)
    await asset.downloadAsync()

    let candidate = asset.localUri || asset.uri

    if (!candidate || (!isValidUrl(candidate) && !candidate.startsWith('/'))) {
      try {
        const resolved = Image.resolveAssetSource(
          typeof rawUri === 'number' ? rawUri : { uri: rawUri },
        )
        if (resolved?.uri) {
          candidate = resolved.uri
        }
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: Image.resolveAssetSource failed:',
          e,
        )
      }
    }

    if (!candidate) {
      console.log('BMverse: useTrackPlayer: Candidate empty, loading fallback')
      return await getFallbackArtworkUri()
    }

    if (candidate.startsWith('/') && !candidate.startsWith('file://')) {
      candidate = `file://${candidate}`
    }

    if (Platform.OS === 'android') {
      const androidUri = await prepareAndroidArtworkFile(asset, candidate)
      if (androidUri) return androidUri
      return await getFallbackArtworkUri()
    }

    if (isValidUrl(candidate) || candidate.startsWith('file://')) {
      return candidate
    }

    return await getFallbackArtworkUri()
  } catch (error) {
    console.log('BMverse: useTrackPlayer: resolveArtworkUri failed:', error)
    return await getFallbackArtworkUri()
  }
}

export const useTrackPlayer = (onFinished?: () => void) => {
  const TRANSPARENT_PIXEL_PATH = `${FileSystemLegacy.cacheDirectory}transparent_pixel.png`

  useEffect(() => {
    // Ensure transparent pixel exists for clearing artwork
    const ensurePixel = async () => {
      try {
        const info = await FileSystemLegacy.getInfoAsync(TRANSPARENT_PIXEL_PATH)
        if (!info.exists) {
          const base64 =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
          await FileSystemLegacy.writeAsStringAsync(
            TRANSPARENT_PIXEL_PATH,
            base64,
            { encoding: 'base64' },
          )
        }
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: Failed to create transparent pixel',
          e,
        )
      }
    }
    void ensurePixel()
  }, [TRANSPARENT_PIXEL_PATH])

  const activeTracks = useValue(activeTrackList$)
  const allFiles = useValue(musicFiles$)
  const activeIndex = useValue(activeTrackIndex$)

  const files = useMemo(
    () => (activeTracks.length > 0 ? activeTracks : allFiles),
    [activeTracks, allFiles],
  )
  const currentTrack = files[activeIndex]

  const sources = useMemo(
    () =>
      files.map(f => ({
        uri: f.audioUri,
        name: f.title || f.origTitle || undefined,
      })),
    [files],
  )

  const playlist = useAudioPlaylist({
    sources,
    loop: 'none',
  })
  const status = useAudioPlaylistStatus(playlist)

  const lastSyncedIndex = useRef(-1)

  const [resolvedArtworkUrl, setResolvedArtworkUrl] = useState<
    string | undefined
  >(undefined)
  const [lastTrackUri, setLastTrackUri] = useState<string | undefined>(
    currentTrack?.audioUri ?? undefined,
  )

  const currentUri = currentTrack?.audioUri ?? undefined
  if (currentUri !== lastTrackUri) {
    setLastTrackUri(currentUri)
    setResolvedArtworkUrl(undefined)
  }

  // Resolve artwork URL for lock screen metadata
  useEffect(() => {
    let isCancelled = false
    const loadArtwork = async () => {
      if (!currentTrack) {
        setResolvedArtworkUrl(undefined)
        return
      }

      console.log(
        'BMverse: useTrackPlayer: Resolving artwork for track:',
        currentTrack.title || currentTrack.origTitle,
      )
      const url = await resolveArtworkUri(currentTrack.appCoverUri)

      if (!isCancelled) {
        console.log('BMverse: useTrackPlayer: Resolved artwork url:', url)
        setResolvedArtworkUrl(url)
      }
    }

    void loadArtwork()
    return () => {
      isCancelled = true
    }
  }, [currentTrack])

  // Synchronize current track metadata & lock screen controls to playlist
  useEffect(() => {
    if (!playlist) return

    if (!currentTrack) {
      console.log(
        'BMverse: useTrackPlayer: No current track, clearing lock screen controls',
      )
      try {
        playlist.clearLockScreenControls()
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: Failed to clear lock screen controls:',
          e,
        )
      }
      return
    }

    // Do not set lock screen controls with transient pixel while artwork resolution is in progress
    if (resolvedArtworkUrl === undefined) return

    const artworkUrl =
      typeof resolvedArtworkUrl === 'string' &&
      isValidUrl(resolvedArtworkUrl) &&
      !resolvedArtworkUrl.startsWith('data:')
        ? resolvedArtworkUrl
        : TRANSPARENT_PIXEL_PATH

    const metadata: AudioMetadata = {
      title: currentTrack.title || currentTrack.origTitle || 'Unknown Title',
      artist:
        currentTrack.artist || currentTrack.origArtist || 'Unknown Artist',
      albumTitle:
        currentTrack.album || currentTrack.origAlbum || 'Unknown Album',
      artworkUrl,
    }

    const lockScreenOptions: AudioLockScreenOptions = {
      showNextTrack: true,
      showPreviousTrack: true,
      showSeekForward: false,
      showSeekBackward: false,
      isLiveStream: false,
    }

    console.log(
      'BMverse: useTrackPlayer: Setting active for lock screen with metadata:',
      metadata,
      'options:',
      lockScreenOptions,
    )

    try {
      playlist.setActiveForLockScreen(true, metadata, lockScreenOptions)
    } catch (e) {
      console.log(
        'BMverse: useTrackPlayer: playlist.setActiveForLockScreen failed:',
        e,
      )
    }
  }, [currentTrack, playlist, resolvedArtworkUrl, TRANSPARENT_PIXEL_PATH])

  // Synchronize external index -> Playlist index (Manual selection from lists)
  useEffect(() => {
    if (activeIndex !== lastSyncedIndex.current) {
      if (!status) return

      console.log(
        `BMverse: useTrackPlayer: Syncing external index ${activeIndex} to playlist`,
      )
      lastSyncedIndex.current = activeIndex
      if (playlist && activeIndex >= 0 && activeIndex < files.length) {
        if (status.currentIndex !== activeIndex) {
          playlist.skipTo(activeIndex)
        }
        playlist.play()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, playlist, files.length, status?.currentIndex])

  // Synchronize playlist index -> External index (Native auto-advance or native skip)
  useEffect(() => {
    if (
      status &&
      status.currentIndex !== activeIndex &&
      status.currentIndex !== -1 &&
      status.currentIndex !== lastSyncedIndex.current
    ) {
      console.log(
        `BMverse: useTrackPlayer: Syncing playlist index ${status.currentIndex} to external activeTrackIndex$`,
      )
      lastSyncedIndex.current = status.currentIndex
      activeTrackIndex$.set(status.currentIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.currentIndex, activeIndex])

  const next = useCallback(() => {
    console.log('BMverse: useTrackPlayer: next() called')
    playlist.next()
  }, [playlist])

  const previous = useCallback(() => {
    console.log('BMverse: useTrackPlayer: previous() called')
    playlist.previous()
  }, [playlist])

  // Auto-advance
  useEffect(() => {
    if (status?.didJustFinish) {
      console.log(
        'BMverse: useTrackPlayer: Track finished at index:',
        status.currentIndex,
      )
      if (status.currentIndex === files.length - 1) {
        console.log('BMverse: useTrackPlayer: Reached end of playlist')
        onFinished?.()
      }
    }
  }, [status?.didJustFinish, status?.currentIndex, files.length, onFinished])

  const handlePlayPause = useCallback(() => {
    console.log(
      'BMverse: useTrackPlayer: handlePlayPause called, current playing:',
      status?.playing,
    )
    if (status?.playing) {
      playlist.pause()
    } else {
      playlist.play()
    }
  }, [playlist, status?.playing])

  const seek = useCallback(
    (time: number) => {
      console.log('BMverse: useTrackPlayer: seekTo called with time:', time)
      void playlist.seekTo(time)
    },
    [playlist],
  )

  return {
    player: playlist,
    status,
    currentTrack,
    handlePlayPause,
    next,
    previous,
    seek,
    isPlaying: status?.playing ?? false,
    progress:
      (status?.duration ?? 0) > 0
        ? (status?.currentTime ?? 0) / (status?.duration ?? 0)
        : 0,
    currentTime: status?.currentTime ?? 0,
    duration: status?.duration ?? 0,
  }
}
