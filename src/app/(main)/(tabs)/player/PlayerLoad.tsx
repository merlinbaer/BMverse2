import { router, Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { useAlert } from '@/hooks/useAlert'
import {
  deleteAllCoverFiles,
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
  '- Recommended image size is 600 pixel\n' +
  '- Images are sorted by filename\n'
const deleteCoversText = 'Here you can delete all imported cover images.'
const deleteSingleCoverText = 'Here you can delete a single cover image.'

const handleDeleteSingle = () => {
  router.push('/(main)/(global)/MusicFileDelete')
}

const handleDeleteSingleCover = () => {
  router.push('/(main)/(global)/CoverFileDelete')
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

  const handleDeleteCovers = () => {
    showAlert(
      'Delete All Covers',
      'Are you sure you want to delete all imported cover images? App assets will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllCoverFiles()
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
        {/* Music Section */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.dot} />
            <AppText style={styles.header}>MUSIC FILE SECTION</AppText>
            <View style={styles.dot} />
          </View>
          <AppBubbleText markup={loadText} orientation={'center'} />
          <AppButton title={'Add Music File(s)'} onPress={handleLoadMusic} />

          <View style={styles.deleteGroup}>
            <AppText style={styles.deleteLabel}>{deleteSingleText}</AppText>
            <AppButton
              title={'Delete Single File'}
              onPress={handleDeleteSingle}
            />

            <AppText style={styles.deleteLabel}>{deleteText}</AppText>
            <AppButton title={'Delete All Music'} onPress={handleDeleteAll} />
          </View>
        </View>

        <View style={styles.separator} />

        {/* Covers Section */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.dot} />
            <AppText style={styles.header}>COVER IMAGE SECTION</AppText>
            <View style={styles.dot} />
          </View>
          <AppBubbleText markup={coverLoadText} orientation={'center'} />
          <AppButton title={'Add Cover Image(s)'} onPress={handleLoadCovers} />

          <View style={styles.deleteGroup}>
            <AppText style={styles.deleteLabel}>
              {deleteSingleCoverText}
            </AppText>
            <AppButton
              title={'Delete Single Image'}
              onPress={handleDeleteSingleCover}
            />

            <AppText style={styles.deleteLabel}>{deleteCoversText}</AppText>
            <AppButton
              title={'Delete All Covers'}
              onPress={handleDeleteCovers}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 40,
    paddingBottom: 40,
    width: '100%',
  },
  deleteGroup: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    width: '100%',
  },
  deleteLabel: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT.SIZE.SM,
    marginTop: 12,
    textAlign: 'center',
  },
  dot: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  header: {
    color: COLORS.PRIMARY,
    fontSize: FONT.SIZE.BASE,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 10,
  },
  section: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  separator: {
    backgroundColor: COLORS.MODAL_BORDER,
    height: 1,
    marginVertical: 40,
    width: '80%',
  },
})
