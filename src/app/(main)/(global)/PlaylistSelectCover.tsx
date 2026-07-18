import { useValue } from '@legendapp/state/react'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { AppImageGrid } from '@/components/AppImageGrid'
import { AppModalScreen } from '@/components/AppModalScreen'
import { coverFilesFullList$, playlistImageUpdate } from '@/services/legend'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const PlaylistSelectCover = () => {
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>()
  const data = useValue(coverFilesFullList$)

  const handleSelect = (item: ListItemType, dismiss: () => void) => {
    if (!playlistId) return
    playlistImageUpdate(playlistId, item.icon as string | number)
    dismiss()
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <View style={styles.modalContentWrapper}>
          <AppImageGrid
            title="Select Cover"
            data={data}
            onSelect={item => handleSelect(item, dismiss)}
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

export default PlaylistSelectCover
