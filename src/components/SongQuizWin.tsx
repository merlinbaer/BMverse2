import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AppBanner from '@/components/AppBanner'
import { AppBox } from '@/components/AppBox'
import { AppButton } from '@/components/AppButton'
import { AppInfoRow } from '@/components/AppInfoRow'
import { MoaSpeaks } from '@/components/CharacterSpeaks'
import { activePreviewSong$, playerStats$, songQuiz$ } from '@/services/legend'
import { isPWA } from '@/services/pwa'

export const SongQuizWin = () => {
  const stats = useValue(playerStats$)
  const moaSpeaks = "Yes. That's right.\nI'm happy."

  const { top } = useSafeAreaInsets()
  const dynamicMarginVertical = isPWA() ? 20 + top : 20

  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={[styles.container, { marginVertical: dynamicMarginVertical }]}>
      <Pressable onPress={() => handleReset()} style={styles.pressableArea}>
        <AppBanner title="CORRECT!" />
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
    width: '100%',
  },
  pressableArea: {
    alignItems: 'center',
    gap: 24,
    paddingVertical: 12,
  },
})
