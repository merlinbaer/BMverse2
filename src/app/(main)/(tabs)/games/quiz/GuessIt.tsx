import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppScreen } from '@/components/AppScreen'
import AudioWaveVisualizer from '@/components/AudioWave'
import { MomoSpeaks } from '@/components/CharacterSpeaks'

export default function GuessItScreen() {
  const momoMessage =
    'This Song Preview is in courtesy of iTunes. [More](https://www.apple.com/itunes/)'
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Guess this Song' }} />
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} imageSize={80} />
        <AudioWaveVisualizer />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
})
