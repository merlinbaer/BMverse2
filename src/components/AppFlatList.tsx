import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  FlatList,
  FlatListProps,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { ListItemType } from '@/types/list'

interface AppFlatListProps extends Partial<FlatListProps<ListItemType>> {
  data: ListItemType[]
  displayIconAsText?: boolean
}

function Item({
  item,
  displayIconAsText,
}: {
  item: ListItemType
  displayIconAsText?: boolean
}) {
  const router = useRouter()
  const isPressable = !!item.route

  return (
    <Pressable
      onPress={() => item.route && router.push(item.route)}
      unstable_pressDelay={100}
      style={({ pressed }) => [
        styles.pressable,
        pressed && isPressable && styles.pressablePressed,
      ]}
    >
      {displayIconAsText ? (
        <View style={styles.textIconContainer}>
          <AppText
            fontSize={FONT.SIZE.SM}
            style={{ color: COLORS.PRIMARY, fontWeight: '400' }}
          >
            {item.icon as string}
          </AppText>
        </View>
      ) : (
        <Image source={item.icon} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <AppText fontSize={FONT.SIZE.BASE} numberOfLines={1}>
          {item.line1}
        </AppText>
        <AppText fontSize={FONT.SIZE.XS} numberOfLines={1}>
          {item.line2}
        </AppText>
      </View>
      {isPressable && (
        <View style={styles.chevronContainer}>
          <AppText fontSize={FONT.SIZE.LG} style={styles.chevron}>
            ›
          </AppText>
        </View>
      )}
    </Pressable>
  )
}

export function AppFlatList({
  data,
  displayIconAsText = false,
  ...props
}: AppFlatListProps) {
  const renderSeparator = (key: string) => (
    <View key={key} style={styles.divider} />
  )

  // Default to false for Detail screens if scrollEnabled is not provided
  const scrollEnabled = props.scrollEnabled ?? false

  // If scrollEnabled is false, render as a plain View to prevent touch-action blocking on Safari Web.
  if (!scrollEnabled) {
    return (
      <View style={styles.flatList}>
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <Item item={item} displayIconAsText={displayIconAsText} />
            {index < data.length - 1 && renderSeparator(`sep-${item.id}`)}
          </React.Fragment>
        ))}
      </View>
    )
  }

  const renderSeparatorComponent = () => <View style={styles.divider} />

  return (
    <FlatList
      style={styles.flatList}
      data={data}
      keyExtractor={(item: ListItemType) => item.id}
      ItemSeparatorComponent={renderSeparatorComponent}
      renderItem={({ item }: { item: ListItemType }) => (
        <Item item={item} displayIconAsText={displayIconAsText} />
      )}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
      scrollEnabled={true}
      {...props}
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
  textIconContainer: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
})
