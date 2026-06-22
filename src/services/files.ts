import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { musicFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import { MusicFile } from '@/types/player'

/**
 * Picks music files from the device and saves them to the app's document directory.
 * Uses the new Expo SDK 56 FileSystem API.
 */
export const pickAndSaveMusicFiles = async () => {
  if (Platform.OS === 'web') {
    console.warn('File picking is not supported on web in this implementation.')
    return
  }
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
      multiple: true,
    })

    if (result.canceled || !result.assets) {
      return
    }

    // Paths.document is the modern equivalent of documentDirectory
    const docDir = Paths.document

    for (const asset of result.assets) {
      const uuid = generateId()
      const importedAt = new Date().toISOString()
      // Clean filename to prevent path issues
      const safeName = asset.name.replace(/[^a-zA-Z0-9. _-]/g, '')
      // New filename format: ID_TIMESTAMP_FILENAME
      const newFileName = `${uuid}_${importedAt}_${safeName}`

      // Use the new File object API to handle the copy
      const sourceFile = new File(asset.uri)
      const destinationFile = new File(docDir, newFileName)

      // Copy the file to the persistent document area
      void sourceFile.copy(destinationFile)

      // Add to LegendState memory observable
      musicFiles$.push({
        id: uuid,
        audioUri: destinationFile.uri,
        coverUri: null,
        origFilename: asset.name,
        importedAt,
        origTitle: null,
        origArtist: null,
        origAlbum: null,
        origTrack: null,
        origDisc: null,
        origYear: null,
        origLyrics: null,
        title: asset.name, // Original Filename copied to title
        artist: importedAt,
        album: null,
        lyrics: null,
        appCoverUri: null,
      })
    }
  } catch (error) {
    console.error('pickAndSaveMusicFiles error:', error)
    throw error
  }
}

/**
 * Loads existing music files from the document directory into the observable.
 */
export const refreshLocalMusicList = async () => {
  if (Platform.OS === 'web') return
  try {
    const docDir = new Directory(Paths.document)

    // list() returns an array of File and Directory objects
    const contents = docDir.list()

    const musicFiles = contents
      .filter(item => item instanceof File && /^[0-9a-f-]{36}/.test(item.name))
      .map(item => {
        const file = item as File
        // Split by the first underscore to separate UUID from filename
        // Parts: 0: ID, 1: ImportedAt, 2+: Filename
        const parts = file.name.split('_')
        const id = parts[0]
        const importedAt = parts[1]
        const filename = parts.slice(2).join('_')
        return {
          id,
          audioUri: file.uri,
          coverUri: null,
          origFilename: filename,
          importedAt,
          origTitle: null,
          origArtist: null,
          origAlbum: null,
          origTrack: null,
          origDisc: null,
          origYear: null,
          origLyrics: null,
          title: filename,
          artist: importedAt,
          album: null,
          lyrics: null,
          appCoverUri: null,
        } as MusicFile
      })

    musicFiles$.set(musicFiles)
  } catch (error) {
    console.error('refreshLocalMusicList error:', error)
  }
}

/**
 * Deletes all imported music files from the document directory and clears the store.
 */
export const deleteAllMusicFiles = async () => {
  if (Platform.OS === 'web') return
  try {
    const docDir = new Directory(Paths.document)
    const contents = docDir.list()

    const filesToDelete = contents.filter(
      item => item instanceof File && /^[0-9a-f-]{36}/.test(item.name),
    )

    for (const item of filesToDelete) {
      const file = item as File
      void file.delete()
    }

    musicFiles$.delete()
  } catch (error) {
    console.error('deleteAllMusicFiles error:', error)
    throw error
  }
}
