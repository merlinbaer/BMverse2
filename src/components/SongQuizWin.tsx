import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { MoaSpeaks } from '@/components/CharacterSpeaks'
import { activePreviewSong$, songQuiz$ } from '@/services/legend'

export const SongQuizWin = () => {
  const moaSpeaks = "Yes. That' right.\nI'm happy."

  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleReset()} style={styles.characterSpeakBox}>
        <MoaSpeaks markup={moaSpeaks} imageSize={120} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  characterSpeakBox: {
    paddingVertical: 12,
  },
  container: {
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
    width: '100%',
  },
})
