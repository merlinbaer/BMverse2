import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { useAlert } from '@/hooks/useAlert'
import {
  deleteAllMusicFiles,
  pickAndSaveMusicFiles,
} from '@/services/player/files'
import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

const loadText =
  '**Select your music files to add to BMverse**\n' +
  '- You can add multiple files at once\n' +
  '- You can add from your cloud drive\n' +
  '- MP3 and M4A files supported\n' +
  '- A playlist is created, for multiple files\n' +
  '- No playlist is created, for a single file  \n\n' +
  '**About tagging**\n' +
  '- MP3: ID3v2.2, ID3v2.3, or ID3v2.4\n' +
  '- M4A: MP4 metadata (iTunes)\n' +
  '- Recommended: Title, Artist, Album,\n' +
  '  Year and Track Number\n' +
  '- Optional: Disk Number, Lyrics, Cover'
const deleteText = 'Here you can delete all imported music files.'

export default function PlayerLoadScreen() {
  const { showAlert } = useAlert()

  const handleLoadMusic = async () => {
    try {
      await pickAndSaveMusicFiles()
    } catch (e) {
      console.error(e)
    }
  }
  const handleDeleteAll = () => {
    showAlert(
      'Delete All Data',
      'Are you sure you want to delete all music files and all playlists? this action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllMusicFiles()
            } catch (e) {
              console.error(e)
            }
          },
        },
      ],
    )
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Manage Files' }} />
      <View style={styles.container}>
        <AppBubbleText markup={loadText} orientation={'center'} />
        <AppButton
          title={'Add Music File(s)'}
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
