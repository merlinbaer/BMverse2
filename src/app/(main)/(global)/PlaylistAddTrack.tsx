import { useValue } from '@legendapp/state/react'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

import { MusicFileListSelector } from '@/components/MusicFileListSelector'
import {
  musicFilesList$,
  playlistTracksList$,
  playlistTracksUpdate,
} from '@/services/legend'
import { ListItemType } from '@/types/list'

const PlaylistAddTrack = () => {
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>()
  const tracks = useValue(playlistTracksList$(playlistId ?? ''))
  const pickerTracks = useValue(musicFilesList$(playlistId))

  const handleSelectTrack = (item: ListItemType, dismiss: () => void) => {
    if (!playlistId) return

    const updatedTracks = [
      ...tracks.map((t, index) => ({ musicFileId: t.id, trackNum: index + 1 })),
      { musicFileId: item.id, trackNum: tracks.length + 1 },
    ]

    playlistTracksUpdate(playlistId, updatedTracks)
    dismiss()
  }

  return (
    <MusicFileListSelector
      title="Add Track"
      data={pickerTracks}
      onSelect={handleSelectTrack}
    />
  )
}

export default PlaylistAddTrack
