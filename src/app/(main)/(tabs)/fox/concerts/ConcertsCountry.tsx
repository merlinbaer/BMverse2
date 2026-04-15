import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppFlatList } from '@/components/AppFlatList'
import { concertsCountryList$ } from '@/services/legend'

export default function ConcertsCountryScreen() {
  const data = useValue(concertsCountryList$)
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Concerts by Country' }} />
      <AppFlatList data={data} />
    </React.Fragment>
  )
}
