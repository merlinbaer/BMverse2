import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { localMusicList$ } from '@/services/audio'

export default function PlayerPlaylistScreen() {
  const localMusicList = useValue(localMusicList$)
  return (
    <AppListScreen data={localMusicList}>
      <Stack.Screen options={{ title: 'Playlist' }} />
    </AppListScreen>
  )
}
