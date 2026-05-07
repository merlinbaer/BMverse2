import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { Linking, Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppFlatList } from '@/components/AppFlatList'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { concertItem$, setlistsList$ } from '@/services/legend'

export default function ConcertDetailScreen() {
  const { id, setlistId } = useLocalSearchParams<{
    id: string
    setlistId: string
  }>()
  const detail = useValue(concertItem$(id))
  const list$ = useMemo(() => setlistsList$(setlistId), [setlistId])
  const data = useValue(list$)

  const showTourInfo = !!(detail?.setlist_tour_name || detail?.setlist_info)
  const googleMapsUri = `https://www.google.com/maps/search/?api=1&query=${detail?.setlist_venue_city_coords_lat},${detail?.setlist_venue_city_coords_long}`

  const handleOpenMap = () => {
    Linking.openURL(googleMapsUri).catch(err =>
      console.error('Error opening maps:', err),
    )
  }

  //<AppText>{'ID: ' + detail?.setlist_id}</AppText>
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Concert Details' }} />
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{detail?.setlist_eventdate}</AppText>
        <AppText> {detail?.setlist_venue_name} </AppText>
        <AppText fontSize={FONT.SIZE.LG}>
          {detail?.setlist_venue_city_country_name}
        </AppText>
        <AppText>{detail?.setlist_venue_city_name}</AppText>
      </AppBox>
      <AppBox>
        <AppHyperlink
          description={
            'GPS: ' +
            detail?.setlist_venue_city_coords_lat +
            ' / ' +
            detail?.setlist_venue_city_coords_long
          }
          hyperlink={googleMapsUri}
          type={'extern'}
        />
        <Pressable
          onPress={handleOpenMap}
          style={({ pressed }) => [
            styles.mapContainer,
            pressed && styles.mapPressed,
          ]}
        >
          <Image
            source={require('@/../assets/images/sample_map.png')}
            contentFit="fill"
            style={styles.mapImage}
          />
        </Pressable>
      </AppBox>
      {showTourInfo && (
        <AppBox>
          {detail?.setlist_tour_name && (
            <AppText fontSize={FONT.SIZE.LG}>
              {detail?.setlist_tour_name}
            </AppText>
          )}
          {detail?.setlist_info && <AppText>{detail.setlist_info}</AppText>}
        </AppBox>
      )}
      <View style={styles.listHeaderContainer}>
        <AppText
          fontSize={FONT.SIZE.LG}
          style={{ color: COLORS.PRIMARY, fontWeight: '800' }}
        >
          {'Setlist:'}
        </AppText>
      </View>
      <AppFlatList data={data} displayIconAsText={true} />
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  listHeaderContainer: {
    marginTop: 8,
    paddingVertical: 12,
  },
  mapContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    width: '100%',
  },
  mapImage: {
    height: 200,
    width: '100%',
  },
  mapPressed: {
    opacity: 0.7,
  },
})
