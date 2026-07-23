import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { albumTracksList$ } from '@/services/legend'

export default function PlayerMetaAlbumSongsScreen() {
  const { album } = useLocalSearchParams<{ album: string }>()
  const list$ = useMemo(() => albumTracksList$(album ?? ''), [album])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: album || 'Album Songs' }} />
    </AppListScreen>
  )
}
