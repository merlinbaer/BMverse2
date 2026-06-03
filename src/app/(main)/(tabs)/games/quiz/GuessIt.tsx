import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import AudioWaveVisualizer from '@/components/AudioWave'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT } from '@/constants/constants'

export default function GuessItScreen() {
  const momoMessage = 'Please select the right song.'
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Guess this Song' }} />
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} imageSize={80} />
        <View style={styles.visualizerContainer}>
          <AudioWaveVisualizer width={240} height={140} />
        </View>
        <AppHyperlink
          description={'provided courtesy of iTunes'}
          hyperlink={'https://www.apple.com/itunes/'}
          type={'extern'}
          size={FONT.SIZE.XS}
          color={COLORS.SECONDARY}
        />
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
  visualizerContainer: {
    marginBottom: 4,
    marginTop: 16,
    paddingHorizontal: 12,
  },
})
