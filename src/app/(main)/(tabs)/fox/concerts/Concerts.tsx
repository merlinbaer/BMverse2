import { Href, Stack } from 'expo-router'
import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { AppButtonGrid, GridButtonConfig } from '@/components/AppButtonGrid'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, LAYOUT } from '@/constants/constants'

export default function ConcertSelectionScreen() {
  const momoMessage = 'Show concerts by'

  const buttonConfigs: GridButtonConfig[] = [
    {
      id: 'year',
      image: require('@/../assets/images/concert_box_year.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsYear' as Href,
      position: 'top-left',
      label: 'Year',
    },
    {
      id: 'country',
      image: require('@/../assets/images/concert_box_country.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsCountry' as Href,
      position: 'top-right',
      label: 'Country',
    },
    {
      id: 'tour',
      image: require('@/../assets/images/concert_box_tour.png'),
      screen: '/(main)/(tabs)/fox/concerts/ConcertsTour' as Href,
      position: 'bottom-left',
      label: 'Tour',
    },
    {
      id: 'upcoming',
      image: require('@/../assets/images/concert_box_upcoming.png'),
      screen: '/(main)/(tabs)/fox/concerts/Upcoming' as Href,
      position: 'bottom-right',
      label: 'Upcoming',
    },
  ]

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareScrollView}
      contentContainerStyle={styles.keyboardAwareContentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <Stack.Screen options={{ title: 'Concert Selection' }} />
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} />

        <AppButtonGrid buttonConfigs={buttonConfigs} />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  keyboardAwareContentContainer: {
    paddingBottom: 80,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: Platform.select({
      ios: 170,
      android: 20,
      default: 10,
    }),
  },
  keyboardAwareScrollView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
})
