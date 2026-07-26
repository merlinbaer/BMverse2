import { useValue } from '@legendapp/state/react'
import { Href, Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { playlistNonEmptyList$ } from '@/services/legend'

export default function PlayerMetaPlaylistScreen() {
  const playlists = useValue(playlistNonEmptyList$)

  const data = useMemo(() => {
    return playlists.map(item => ({
      ...item,
      route: {
        pathname: '/(main)/(tabs)/player/PlayerMetaTracksPlaylist',
        params: { id: item.id },
      } as Href,
    }))
  }, [playlists])

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Select Playlist' }} />
    </AppListScreen>
  )
}
