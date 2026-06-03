import { useValue } from '@legendapp/state/react'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import { activePreviewSong$ } from '@/services/legend'

export const usePreviewPlayer = (onFinished?: () => void) => {
  const previewSong = useValue(activePreviewSong$)
  const player = useAudioPlayer({ uri: previewSong?.song_preview ?? '' })
  const status = useAudioPlayerStatus(player)

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
        Platform.OS === 'ios' || (Platform.OS === 'android' && !isExpoGo)

      if (shouldSetLockScreen) {
        try {
          player.setActiveForLockScreen(true, {
            title: previewSong.song_title ?? 'Unknown Song',
            artist: previewSong.song_artist ?? 'Unknown Artist',
            artworkUrl: previewSong.song_preview_artwork ?? undefined,
          })
        } catch (e) {
          console.warn('usePreviewPlayer: setActiveForLockScreen failed', e)
        }
      }
      player.play()
    }
  }, [player, previewSong])

  const handlePlayPause = () => {
    if (status?.playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const skipBackward = (ms = 5000) => {
    const newPos = Math.max(0, (status?.currentTime ?? 0) - ms)
    void player.seekTo(newPos)
  }

  const skipForward = (ms = 5000) => {
    const newPos = Math.min(
      status?.duration ?? 0,
      (status?.currentTime ?? 0) + ms,
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
