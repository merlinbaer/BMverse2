import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppScreen } from '@/components/AppScreen'

export default function PlayerScreen() {
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Music Player' }} />
      <View style={styles.characterContainer}>
        <AppBubbleText
          markup={'Only in IOS and Android when logged in.'}
          orientation={'center'}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
})
