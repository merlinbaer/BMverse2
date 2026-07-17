import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import { musicFilesFullList$ } from '@/services/legend'
import { deleteSingleMusicFile } from '@/services/player/files'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const MusicFileDelete = () => {
  const data = useValue(musicFilesFullList$)
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
    <AppModalScreen>
      {dismiss => (
        <View style={styles.container}>
          <AppText style={styles.title}>Delete Music File</AppText>
          <View style={styles.listWrapper}>
            <AppFlatList
              data={data}
              displayIconAsText={true}
              pressAction={{ type: 'none' }}
              onPressItem={item => handleDelete(item, dismiss)}
              scrollEnabled={true}
              style={styles.flatList}
            />
          </View>
          <View style={styles.footer}>
            <AppButton
              title="Cancel"
              onPress={dismiss}
              style={styles.cancelButton}
            />
          </View>
        </View>
      )}
    </AppModalScreen>
  )
}

const styles = StyleSheet.create({
  cancelButton: { backgroundColor: COLORS.BM_DARK_RED },
  container: { height: SCREEN_HEIGHT * 0.7, justifyContent: 'space-between' },
  flatList: { backgroundColor: COLORS.BG_GREY },
  footer: { paddingTop: 10 },
  listWrapper: { flex: 1, marginVertical: 12 },
  title: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.LG,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default MusicFileDelete
