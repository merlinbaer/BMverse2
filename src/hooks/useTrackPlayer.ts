import { useValue } from '@legendapp/state/react'
import {
  AudioLockScreenOptions,
  AudioMetadata,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from 'expo-audio'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'
import { isValidUrl } from '@/services/urlHelper'

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

  const lastSyncedIndex = useRef(-1)
  const isLockScreenActiveRef = useRef(false)
  const lastActivePlaylistIdRef = useRef<string | null>(null)
  const [isLooping, setIsLooping] = useState(false)

  // Reset lock screen active status if the playlist instance changes
  useEffect(() => {
    if (playlist && playlist.id !== lastActivePlaylistIdRef.current) {
      lastActivePlaylistIdRef.current = playlist.id
      isLockScreenActiveRef.current = false
      lastSyncedIndex.current = -1
    }
  }, [playlist])

  // Synchronize loop mode with playlist instance
  useEffect(() => {
    if (playlist) {
      try {
        playlist.loop = isLooping ? 'all' : 'none'
      } catch (e) {
        console.log(
          'BMverse: useTrackPlayer: Failed to set loop mode on playlist:',
          e,
        )
      }
    }
  }, [playlist, isLooping])

  // Synchronize current track metadata & lock screen controls to playlist
  useEffect(() => {
    if (!playlist) return

    if (!currentTrack) {
      if (isLockScreenActiveRef.current) {
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
        isLockScreenActiveRef.current = false
      }
      return
    }

    const artworkUrl =
      typeof currentTrack.coverUri === 'string' &&
      isValidUrl(currentTrack.coverUri)
        ? currentTrack.coverUri
        : undefined

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

    try {
      if (!isLockScreenActiveRef.current) {
        console.log(
          'BMverse: useTrackPlayer: Initializing lock screen with metadata:',
          metadata,
          'options:',
          lockScreenOptions,
        )
        playlist.setActiveForLockScreen(true, metadata, lockScreenOptions)
        isLockScreenActiveRef.current = true
      } else {
        console.log(
          'BMverse: useTrackPlayer: Updating lock screen metadata in place:',
          metadata,
        )
        playlist.updateLockScreenMetadata(metadata)
      }
    } catch (e) {
      console.log(
        'BMverse: useTrackPlayer: Failed to sync lock screen metadata:',
        e,
      )
    }
  }, [currentTrack, playlist])

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
      if (!isLooping && status.currentIndex === files.length - 1) {
        console.log('BMverse: useTrackPlayer: Reached end of playlist')
        onFinished?.()
      }
    }
  }, [
    status?.didJustFinish,
    status?.currentIndex,
    files.length,
    onFinished,
    isLooping,
  ])

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

  const shuffle = useCallback(() => {
    if (files.length < 2) return
    console.log('BMverse: useTrackPlayer: shuffle() called')
    try {
      playlist.pause()
    } catch (e) {
      console.log('BMverse: useTrackPlayer: Failed to pause on shuffle:', e)
    }

    const shuffled = [...files]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }

    lastSyncedIndex.current = -1
    activeTrackList$.set(shuffled)
    activeTrackIndex$.set(0)
  }, [files, playlist])

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => {
      const next = !prev
      console.log(
        'BMverse: useTrackPlayer: toggleLoop called, new state:',
        next,
      )
      return next
    })
  }, [])

  return {
    player: playlist,
    status,
    currentTrack,
    tracksCount: files.length,
    handlePlayPause,
    next,
    previous,
    seek,
    shuffle,
    isLooping,
    toggleLoop,
    isPlaying: status?.playing ?? false,
    progress:
      (status?.duration ?? 0) > 0
        ? (status?.currentTime ?? 0) / (status?.duration ?? 0)
        : 0,
    currentTime: status?.currentTime ?? 0,
    duration: status?.duration ?? 0,
  }
}
