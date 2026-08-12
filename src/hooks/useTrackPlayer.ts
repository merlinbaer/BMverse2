import { useValue } from '@legendapp/state/react'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { useCallback, useEffect, useRef } from 'react'
import { Image, Platform } from 'react-native'

import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'

export const useTrackPlayer = (onFinished?: () => void) => {
  const activeTracks = useValue(activeTrackList$)
  const allFiles = useValue(musicFiles$)
  const activeIndex = useValue(activeTrackIndex$)

  const files = activeTracks.length > 0 ? activeTracks : allFiles
  const currentTrack = files[activeIndex]

  // useAudioPlayer(null) gives a stable player instance that unmounts with the component.
  const player = useAudioPlayer()
  const status = useAudioPlayerStatus(player)

  // Use a ref to track the last loaded URI to avoid redundant replaces
  const lastLoadedUriRef = useRef<string | null>(null)

  // Track change handling
  useEffect(() => {
    if (
      currentTrack?.audioUri &&
      currentTrack.audioUri !== lastLoadedUriRef.current
    ) {
      player.replace(currentTrack.audioUri)
      lastLoadedUriRef.current = currentTrack.audioUri
      player.play()
    }
  }, [currentTrack?.audioUri, player])

  // Lockscreen handling
  useEffect(() => {
    if (!currentTrack || !player) return

    let artworkUrl: string | undefined = undefined
    if (typeof currentTrack.appCoverUri === 'string') {
      artworkUrl = currentTrack.appCoverUri
    } else if (typeof currentTrack.appCoverUri === 'number') {
      artworkUrl = Image.resolveAssetSource(currentTrack.appCoverUri).uri
    }

    const isExpoGo =
      Constants.executionEnvironment === ExecutionEnvironment.StoreClient

    const shouldSetLockScreen =
      Platform.OS === 'web' ||
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && !isExpoGo)

    if (shouldSetLockScreen) {
      try {
        player.setActiveForLockScreen(true, {
          title: currentTrack.title || 'Unknown Title',
          artist: currentTrack.artist || 'Unknown Artist',
          albumTitle: currentTrack.album || 'Unknown Album',
          artworkUrl,
        })
      } catch (e) {
        console.log('useTrackPlayer: setActiveForLockScreen failed', e)
      }
    }
  }, [currentTrack, player])

  const next = useCallback(() => {
    if (files.length === 0) return
    const nextIndex = (activeIndex + 1) % files.length
    activeTrackIndex$.set(nextIndex)
  }, [activeIndex, files.length])

  const previous = useCallback(() => {
    if (files.length === 0) return
    const prevIndex = (activeIndex - 1 + files.length) % files.length
    activeTrackIndex$.set(prevIndex)
  }, [activeIndex, files.length])

  // Auto-advance
  const autoAdvanceHandledRef = useRef(false)
  useEffect(() => {
    if (status?.didJustFinish) {
      if (!autoAdvanceHandledRef.current) {
        autoAdvanceHandledRef.current = true
        if (activeIndex < files.length - 1) {
          next()
        } else {
          onFinished?.()
        }
      }
    } else {
      autoAdvanceHandledRef.current = false
    }
  }, [status?.didJustFinish, activeIndex, files.length, next, onFinished])

  const handlePlayPause = () => {
    if (status?.playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const seek = (time: number) => player.seekTo(time)

  return {
    player,
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
