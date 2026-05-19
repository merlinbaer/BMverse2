import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { songList$, songSort$ } from '@/services/legend'

export default function SongsScreen() {
  const sortType = useValue(songSort$)
  const list$ = useMemo(() => songList$(sortType), [sortType])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Songs' }} />
    </AppListScreen>
  )
}
