import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { concertsCountryList$ } from '@/services/legend'

export default function ConcertsCountryScreen() {
  const data = useValue(concertsCountryList$)
  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: 'Concerts by Country' }} />
    </AppListScreen>
  )
}
