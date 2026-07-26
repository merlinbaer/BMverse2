import { observer } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppHorizontalList } from '@/components/AppHorizontalList'
import { AppScreen } from '@/components/AppScreen'
import { albumList$, playlistNonEmptyList$ } from '@/services/legend'

export default observer(function PlayerPlayScreen() {
  const playlists = playlistNonEmptyList$.get()
  const albums = albumList$.get()

  return (
    <AppScreen contentContainerStyle={{ paddingHorizontal: 0 }}>
      <Stack.Screen options={{ title: 'Play Music' }} />
      <AppHorizontalList title="Playlists" data={playlists} />
      <AppHorizontalList title="Albums" data={albums} />
    </AppScreen>
  )
})
