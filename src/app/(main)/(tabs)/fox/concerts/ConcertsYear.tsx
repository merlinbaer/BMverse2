import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { concertsYearList$ } from '@/services/legend'

export default function ConcertsYearScreen() {
  const data = useValue(concertsYearList$)
  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Concerts by Year' }} />
    </AppListScreen>
  )
}
