import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native'

import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { playAlbum, playPlaylist } from '@/services/legend'
import { ListItemType } from '@/types/list'

interface AppHorizontalListProps {
  title: string
  data: ListItemType[]
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GAP = 12
const PADDING = LAYOUT.paddingHorizontal
// Calculate item width to fit 3 items with gaps and outer padding
const ITEM_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * 2) / 3

export function AppHorizontalList({ title, data }: AppHorizontalListProps) {
  const router = useRouter()

  if (!data || data.length === 0) return null

  const renderItem = ({ item }: { item: ListItemType }) => {
    const handlePress = () => {
      if (item.route) {
        const pathname =
          typeof item.route === 'object' && true && 'pathname' in item.route
            ? item.route.pathname
            : item.route

        if (pathname === '/(main)/(tabs)/player/PlayerPlaylistDetail') {
          playPlaylist(item.id)
        } else if (pathname === '/(main)/(tabs)/player/PlayerMetaAlbumSongs') {
          playAlbum(item.id)
        }

        router.push('/(main)/(global)/TrackPlayer')
      }
    }

    const imageSource =
      typeof item.icon === 'string' ? { uri: item.icon } : item.icon

    return (
      <Pressable onPress={handlePress} style={styles.itemContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.textContainer}>
          <AppText style={styles.line1} numberOfLines={1}>
            {item.line1}
          </AppText>
          <AppText style={styles.line2} numberOfLines={1}>
            {item.line2}
          </AppText>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{title}</AppText>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        snapToInterval={ITEM_SIZE + GAP}
        decelerationRate="fast"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
    width: '100%',
  },
  image: {
    borderRadius: 8,
    height: ITEM_SIZE,
    width: ITEM_SIZE,
  },
  itemContainer: {
    width: ITEM_SIZE,
  },
  line1: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  line2: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT.SIZE.XS,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: PADDING,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: FONT.SIZE.BASE,
    fontWeight: 'bold',
    marginBottom: 14,
    paddingHorizontal: PADDING,
  },
})
