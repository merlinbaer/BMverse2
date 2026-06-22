import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { deleteAllMusicFiles, pickAndSaveMusicFiles } from '@/services/files'
import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

const loadText =
  '**Select music files for adding to BMverse**\n' +
  '- You can add multiple files at once\n' +
  '- You can add from your cloud drive\n' +
  '- A playlist is created, for several files\n' +
  '- No playlist is created, for a single file  \n\n' +
  '**ADVISE: Tag your files before adding!**'
const deleteText = 'Here you can delete all added files'

export default function PlayerLoadScreen() {
  const handleLoadMusic = async () => {
    try {
      await pickAndSaveMusicFiles()
    } catch (e) {
      console.error(e)
    }
  }
  const handleDeleteAll = async () => {
    try {
      await deleteAllMusicFiles()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Manage Files' }} />
      <View style={styles.container}>
        <AppBubbleText markup={loadText} orientation={'center'} />
        <AppButton
          title={'Load Music File(s)'}
          onPress={handleLoadMusic}
        ></AppButton>
        <AppBubbleText markup={deleteText} orientation={'center'} />
        <AppButton
          title={'Delete All Files'}
          onPress={handleDeleteAll}
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
