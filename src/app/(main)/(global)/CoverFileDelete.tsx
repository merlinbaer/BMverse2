import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { AppImageGrid } from '@/components/AppImageGrid'
import { AppModalScreen } from '@/components/AppModalScreen'
import { useAlert } from '@/hooks/useAlert'
import { coverFilesFullList$ } from '@/services/legend'
import { deleteSingleCoverFile } from '@/services/player/files'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const CoverFileDelete = () => {
  const data = useValue(coverFilesFullList$(true))
  const { showAlert } = useAlert()

  const handleDelete = (item: ListItemType, dismiss: () => void) => {
    showAlert(
      'Delete Image',
      `Are you sure you want to delete "${item.line1}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSingleCoverFile(item.id)
            dismiss()
          },
        },
      ],
    )
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <View style={styles.modalContentWrapper}>
          <AppImageGrid
            title="Delete Local Image"
            data={data}
            onSelect={item => handleDelete(item, dismiss)}
            onCancel={dismiss}
          />
        </View>
      )}
    </AppModalScreen>
  )
}

const styles = StyleSheet.create({
  modalContentWrapper: {
    height: SCREEN_HEIGHT * 0.7,
  },
})

export default CoverFileDelete
