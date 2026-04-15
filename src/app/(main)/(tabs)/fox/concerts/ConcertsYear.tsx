import { useValue } from '@legendapp/state/react'
import { Stack } from 'expo-router'
import React from 'react'

import { AppFlatList } from '@/components/AppFlatList'
import { concertsYearsList$ } from '@/services/legend'

export default function ConcertsListScreen() {
  const data = useValue(concertsYearsList$)
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Concerts' }} />
      <AppFlatList data={data} />
    </React.Fragment>
  )
}
