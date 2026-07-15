import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'

import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { ListItemType } from '@/types/list'

interface AppDragListProps {
  data: ListItemType[]
  onReorder: (newData: ListItemType[]) => void
}

function Item({ info }: { info: DragListRenderItemInfo<ListItemType> }) {
  const { item, onDragStart, onDragEnd, isActive } = info

  return (
    <View style={[styles.pressable, isActive && styles.pressableActive]}>
      <Image source={item.icon} style={styles.image} />
      <View style={styles.textContainer}>
        <AppText fontSize={FONT.SIZE.BASE} numberOfLines={1}>
          {item.line1}
        </AppText>
        <AppText fontSize={FONT.SIZE.XS} numberOfLines={1}>
          {item.line2}
        </AppText>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        style={styles.dragHandle}
      >
        <IMAGES.vector.Octicons
          name="grabber"
          size={24}
          color={COLORS.TEXT_MUTED}
        />
      </TouchableOpacity>
    </View>
  )
}

export function AppDragList({ data, onReorder }: AppDragListProps) {
  const keyExtractor = (item: ListItemType) => item.id

  const onReordered = (fromIndex: number, toIndex: number) => {
    const copy = [...data]
    const removed = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, removed[0])
    onReorder(copy)
  }

  const renderSeparator = () => <View style={styles.divider} />

  return (
    <DragList
      data={data}
      keyExtractor={keyExtractor}
      onReordered={onReordered}
      renderItem={info => <Item info={info} />}
      ItemSeparatorComponent={renderSeparator}
      containerStyle={styles.flatList}
    />
  )
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: COLORS.PRIMARY,
    height: 1,
    marginVertical: 2,
  },
  dragHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  flatList: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  image: {
    borderRadius: 4,
    height: 50,
    width: 50,
  },
  pressable: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    flexDirection: 'row',
    gap: 2,
    paddingLeft: 8,
  },
  pressableActive: {
    backgroundColor: COLORS.BM_VERY_DARK_RED,
  },
  textContainer: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
})
