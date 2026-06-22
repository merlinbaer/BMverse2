import { useValue } from '@legendapp/state/react'
import { useAudioPlaylist, useAudioPlaylistStatus } from 'expo-audio'
import { useEffect } from 'react'

import { musicFiles$ } from '@/services/legend'

export const useTrackPlayer = (onFinished?: () => void) => {
  const files = useValue(musicFiles$)

  // Map local files to the source format required by useAudioPlaylist
  const sources = files.map(file => ({
    uri: file.audioUri,
    metadata: {
      title: file.title,
      artist: file.artist ?? 'Local Track',
    },
  }))

  const player = useAudioPlaylist({
    sources,
    loop: 'all',
  })

  const status = useAudioPlaylistStatus(player)

  useEffect(() => {
    if (player && sources.length > 0) {
      player.play()
    }
  }, [player, sources.length])

  useEffect(() => {
    if (status?.didJustFinish && onFinished) {
      onFinished()
    }
  }, [status?.didJustFinish, onFinished])

  const handlePlayPause = () => {
    if (status?.playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const next = () => player.next()
  const previous = () => player.previous()

  return {
    player,
    status,
    currentTrack: files[status?.currentIndex ?? 0],
    handlePlayPause,
    next,
    previous,
    isPlaying: status?.playing ?? false,
    progress:
      (status?.duration ?? 0) > 0
        ? (status?.currentTime ?? 0) / (status?.duration ?? 0)
        : 0,
    currentTime: status?.currentTime ?? 0,
    duration: status?.duration ?? 0,
  }
}
