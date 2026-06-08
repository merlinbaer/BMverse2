import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

export default function PlayerPlayScreen() {
  const router = useRouter()

  const handleOpenTrackPlayer = () => {
    router.push('/(main)/(global)/TrackPlayer')
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Play Music' }} />
      <View style={styles.container}>
        <AppBubbleText
          markup={'Open the Track Player to listen to your local library.'}
          orientation={'center'}
        />
        <AppButton
          title="Open Track Player"
          onPress={handleOpenTrackPlayer}
          style={styles.button}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  container: {
    alignItems: 'center',
    gap: 24,
    marginVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
})
