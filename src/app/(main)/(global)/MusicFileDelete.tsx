import { useValue } from '@legendapp/state/react'
import React from 'react'

import { MusicFileListSelector } from '@/components/MusicFileListSelector'
import { useAlert } from '@/hooks/useAlert'
import { musicFilesList$ } from '@/services/legend'
import { deleteSingleMusicFile } from '@/services/player/files'
import { ListItemType } from '@/types/list'

const MusicFileDelete = () => {
  const data = useValue(musicFilesList$())
  const { showAlert } = useAlert()

  const handleDelete = (item: ListItemType, dismiss: () => void) => {
    showAlert(
      'Delete File',
      `Are you sure you want to delete "${item.line2}"? It will be removed from all playlists too.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSingleMusicFile(item.id)
            dismiss()
          },
        },
      ],
    )
  }

  return (
    <MusicFileListSelector
      title="Delete Music File"
      data={data}
      onSelect={handleDelete}
    />
  )
}

export default MusicFileDelete
