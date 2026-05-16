import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { videoList$ } from '@/services/legend'

export default function VideosScreen() {
  const list$ = useMemo(() => videoList$(), [])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Videos' }} />
    </AppListScreen>
  )
}
