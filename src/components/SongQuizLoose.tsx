import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AppBanner from '@/components/AppBanner'
import { AppBox } from '@/components/AppBox'
import { AppButton } from '@/components/AppButton'
import { AppInfoRow } from '@/components/AppInfoRow'
import { MoaSpeaks } from '@/components/CharacterSpeaks'
import { getMoaMessage } from '@/services/games'
import { activePreviewSong$, playerStats$, songQuiz$ } from '@/services/legend'
import { isPWA } from '@/services/pwa'

export const SongQuizLoose = () => {
  const stats = useValue(playerStats$)
  const songQuizState = useValue(songQuiz$)

  const { top } = useSafeAreaInsets()
  const dynamicMarginVertical = isPWA() ? 20 + top : 20

  const moaSpeaks = React.useMemo(
    () => getMoaMessage(songQuizState),
    [songQuizState],
  )

  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={[styles.container, { marginVertical: dynamicMarginVertical }]}>
      <Pressable onPress={() => handleReset()} style={styles.pressableArea}>
        <AppBanner title="WRONG!" />
        <MoaSpeaks markup={moaSpeaks} imageSize={120} />
        <AppBox>
          <AppInfoRow
            label="ROUNDS PLAYED:"
            value={stats?.roundsPlayed.toString() ?? '?'}
          />
          <AppInfoRow
            label="WRONG ANSERWS"
            value={stats?.wrongAnswers.toString() ?? '?'}
          />
          <AppInfoRow
            label="GIVE UP:"
            value={stats?.giveUps.toString() ?? '?'}
          />
          <AppInfoRow
            label="TIME OUT:"
            value={stats?.timeouts.toString() ?? '?'}
          />
          <AppInfoRow
            label="CURRENT STREAK:"
            value={stats?.currentStreak.toString() ?? '?'}
          />
        </AppBox>
        <AppButton title="TRY AGAIN" onPress={() => handleReset()} />
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
