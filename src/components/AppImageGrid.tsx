import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { ListItemType } from '@/types/list'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const COLUMN_COUNT = 3
const ITEM_SIZE =
  (SCREEN_WIDTH * 0.9 - 48 - (COLUMN_COUNT - 1) * 12) / COLUMN_COUNT

interface AppImageGridProps {
  title: string
  data: ListItemType[]
  onSelect: (item: ListItemType) => void
  onCancel: () => void
}

export function AppImageGrid({
  title,
  data,
  onSelect,
  onCancel,
}: AppImageGridProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{title}</AppText>
      <View style={styles.listWrapper}>
        <FlatList
          data={data}
          numColumns={COLUMN_COUNT}
          keyExtractor={item => item.id}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
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
          onPress={onCancel}
          style={styles.cancelButton}
        />
      </View>
    </View>
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
    flex: 1,
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
