import { router, Stack } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppScreen } from '@/components/AppScreen'
import { SuSpeaks } from '@/components/CharacterSpeaks'

export default function GamesScreen() {
  const suMessage = 'I play a song. And you guess it. OK?'
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Song Quiz' }} />
      <View style={styles.container}>
        <Pressable
          onPress={() => router.push('/games/quiz/GuessIt')}
          style={styles.characterSpeakBox}
        >
          <SuSpeaks markup={suMessage} imageSize={120} />
        </Pressable>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  characterSpeakBox: {
    paddingVertical: 12,
  },
  container: {
    alignItems: 'center',
    marginVertical: 80,
    width: '100%',
  },
})
