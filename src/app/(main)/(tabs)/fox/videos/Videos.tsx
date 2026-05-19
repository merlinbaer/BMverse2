import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { videoList$, videoSort$ } from '@/services/legend'

export default function VideosScreen() {
  const sortType = useValue(videoSort$)
  const list$ = useMemo(() => videoList$(sortType), [sortType])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Videos' }} />
    </AppListScreen>
  )
}
