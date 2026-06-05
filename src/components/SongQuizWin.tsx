import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppButton } from '@/components/AppButton'
import { activePreviewSong$, songQuiz$ } from '@/services/legend'

export const SongQuizWin = () => {
  const handleReset = () => {
    activePreviewSong$.set(null) // Ensure player is wiped
    songQuiz$.set('NEW')
  }

  return (
    <View style={styles.container}>
      <AppBubbleText markup={'You win'} orientation={'center'} />
      <AppButton title={'New Game'} onPress={() => handleReset()}></AppButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
    width: '100%',
  },
})
