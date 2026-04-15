import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { ListItem } from '@/types/list'

interface AppFlatListProps {
  data: ListItem[]
}

function Item({ item }: { item: ListItem }) {
  const router = useRouter()
  return (
    <Pressable
      onPress={() => router.push(item.route)}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
    >
      <Image source={item.icon} style={styles.image} />
      <View style={styles.textContainer}>
        <AppText fontSize={FONT.SIZE.BASE} numberOfLines={1}>
          {item.line1}
        </AppText>
        <AppText fontSize={FONT.SIZE.XS} numberOfLines={1}>
          {item.line2}
        </AppText>
      </View>
      <View style={styles.chevronContainer}>
        <AppText fontSize={FONT.SIZE.LG} style={styles.chevron}>
          ›
        </AppText>
      </View>
    </Pressable>
  )
}

export function AppFlatList({ data }: AppFlatListProps) {
  const renderSeparator = () => <View style={styles.divider} />

  return (
    <FlatList
      style={styles.flatList}
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={renderSeparator}
      renderItem={({ item }) => <Item item={item} />}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
    />
  )
}

const styles = StyleSheet.create({
  chevron: {
    color: COLORS.PRIMARY,
    opacity: 0.6,
  },
  chevronContainer: {
    paddingLeft: 2,
    paddingRight: 8,
    paddingVertical: 8,
  },
  divider: {
    backgroundColor: COLORS.PRIMARY,
    height: 1,
    marginVertical: 2,
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
  listContent: {
    paddingBottom: 80,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 25,
      android: 20,
      default: 10,
    }),
  },
  pressable: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    flexDirection: 'row',
    gap: 2,
    paddingLeft: 8,
  },
  pressablePressed: {
    backgroundColor: COLORS.BM_VERY_DARK_RED,
  },
  textContainer: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
})
