import { useValue } from '@legendapp/state/react'
import { Asset } from 'expo-asset'
import {
  useAudioPlayer,
  useAudioPlayerStatus,
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
    if (!fallbackAssetModule) return undefined

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
 * Ensures an Android-compatible local file URI exists for lock screen artwork metadata.
 */
async function prepareAndroidArtworkFile(
  asset: Asset,
  candidate: string,
): Promise<string | undefined> {
  if (candidate.startsWith('file://')) {
    try {
      const fileInfo = await FileSystemLegacy.getInfoAsync(candidate)
      if (fileInfo.exists) {
        return candidate
      }
    } catch (e) {
      console.log('BMverse: useTrackPlayer: getInfoAsync failed:', candidate, e)
    }
  } else if (
    isValidUrl(candidate) &&
    (candidate.startsWith('http://') || candidate.startsWith('https://'))
  ) {
    return candidate
  }

  try {
    const ext = asset.type ? `.${asset.type}` : '.png'
    const cacheFilename = `artwork_cache_${asset.hash || asset.name || 'unknown'}${ext}`
    const cachePath = `${FileSystemLegacy.cacheDirectory}${cacheFilename}`

    const cacheInfo = await FileSystemLegacy.getInfoAsync(cachePath)
    if (cacheInfo.exists) {
      return cachePath
    }

    const sourceUri = asset.localUri || candidate
    if (sourceUri && sourceUri !== cachePath) {
      try {
        await FileSystemLegacy.copyAsync({ from: sourceUri, to: cachePath })
        return cachePath
      } catch (copyErr) {
        console.log(
          'BMverse: useTrackPlayer: copyAsync failed from',
          sourceUri,
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
 * Helper: Resolves raw cover URI (file path, web URL, or asset number) to an Android/iOS lockscreen compatible URI.
 */
export async function resolveArtworkUri(
  rawUri: string | number | null | undefined,
): Promise<string | undefined> {
  if (!rawUri) {
    return await getFallbackArtworkUri()
  }

  if (typeof rawUri === 'string') {
    if (isValidUrl(rawUri)) {
      return rawUri
    }
    if (rawUri.startsWith('/')) {
      return `file://${rawUri}`
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

  // Proxy player for lock screen metadata (since AudioPlaylist currently lacks it in expo-audio)
  const proxyPlayer = useAudioPlayer(null)
  const proxyStatus = useAudioPlayerStatus(proxyPlayer)

  const isReplacing = useRef(false)
  const lastStatusPlaying = useRef(status?.playing)
  const lastProxyPlaying = useRef(proxyStatus.playing)
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
      if (!currentTrack) return

      const url = await resolveArtworkUri(currentTrack.appCoverUri)

      if (!isCancelled) {
        setResolvedArtworkUrl(url)
      }
    }

    void loadArtwork()
    return () => {
      isCancelled = true
    }
  }, [currentTrack])

  // Synchronize current track metadata to lock screen via proxy player
  useEffect(() => {
    if (!proxyPlayer) return

    if (!currentTrack) {
      try {
        proxyPlayer.setActiveForLockScreen(false)
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: Failed to deactivate lock screen controls',
          e,
        )
      }
      return
    }

    // Do not set lock screen controls with transient pixel while artwork resolution is in progress
    if (resolvedArtworkUrl === undefined) return

    isReplacing.current = true

    // Load source into proxy player (muted) so it can be active for lock screen
    proxyPlayer.replace(currentTrack.audioUri)
    proxyPlayer.volume = 0

    // Resolve artwork URL for lock screen
    // Note: Play/Pause on the lock screen will control this proxy player.
    // We relay those states back to the playlist in the next effect.
    const artworkUrl =
      typeof resolvedArtworkUrl === 'string' &&
      isValidUrl(resolvedArtworkUrl) &&
      !resolvedArtworkUrl.startsWith('data:')
        ? resolvedArtworkUrl
        : TRANSPARENT_PIXEL_PATH

    try {
      proxyPlayer.setActiveForLockScreen(true, {
        title: currentTrack.title || currentTrack.origTitle || 'Unknown Title',
        artist:
          currentTrack.artist || currentTrack.origArtist || 'Unknown Artist',
        albumTitle:
          currentTrack.album || currentTrack.origAlbum || 'Unknown Album',
        artworkUrl: artworkUrl,
      })
    } catch (e) {
      console.log('useTrackPlayer: setActiveForLockScreen failed', e)
    }

    // Initial sync of playing state after replacement
    if (status?.playing) {
      proxyPlayer.play()
    } else {
      proxyPlayer.pause()
    }
    lastStatusPlaying.current = status?.playing
    lastProxyPlaying.current = proxyStatus.playing

    // Reset isReplacing after a short delay to allow status to stabilize
    const timer = setTimeout(() => {
      isReplacing.current = false
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, proxyPlayer, resolvedArtworkUrl])

  // Synchronize playback state between real playlist and proxy player (lock screen)
  useEffect(() => {
    if (!proxyPlayer || !status) return

    const isPlaying = status.playing
    const isProxyPlaying = proxyStatus.playing

    if (isPlaying !== lastStatusPlaying.current) {
      // In-app change: Sync TO proxy
      if (isPlaying) {
        proxyPlayer.play()
      } else {
        proxyPlayer.pause()
      }
      lastStatusPlaying.current = isPlaying
      // We don't update lastProxyPlaying here to avoid the race condition loop.
      // It will be updated in the next cycles when isProxyPlaying matches isPlaying.
    } else if (isProxyPlaying !== lastProxyPlaying.current) {
      // Proxy state changed (lock screen interaction or sync finishing)

      // CRITICAL: We only sync back to the playlist if we are NOT in the middle of a track change.
      // A track change causes the proxy player to be replaced, which momentarily reports playing: false.
      if (isProxyPlaying !== isPlaying && !isReplacing.current) {
        // This is a real change from the lock screen controls
        if (isProxyPlaying) {
          playlist.play()
        } else {
          playlist.pause()
        }
        lastStatusPlaying.current = isProxyPlaying
      }
      lastProxyPlaying.current = isProxyPlaying
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.playing, proxyStatus.playing, proxyPlayer, playlist])

  // Synchronize external index -> Playlist index (Manual selection from lists)
  useEffect(() => {
    if (activeIndex !== lastSyncedIndex.current) {
      if (!status) return

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
      lastSyncedIndex.current = status.currentIndex
      activeTrackIndex$.set(status.currentIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.currentIndex, activeIndex])

  const next = useCallback(() => {
    playlist.next()
  }, [playlist])

  const previous = useCallback(() => {
    playlist.previous()
  }, [playlist])

  // Auto-advance
  useEffect(() => {
    if (status?.didJustFinish) {
      if (status.currentIndex === files.length - 1) {
        onFinished?.()
      }
    }
  }, [status?.didJustFinish, status?.currentIndex, files.length, onFinished])

  const handlePlayPause = () => {
    if (status?.playing) {
      playlist.pause()
    } else {
      playlist.play()
    }
  }

  const seek = (time: number) => playlist.seekTo(time)

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
