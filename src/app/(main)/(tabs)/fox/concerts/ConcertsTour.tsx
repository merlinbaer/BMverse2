import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppFlatList } from '@/components/AppFlatList'
import { concertsTourList$ } from '@/services/legend'

export default function ConcertsCountryScreen() {
  const data = useValue(concertsTourList$)
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Concerts by Tour' }} />
      <AppFlatList data={data} />
    </React.Fragment>
  )
}
