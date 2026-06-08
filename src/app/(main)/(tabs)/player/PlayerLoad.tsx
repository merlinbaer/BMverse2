import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { pickAndSaveMusicFiles } from '@/services/files'
import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

const loadText =
  'Select music files for adding them to BMverse.\n' +
  'You can add multiple files at once.' +
  'You can add from your cloud drive too.' +
  'You can select a folder to add all music files in it.'

export default function PlayerLoadScreen() {
  const handleLoadMusic = async () => {
    try {
      await pickAndSaveMusicFiles()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Add Music' }} />
      <View style={styles.container}>
        <AppBubbleText markup={loadText} orientation={'center'} />
        <AppButton
          title={'Load Music File'}
          onPress={handleLoadMusic}
        ></AppButton>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
    marginVertical: 40,
    width: '100%',
  },
})
