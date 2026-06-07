import { useValue } from '@legendapp/state/react'
import { router, Stack } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppScreen } from '@/components/AppScreen'
import { SuSpeaks } from '@/components/CharacterSpeaks'
import { SongQuizLoose } from '@/components/SongQuizLoose'
import { SongQuizWin } from '@/components/SongQuizWin'
import { songQuiz$ } from '@/services/legend'

export default function GamesScreen() {
  const songQuizState = useValue(songQuiz$)
  const suSpeaks =
    'You want to play a Game?\nI choose a song. And you guess it. OK?'

  const handleQuizStart = () => {
    songQuiz$.set('GIVEUP')
    router.push('/games/GuessIt')
  }

  const renderContent = () => {
    switch (songQuizState) {
      case 'GIVEUP':
        return <SongQuizLoose />
      case 'TIMEOUT':
        return <SongQuizLoose />
      case 'LOOSE':
        return <SongQuizLoose />
      case 'WIN':
        return <SongQuizWin />
      default:
        return (
          <View style={styles.container}>
            <Pressable
              onPress={() => handleQuizStart()}
              style={styles.pressableArea}
            >
              <SuSpeaks markup={suSpeaks} imageSize={120} />
              <AppButton title="Play" onPress={() => handleQuizStart()} />
            </Pressable>
          </View>
        )
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Song Quiz' }} />
      {renderContent()}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 80,
    width: '100%',
  },
  pressableArea: {
    gap: 24,
    paddingVertical: 12,
  },
})
