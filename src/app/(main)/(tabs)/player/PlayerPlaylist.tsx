import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { playlistList$ } from '@/services/legend'

export default function PlayerPlaylistScreen() {
  const playlists = useValue(playlistList$)
  return (
    <AppListScreen data={playlists}>
      <Stack.Screen options={{ title: 'Playlists' }} />
    </AppListScreen>
  )
}
