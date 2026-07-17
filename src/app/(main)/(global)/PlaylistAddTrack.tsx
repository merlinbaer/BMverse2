import { useValue } from '@legendapp/state/react'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import {
  musicFilesPickerList$,
  playlistTracksList$,
  playlistTracksUpdate,
} from '@/services/legend'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const PlaylistAddTrack = () => {
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>()
  const tracks = useValue(playlistTracksList$(playlistId ?? ''))
  const pickerTracks = useValue(musicFilesPickerList$(playlistId ?? ''))

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
    <AppModalScreen>
      {dismiss => (
        <View style={styles.container}>
          <AppText style={styles.title}>Add Track</AppText>
          <View style={styles.listWrapper}>
            <AppFlatList
              data={pickerTracks}
              displayIconAsText={true}
              pressAction={{ type: 'none' }}
              onPressItem={item => handleSelectTrack(item, dismiss)}
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
  cancelButton: {
    backgroundColor: COLORS.BM_DARK_RED,
  },
  container: {
    // Force the modal to be large by setting a height relative to the screen
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'space-between',
  },
  flatList: {
    backgroundColor: COLORS.BG_GREY,
  },
  footer: {
    paddingTop: 10,
  },
  listWrapper: {
    flex: 1, // list will now fill the remaining 0.7 screen height
    marginVertical: 12,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.LG,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default PlaylistAddTrack
