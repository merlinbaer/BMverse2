import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import correct from '@/../assets/images/correct.png'
import { AppBox } from '@/components/AppBox'
import { AppButton } from '@/components/AppButton'
import { AppInfoRow } from '@/components/AppInfoRow'
import { MoaSpeaks } from '@/components/CharacterSpeaks'
import { activePreviewSong$, playerStats$, songQuiz$ } from '@/services/legend'

export const SongQuizWin = () => {
  const stats = useValue(playerStats$)
  const moaSpeaks = "Yes. That's right.\nI'm happy."

  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleReset()} style={styles.pressableArea}>
        <Image
          source={correct}
          style={styles.statusImage}
          contentFit="contain"
        />
        <MoaSpeaks markup={moaSpeaks} imageSize={120} />
        <AppBox>
          <AppInfoRow
            label="ROUNDS PLAYED:"
            value={stats?.roundsPlayed.toString() ?? '?'}
          />
          <AppInfoRow
            label="CORRECT ANSWERS:"
            value={stats?.correctAnswers.toString() ?? '?'}
          />
          <AppInfoRow
            label="CURRENT STREAK:"
            value={stats?.currentStreak.toString() ?? '?'}
          />
          <AppInfoRow
            label="BEST STREAK:"
            value={stats?.bestStreak.toString() ?? '?'}
          />
        </AppBox>
        <AppButton title="PLAY AGAIN" onPress={() => handleReset()} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  pressableArea: {
    alignItems: 'center',
    gap: 24,
    paddingVertical: 12,
  },
  statusImage: {
    aspectRatio: 3,
    height: 120,
    width: '100%',
  },
})
