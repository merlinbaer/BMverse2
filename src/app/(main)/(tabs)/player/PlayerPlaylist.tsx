import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { musicPlaylist$ } from '@/services/legend'

export default function PlayerPlaylistScreen() {
  const localMusicList = useValue(musicPlaylist$)
  return (
    <AppListScreen data={localMusicList}>
      <Stack.Screen options={{ title: 'Playlist' }} />
    </AppListScreen>
  )
}
