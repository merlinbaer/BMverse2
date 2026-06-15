import { useValue } from '@legendapp/state/react'
import { router, Stack } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppButton } from '@/components/AppButton'
import { AppScreen } from '@/components/AppScreen'
import { SuSpeaks } from '@/components/CharacterSpeaks'
import { SongQuizLoose } from '@/components/SongQuizLoose'
import { SongQuizWin } from '@/components/SongQuizWin'
import { authUser$, songQuiz$ } from '@/services/legend'
import { isPWA } from '@/services/pwa'

export default function GamesScreen() {
  const songQuizState = useValue(songQuiz$)
  const suSpeaks =
    'You want to play a Game?\nI choose a song. And you guess it. OK?'
  const user = useValue(authUser$)

  const loginRequiredText =
    'I\'d love to play with you, but to save your high score, please log in first!"'

  const { top } = useSafeAreaInsets()
  const dynamicMarginVertical = isPWA() ? 80 + top : 80

  const handleQuizStart = () => {
    songQuiz$.set('GIVEUP')
    router.push('/games/GuessIt')
  }

  const handleGoToProfile = () => {
    router.push('/profile/Profile')
  }

  const renderContent = () => {
    // Check if user is logged in first
    if (!user) {
      return (
        <View
          style={[
            styles.noUserContainer,
            { marginVertical: dynamicMarginVertical },
          ]}
        >
          <SuSpeaks markup={loginRequiredText} imageSize={120} />
          <AppButton title="Go to Profile" onPress={handleGoToProfile} />
        </View>
      )
    }

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
          <View
            style={[
              styles.container,
              { marginVertical: dynamicMarginVertical },
            ]}
          >
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
    width: '100%',
  },
  noUserContainer: {
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
  pressableArea: {
    gap: 24,
    paddingVertical: 12,
  },
})
