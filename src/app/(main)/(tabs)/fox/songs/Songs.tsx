import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { songList$ } from '@/services/legend'

export default function SongsScreen() {
  const list$ = useMemo(() => songList$(), [])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Songs' }} />
    </AppListScreen>
  )
}
