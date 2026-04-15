import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'

import { AppFlatList } from '@/components/AppFlatList'
import { concertsVenueList$ } from '@/services/legend'
import { LIST_TYPES, ListType } from '@/types/list'

export default function ConcertsVenueScreen() {
  const { type, id } = useLocalSearchParams<{
    type: ListType
    id: string
  }>()

  const getTitle = () => {
    // Check if 'type' (which is a string at runtime) is in our source-of-truth array
    return (LIST_TYPES as readonly string[]).includes(type)
      ? `Venues by ${type}`
      : 'Venues'
  }
  const list$ = useMemo(() => concertsVenueList$(type, id), [type, id])
  const data = useValue(list$)

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: getTitle() }} />
      <AppFlatList data={data} />
    </React.Fragment>
  )
}
