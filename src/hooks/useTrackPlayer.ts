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
import { Platform } from 'react-native'

import { IMAGES } from '@/constants/images'
import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'
import { isValidUrl } from '@/services/urlHelper'

export const useTrackPlayer = (onFinished?: () => void) => {
  useEffect(() => {
    console.log(
      'BMverse: Build 2026-08-26 17:25 - SDK 57 Asset & FileSystem Fix Applied',
    )
  }, [])
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
      if (!currentTrack) {
        return
      }

      let url: string | undefined = undefined
      const rawUri = currentTrack.appCoverUri

      try {
        if (typeof rawUri === 'string' && isValidUrl(rawUri)) {
          url = rawUri
        } else if (
          typeof rawUri === 'number' ||
          (typeof rawUri === 'string' && rawUri.length > 0)
        ) {
          const asset = Asset.fromModule(rawUri)
          await asset.downloadAsync()

          let candidate = asset.localUri || asset.uri
          if (candidate) {
            if (candidate.startsWith('/') && !candidate.startsWith('file://')) {
              candidate = `file://${candidate}`
            }

            const isBundledAndroid =
              Platform.OS === 'android' &&
              (candidate.startsWith('asset://') ||
                candidate.startsWith('res://') ||
                candidate.startsWith('android.resource://') ||
                candidate.startsWith('file:///android_res/') ||
                candidate.startsWith('file:///android_asset/'))

            if (isValidUrl(candidate) && !isBundledAndroid) {
              url = candidate
            } else if (isBundledAndroid) {
              try {
                const cachePath = `${FileSystemLegacy.cacheDirectory}artwork_${asset.hash || 'unknown'}`
                await FileSystemLegacy.copyAsync({
                  from: candidate,
                  to: cachePath,
                })
                url = cachePath
              } catch (e) {
                console.warn('useTrackPlayer: Failed to copy bundled asset', e)
              }
            }
          }
        }

        if (!url) {
          const asset = Asset.fromModule(IMAGES.cover200.notFound)
          await asset.downloadAsync()
          let candidate = asset.localUri || asset.uri
          if (candidate) {
            if (candidate.startsWith('/') && !candidate.startsWith('file://')) {
              candidate = `file://${candidate}`
            }
            const isBundledAndroid =
              Platform.OS === 'android' &&
              (candidate.startsWith('asset://') ||
                candidate.startsWith('res://') ||
                candidate.startsWith('android.resource://') ||
                candidate.startsWith('file:///android_res/') ||
                candidate.startsWith('file:///android_asset/'))

            if (isValidUrl(candidate) && !isBundledAndroid) {
              url = candidate
            } else if (isBundledAndroid) {
              try {
                const cachePath = `${FileSystemLegacy.cacheDirectory}artwork_fallback_${asset.hash || 'unknown'}`
                await FileSystemLegacy.copyAsync({
                  from: candidate,
                  to: cachePath,
                })
                url = cachePath
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                // ignore
              }
            }
          }
        }
      } catch (e) {
        console.warn('useTrackPlayer: loadArtwork failed', e)
      }

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
    if (!currentTrack || !proxyPlayer) return

    isReplacing.current = true

    // Load source into proxy player (muted) so it can be active for lock screen
    proxyPlayer.replace(currentTrack.audioUri)
    proxyPlayer.volume = 0

    // Resolve artwork URL for lock screen
    // We only set the metadata.
    // Note: Play/Pause on the lock screen will control this proxy player.
    // We relay those states back to the playlist in the next effect.
    const artworkUrl =
      typeof resolvedArtworkUrl === 'string' && isValidUrl(resolvedArtworkUrl)
        ? resolvedArtworkUrl
        : undefined

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
      console.warn('useTrackPlayer: setActiveForLockScreen failed', e)
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
