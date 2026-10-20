import { observer } from '@legendapp/state/react'
import { Stack, useRouter } from 'expo-router'
import React from 'react'

import { AppHorizontalList } from '@/components/AppHorizontalList'
import { AppScreen } from '@/components/AppScreen'
import {
  albumList$,
  playAlbum,
  playPlaylist,
  playlistNonEmptyList$,
} from '@/services/legend'
import { ListItemType } from '@/types/list'

export default observer(function PlayerPlayScreen() {
  const router = useRouter()
  const playlists = playlistNonEmptyList$.get()
  const albums = albumList$.get()

  const handlePlaylistPress = async (item: ListItemType) => {
    await playPlaylist(item.id)
    router.push('/(main)/(global)/TrackPlayer')
  }

  const handleAlbumPress = async (item: ListItemType) => {
    await playAlbum(item.id)
    router.push('/(main)/(global)/TrackPlayer')
  }

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
    </AppScreen>
  )
})
