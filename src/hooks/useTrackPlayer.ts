import { useValue } from '@legendapp/state/react'

import {
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from 'expo-audio'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image } from 'react-native'
import { File } from 'expo-file-system'

import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'

export const useTrackPlayer = (onFinished?: () => void) => {
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

  const lastStatusPlaying = useRef(status?.playing)
  const lastProxyPlaying = useRef(proxyStatus.playing)
  const lastSyncedIndex = useRef(activeIndex)

  const [resolvedArtworkUrl, setResolvedArtworkUrl] = useState<
    string | undefined
  >(undefined)

  // Resolve artwork to data URI for lock screen if it's a local file
  useEffect(() => {
    let isCancelled = false
    const loadArtwork = async () => {
      if (!currentTrack) {
        setResolvedArtworkUrl(undefined)
        return
      }

      let url: string | undefined = undefined
      const rawUri = currentTrack.appCoverUri

      if (typeof rawUri === 'string') {
        url = rawUri
        if (url.startsWith('file://')) {
          try {
            const file = new File(url)
            const base64 = await file.base64()
            const extension = url.split('.').pop()?.toLowerCase() || 'jpeg'
            const mime = extension === 'png' ? 'image/png' : 'image/jpeg'
            url = `data:${mime};base64,${base64}`
          } catch (e) {
            console.warn('BMverse: Failed to read artwork for lock screen', e)
          }
        }
      } else if (typeof rawUri === 'number') {
        url = Image.resolveAssetSource(rawUri).uri
      }

      if (!isCancelled) {
        setResolvedArtworkUrl(url)
      }
    }

    loadArtwork()
    return () => {
      isCancelled = true
    }
  }, [currentTrack])

  // Synchronize current track metadata to lock screen via proxy player
  useEffect(() => {
    if (!currentTrack || !proxyPlayer) return

    // Load source into proxy player (muted) so it can be active for lock screen
    proxyPlayer.replace(currentTrack.audioUri)
    proxyPlayer.volume = 0

    // We only set the metadata.
    // Note: Play/Pause on the lock screen will control this proxy player.
    // We relay those states back to the playlist in the next effect.
    proxyPlayer.setActiveForLockScreen(
      true,
      {
        title: currentTrack.title || currentTrack.origTitle || 'Unknown Title',
        artist:
          currentTrack.artist || currentTrack.origArtist || 'Unknown Artist',
        albumTitle:
          currentTrack.album || currentTrack.origAlbum || 'Unknown Album',
        artworkUrl: resolvedArtworkUrl,
      },
      {
        isLiveStream: true,
        showSeekBackward: false,
        showSeekForward: false,
      },
    )

    // Sync playing state to proxy after replacement if needed
    if (status?.playing) {
      proxyPlayer.play()
      lastStatusPlaying.current = true
      lastProxyPlaying.current = true
    } else {
      proxyPlayer.pause()
      lastStatusPlaying.current = false
      lastProxyPlaying.current = false
    }
  }, [currentTrack, proxyPlayer, resolvedArtworkUrl])

  // Synchronize playback state between real playlist and proxy player (lock screen)
  useEffect(() => {
    if (!proxyPlayer || !status) return

    const isPlaying = status.playing
    const isProxyPlaying = proxyStatus.playing

    if (isPlaying !== lastStatusPlaying.current) {
      // In-app change
      if (isPlaying) {
        proxyPlayer.play()
      } else {
        proxyPlayer.pause()
      }
      lastStatusPlaying.current = isPlaying
      lastProxyPlaying.current = isPlaying
    } else if (isProxyPlaying !== lastProxyPlaying.current) {
      // Lock screen change
      if (isProxyPlaying) {
        playlist.play()
      } else {
        playlist.pause()
      }
      lastProxyPlaying.current = isProxyPlaying
      lastStatusPlaying.current = isProxyPlaying
    }
  }, [status?.playing, proxyStatus.playing, proxyPlayer, playlist])

  // Synchronize external index -> Playlist index (Manual selection from lists)
  useEffect(() => {
    if (activeIndex !== lastSyncedIndex.current) {
      lastSyncedIndex.current = activeIndex
      if (
        status &&
        status.currentIndex !== activeIndex &&
        activeIndex >= 0 &&
        activeIndex < files.length
      ) {
        playlist.skipTo(activeIndex)
        playlist.play()
      }
    }
  }, [activeIndex, playlist, files.length])

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
