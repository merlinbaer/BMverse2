import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { AppText } from '@/components/AppText'
import { concertItem$ } from '@/services/legend'

export default function ConcertDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()

  const data = useValue(concertItem$(id))
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: 'Setlist' }} />
      <AppText>{data?.setlist_eventdate}</AppText>
      <AppText>{data?.setlist_venue_city_country_name}</AppText>
      <AppText>{data?.setlist_venue_city_name}</AppText>
      <AppText>{data?.setlist_venue_name}</AppText>
      <AppText>{data?.setlist_info}</AppText>
      <AppText>
        {data?.setlist_venue_city_coords_lat +
          ' / ' +
          data?.setlist_venue_city_coords_long}
      </AppText>
      <AppText>{data?.setlist_tour_name}</AppText>
    </React.Fragment>
  )
}
