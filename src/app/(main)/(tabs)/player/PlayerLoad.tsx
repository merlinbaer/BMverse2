import { router, Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { useAlert } from '@/hooks/useAlert'
import {
  deleteAllMusicFiles,
  pickAndSaveCoverFiles,
  pickAndSaveMusicFiles,
} from '@/services/player/files'
import { AppBubbleText } from 'src/components/AppBubbleText'
import { AppScreen } from 'src/components/AppScreen'

const loadText =
  '**Select your music files to add to BMverse**\n' +
  '- MP3 and M4A files supported\n' +
  '- You can add multiple files at once\n' +
  '- You can add from your cloud drive\n' +
  '- A playlist is created, for multiple files\n' +
  '- No playlist is created, for a single file  \n\n' +
  '**About tagging**\n' +
  '- MP3: ID3v2.2, ID3v2.3, or ID3v2.4\n' +
  '- M4A: MP4 metadata (iTunes)\n' +
  '- Used Tags: Title, Artist, Album, Year\n' +
  '  Track Number, Disk Number(optional)'
const deleteText = 'Here you can delete all imported music files.'
const deleteSingleText = 'Here you can delete a single music file.'

const coverLoadText =
  '**Select your cover images to add to BMverse**\n' +
  '- PNG and JPG files are supported\n' +
  '- Recommended image size is 600 pixel\n'

const handleDeleteSingle = () => {
  router.push('/(main)/(global)/MusicFileDelete')
}

export default function PlayerLoadScreen() {
  const { showAlert } = useAlert()

  const handleLoadMusic = async () => {
    try {
      const result = await pickAndSaveMusicFiles()
      if (result.count > 0) {
        const message = result.playlistCreated
          ? `Successfully imported ${result.count} files. A new playlist has been created automatically.`
          : `Successfully imported ${result.count} file.`
        showAlert('Import Successful', message)
      }
    } catch (e) {
      console.error(e)
      showAlert(
        'Import Error',
        'An unexpected error occurred while importing your music.',
      )
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

  const handleLoadCovers = async () => {
    try {
      const result = await pickAndSaveCoverFiles()
      if (result && result.count > 0) {
        showAlert(
          'Import Successful',
          `Successfully imported ${result.count} cover image(s).`,
        )
      }
    } catch (e) {
      console.error(e)
      showAlert(
        'Import Error',
        'An unexpected error occurred while importing your covers.',
      )
    }
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
        <AppBubbleText markup={deleteSingleText} orientation={'center'} />
        <AppButton
          title={'Delete Single File'}
          onPress={handleDeleteSingle}
        ></AppButton>
        <AppBubbleText markup={deleteText} orientation={'center'} />
        <AppButton
          title={'Delete All Files'}
          onPress={handleDeleteAll}
        ></AppButton>
        <AppBubbleText markup={coverLoadText} orientation={'center'} />
        <AppButton
          title={'Add Cover Image(s)'}
          onPress={handleLoadCovers}
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
