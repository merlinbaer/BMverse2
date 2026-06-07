import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

export default function PlayerPlayScreen() {
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Play Music' }} />
      <View style={styles.container}>
        <AppBubbleText
          markup={'Feature in Development. Coming soon'}
          orientation={'center'}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 40,
    width: '100%',
  },
})
