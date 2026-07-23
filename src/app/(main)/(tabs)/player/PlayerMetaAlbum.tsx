import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { albumList$ } from '@/services/legend'

export default function PlayerMetaAlbumScreen() {
  const data = useValue(albumList$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Select Album' }} />
    </AppListScreen>
  )
}
