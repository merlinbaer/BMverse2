import { useValue } from '@legendapp/state/react'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppButton } from '@/components/AppButton'
import { AppInfoRow } from '@/components/AppInfoRow'
import { MoaSpeaks } from '@/components/CharacterSpeaks'
import { getMoaMessage } from '@/services/games'
import { activePreviewSong$, playerStats$, songQuiz$ } from '@/services/legend'

export const SongQuizLoose = () => {
  const stats = useValue(playerStats$)
  const songQuizState = useValue(songQuiz$)

  const moaSpeaks = React.useMemo(
    () => getMoaMessage(songQuizState),
    [songQuizState],
  )

  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleReset()} style={styles.pressableArea}>
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
    marginVertical: 20,
    width: '100%',
  },
  pressableArea: {
    gap: 24,
    paddingVertical: 12,
  },
})
