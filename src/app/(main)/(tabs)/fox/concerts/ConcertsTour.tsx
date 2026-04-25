import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { concertsTourList$ } from '@/services/legend'

export default function ConcertsCountryScreen() {
  const data = useValue(concertsTourList$)
  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Concerts by Tour' }} />
    </AppListScreen>
  )
}
