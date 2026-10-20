import { observer } from '@legendapp/state/react'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppHorizontalList } from '@/components/AppHorizontalList'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import {
  albumList$,
  musicFiles$,
  playAlbum,
  playAllTracks,
  playlistNonEmptyList$,
  playPlaylist,
} from '@/services/legend'
import { ListItemType } from '@/types/list'

export default observer(function PlayerPlayScreen() {
  const router = useRouter()
  const playlists = playlistNonEmptyList$.get()
  const albums = albumList$.get()
  const allMusicFiles = musicFiles$.get()

  const handlePlaylistPress = async (item: ListItemType) => {
    await playPlaylist(item.id)
    router.push('/(main)/(global)/TrackPlayer')
  }

  const handleAlbumPress = async (item: ListItemType) => {
    await playAlbum(item.id)
    router.push('/(main)/(global)/TrackPlayer')
  }

  const handleAllPress = async () => {
    await playAllTracks()
    router.push('/(main)/(global)/TrackPlayer')
  }

  if (!allMusicFiles || allMusicFiles.length === 0) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'Play Music' }} />
        <View style={styles.emptyContainer}>
          <AppBubbleText
            markup="No music files available. Please add music files first in **Add Music**."
            orientation="center"
          />
        </View>
      </AppScreen>
    )
  }

  const songsCountText =
    allMusicFiles.length === 1 ? '1 song' : `${allMusicFiles.length} songs`

  return (
    <AppScreen contentContainerStyle={{ paddingHorizontal: 0 }}>
      <Stack.Screen options={{ title: 'Play Music' }} />
      <AppHorizontalList
        title="Playlists"
        data={playlists}
        onPressItem={handlePlaylistPress}
      />
      <AppHorizontalList
        title="Albums"
        data={albums}
        onPressItem={handleAlbumPress}
      />
      <View style={styles.section}>
        <Pressable
          onPress={handleAllPress}
          style={({ pressed }) => [
            styles.allCard,
            pressed && styles.allCardPressed,
          ]}
        >
          <View style={styles.iconContainer}>
            <IMAGES.vector.MaterialIcons
              name="queue-music"
              size={28}
              color={COLORS.TEXT}
            />
          </View>
          <View style={styles.textContainer}>
            <AppText style={styles.line1}>Play all</AppText>
            <AppText style={styles.line2}>{songsCountText}</AppText>
          </View>
          <View style={styles.chevronContainer}>
            <AppText style={styles.chevron}>›</AppText>
          </View>
        </Pressable>
      </View>
    </AppScreen>
  )
})

const styles = StyleSheet.create({
  allCard: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 8,
    flexDirection: 'row',
    marginHorizontal: LAYOUT.paddingHorizontal,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  allCardPressed: {
    backgroundColor: COLORS.BM_VERY_DARK_RED,
  },
  chevron: {
    color: COLORS.PRIMARY,
    fontSize: FONT.SIZE.LG,
    opacity: 0.6,
  },
  chevronContainer: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  line1: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  line2: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT.SIZE.XS,
    marginTop: 2,
  },
  section: {
    marginVertical: 18,
    width: '100%',
  },
  sectionTitle: {
    fontSize: FONT.SIZE.BASE,
    fontWeight: 'bold',
    marginBottom: 14,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
})
