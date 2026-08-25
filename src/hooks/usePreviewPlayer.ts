import { useValue } from '@legendapp/state/react'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { activePreviewSong$ } from '@/services/legend'
import { isValidUrl } from '@/services/urlHelper'

export const usePreviewPlayer = (onFinished?: () => void) => {
  const previewSong = useValue(activePreviewSong$)
  const player = useAudioPlayer({ uri: previewSong?.song_preview ?? '' })
  const status = useAudioPlayerStatus(player)

  const [resolvedArtworkUrl, setResolvedArtworkUrl] = useState<
    string | undefined
  >(undefined)
  const [lastArtworkId, setLastArtworkId] = useState<string | undefined>(
    previewSong?.song_preview ?? undefined,
  )

  const currentId = previewSong?.song_preview ?? undefined
  if (currentId !== lastArtworkId) {
    setLastArtworkId(currentId)
    setResolvedArtworkUrl(undefined)
  }

  // Resolve artwork URL for lock screen metadata
  useEffect(() => {
    let isCancelled = false
    const loadArtwork = async () => {
      if (!previewSong?.song_preview_artwork) {
        return
      }

      let url: string | undefined = undefined
      const rawUri = previewSong.song_preview_artwork

      try {
        if (typeof rawUri === 'string' && isValidUrl(rawUri)) {
          url = rawUri
        }
      } catch (e) {
        console.warn('usePreviewPlayer: loadArtwork failed', e)
      }

      if (!isCancelled) {
        setResolvedArtworkUrl(url)
      }
    }

    void loadArtwork()
    return () => {
      isCancelled = true
    }
  }, [previewSong?.song_preview_artwork])

  // Handle auto-dismiss / finished callback
  useEffect(() => {
    if (status?.didJustFinish && onFinished) {
      onFinished()
    }
  }, [status?.didJustFinish, onFinished])

  useEffect(() => {
    if (player && previewSong?.song_preview) {
      const isExpoGo =
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient

      const shouldSetLockScreen =
        Platform.OS === 'web' ||
        Platform.OS === 'ios' ||
        (Platform.OS === 'android' && !isExpoGo)

      if (shouldSetLockScreen) {
        const artworkUrl =
          typeof resolvedArtworkUrl === 'string' &&
          isValidUrl(resolvedArtworkUrl)
            ? resolvedArtworkUrl
            : undefined

        try {
          player.setActiveForLockScreen(true, {
            title: previewSong.song_title ?? 'Unknown Song',
            artist: previewSong.song_artist ?? 'Unknown Artist',
            artworkUrl: artworkUrl,
          })
        } catch (e) {
          console.warn('usePreviewPlayer: setActiveForLockScreen failed', e)
        }
      }
      player.play()
    }
  }, [player, previewSong, resolvedArtworkUrl])

  const handlePlayPause = () => {
    if (status?.playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const skipBackward = (sec = 5) => {
    const newPos = Math.max(0, (status?.currentTime ?? 0) - sec)
    void player.seekTo(newPos)
  }

  const skipForward = (sec = 5) => {
    const newPos = Math.min(
      status?.duration ?? 0,
      (status?.currentTime ?? 0) + sec,
    )
    void player.seekTo(newPos)
  }

  return {
    player,
    status,
    previewSong,
    handlePlayPause,
    skipBackward,
    skipForward,
    duration: status?.duration ?? 0,
    currentTime: status?.currentTime ?? 0,
    progress:
      (status?.duration ?? 0) > 0
        ? (status?.currentTime ?? 0) / (status?.duration ?? 0)
        : 0,
    isPlaying: status?.playing ?? false,
  }
}
