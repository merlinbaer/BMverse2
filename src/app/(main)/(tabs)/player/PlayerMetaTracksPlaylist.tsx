import { useValue } from '@legendapp/state/react'
import { Href, Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { playlistTracksList$ } from '@/services/legend'

export default function PlayerMetaTracksPlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const list$ = useMemo(() => playlistTracksList$(id), [id])
  const tracks = useValue(list$)

  const data = useMemo(() => {
    return tracks.map(item => ({
      ...item,
      route: {
        pathname: '/(main)/(tabs)/player/PlayerMetaEdit',
        params: { id: item.id },
      } as Href,
    }))
  }, [tracks])

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Playlist Tracks' }} />
    </AppListScreen>
  )
}
