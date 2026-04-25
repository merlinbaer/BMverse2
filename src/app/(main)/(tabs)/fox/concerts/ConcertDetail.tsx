import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'

import { AppFlatList } from '@/components/AppFlatList'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { FONT } from '@/constants/constants'
import { concertItem$, setlistsList$ } from '@/services/legend'

export default function ConcertDetailScreen() {
  const { id, setlistId } = useLocalSearchParams<{
    id: string
    setlistId: string
  }>()
  const detail = useValue(concertItem$(id))
  const list$ = useMemo(() => setlistsList$(setlistId), [setlistId])
  const data = useValue(list$)

  //<AppText>{'ID: ' + detail?.setlist_id}</AppText>
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Concert Details' }} />
      <AppText fontSize={FONT.SIZE.LG}>{'Concert'}</AppText>
      <AppText>{'Date: ' + detail?.setlist_eventdate}</AppText>
      <AppText>{'Country: ' + detail?.setlist_venue_city_country_name}</AppText>
      <AppText>{'City: ' + detail?.setlist_venue_city_name}</AppText>
      <AppText>{'Venue: ' + detail?.setlist_venue_name}</AppText>
      <AppText>{'Special: ' + (detail?.setlist_info ?? '')}</AppText>
      <AppText>
        {'GPS: ' +
          detail?.setlist_venue_city_coords_lat +
          ' / ' +
          detail?.setlist_venue_city_coords_long}
      </AppText>
      <AppText>{'Tourname: ' + (detail?.setlist_tour_name ?? '')}</AppText>
      <AppText fontSize={FONT.SIZE.LG}> </AppText>
      <AppText fontSize={FONT.SIZE.LG}>{'Setlist'}</AppText>
      <AppFlatList data={data} />
    </AppScreen>
  )
}
