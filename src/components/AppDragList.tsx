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
  onDeleteItem?: (item: ListItemType) => void
  ListHeaderComponent?: React.ReactElement | null
}

function Item({ info }: { info: DragListRenderItemInfo<ListItemType> }) {
  const { item, onDragStart, onDragEnd, isActive } = info

  // Render the Drop Zone (always the first item in the provided data)
  if (item.id === 'DELETE_ZONE') {
    return (
      <View style={styles.deleteZoneContainer}>
        <View style={styles.deleteZone}>
          <IMAGES.vector.Octicons
            name="trash"
            size={20}
            color={COLORS.PRIMARY}
          />
          <AppText fontSize={FONT.SIZE.XS} style={styles.deleteZoneText}>
            {item.line1}
          </AppText>
        </View>
      </View>
    )
  }

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

export function AppDragList({
  data,
  onReorder,
  onDeleteItem,
  ListHeaderComponent,
}: AppDragListProps) {
  const [resetKey, setResetKey] = React.useState(0)
  const keyExtractor = (item: ListItemType) => item.id

  const onReordered = (fromIndex: number, toIndex: number) => {
    // 1. Check if dropped in Delete Zone
    if (toIndex === 0 && onDeleteItem) {
      // Increment key to force a hard visual reset of the VirtualizedList
      setResetKey(prev => prev + 1)
      // Delay the alert so the reset happens first
      setTimeout(() => {
        onDeleteItem(data[fromIndex])
      }, 50)
      return
    }

    // 2. perform regular reorder (adjusting for the fixed zone at index 0)
    const copy = [...data]
    const removed = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, removed[0])
    onReorder(copy)
  }

  const renderSeparator = () => <View style={styles.divider} />

  return (
    <DragList
      key={`drag-list-${resetKey}`}
      data={data}
      keyExtractor={keyExtractor}
      onReordered={onReordered}
      renderItem={info => <Item info={info} />}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={ListHeaderComponent}
      containerStyle={styles.flatList}
    />
  )
}

const styles = StyleSheet.create({
  deleteZone: {
    alignItems: 'center',
    backgroundColor: COLORS.BM_VERY_DARK_RED,
    borderColor: COLORS.PRIMARY,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    padding: 14,
  },
  deleteZoneContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deleteZoneText: {
    color: COLORS.TEXT,
    fontWeight: '600',
  },
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
