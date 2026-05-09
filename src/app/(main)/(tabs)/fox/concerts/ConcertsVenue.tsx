import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'

import { AppListScreen } from '@/components/AppListScreen'
import { concertsVenueList$ } from '@/services/legend'
import { CONCERT_LIST_TYPES, ConcertListType } from '@/types/list'

export default function ConcertsVenueScreen() {
  const { type, id } = useLocalSearchParams<{
    type: ConcertListType
    id: string
  }>()

  const getTitle = () => {
    // Check if 'type' (which is a string at runtime) is in our source-of-truth array
    return (CONCERT_LIST_TYPES as readonly string[]).includes(type)
      ? `Venues by ${type}`
      : 'Venues'
  }
  const list$ = useMemo(() => concertsVenueList$(type, id), [type, id])
  const data = useValue(list$)

  return (
    <AppListScreen data={data}>
      <Stack.Screen options={{ title: getTitle() }} />
    </AppListScreen>
  )
}
