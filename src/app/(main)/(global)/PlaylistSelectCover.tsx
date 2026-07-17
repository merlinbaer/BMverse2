import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { coverFilesFullList$, playlistImageUpdate } from '@/services/legend'
import { ListItemType } from '@/types/list'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const COLUMN_COUNT = 3
const ITEM_SIZE =
  (SCREEN_WIDTH * 0.9 - 48 - (COLUMN_COUNT - 1) * 12) / COLUMN_COUNT

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
        <View style={styles.container}>
          <AppText style={styles.title}>Select Cover</AppText>
          <View style={styles.listWrapper}>
            <FlatList
              data={data}
              numColumns={COLUMN_COUNT}
              keyExtractor={item => item.id}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item, dismiss)}
                  style={({ pressed }) => [
                    styles.imageItem,
                    pressed && styles.imagePressed,
                  ]}
                >
                  <Image
                    source={item.icon || IMAGES.cover200.notFound}
                    style={styles.image}
                    contentFit="cover"
                  />
                </Pressable>
              )}
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
  columnWrapper: {
    gap: 12,
    justifyContent: 'flex-start',
  },
  container: {
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'space-between',
  },
  footer: {
    paddingTop: 10,
  },
  image: {
    borderRadius: 8,
    height: ITEM_SIZE,
    width: ITEM_SIZE,
  },
  imageItem: {
    marginBottom: 12,
  },
  imagePressed: {
    opacity: 0.7,
  },
  listWrapper: {
    flex: 1,
    marginVertical: 12,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.LG,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default PlaylistSelectCover
