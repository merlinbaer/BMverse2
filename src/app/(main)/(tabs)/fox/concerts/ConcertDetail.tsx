import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppFlatList } from '@/components/AppFlatList'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { concertItem$, setlistsList$ } from '@/services/legend'

export default function ConcertDetailScreen() {
  const { id, setlistId } = useLocalSearchParams<{
    id: string
    setlistId: string
  }>()
  const detail = useValue(concertItem$(id))
  const list$ = useMemo(() => setlistsList$(setlistId), [setlistId])
  const data = useValue(list$)
  console.log('data length:', data.length)
  //<AppText>{'ID: ' + detail?.setlist_id}</AppText>
  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <Stack.Screen options={{ title: 'Setlist' }} />
      <View style={styles.characterContainer}>
        <AppText fontSize={FONT.SIZE.LG}>{'Concert'}</AppText>
        <AppText fontSize={FONT.SIZE.LG}> </AppText>

        <AppText>{'Date: ' + detail?.setlist_eventdate}</AppText>
        <AppText>
          {'Country: ' + detail?.setlist_venue_city_country_name}
        </AppText>
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
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  characterContainer: {
    marginVertical: 20,
    width: '100%',
  },
  keyboardAwareContentContainer: {
    gap: LAYOUT.gap,
    paddingBottom: 24,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 180,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})
