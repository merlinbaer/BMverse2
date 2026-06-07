import { Href, Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButtonGrid, GridButtonConfig } from '@/components/AppButtonGrid'
import { AppScreen } from '@/components/AppScreen'
import { MomoSpeaks } from '@/components/CharacterSpeaks'

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
    <AppScreen>
      <Stack.Screen options={{ title: 'Concert Selection' }} />
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} />
        <AppButtonGrid buttonConfigs={buttonConfigs} />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginTop: 16,
    width: '100%',
  },
})
