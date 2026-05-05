import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { upcomingList$ } from '@/services/legend'

export default function UpcomingScreen() {
  const list$ = useMemo(() => upcomingList$(), [])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Upcoming Concerts' }} />
    </AppListScreen>
  )
}
