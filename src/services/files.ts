import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { localMusicFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'

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
      // Clean filename to prevent path issues
      const safeName = asset.name.replace(/[^a-zA-Z0-9. _-]/g, '')
      const newFileName = `${uuid}_${safeName}`

      // Use the new File object API to handle the copy
      const sourceFile = new File(asset.uri)
      const destinationFile = new File(docDir, newFileName)

      // Copy the file to the persistent document area
      void sourceFile.copy(destinationFile)

      // Add to LegendState memory observable
      localMusicFiles$.push({
        id: uuid,
        name: newFileName,
        uri: destinationFile.uri,
        originalName: asset.name,
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
      .filter(item => item instanceof File && /^[0-9a-f-]{36}_/.test(item.name))
      .map(item => {
        const file = item as File
        return {
          id: file.name.split('_')[0],
          name: file.name,
          uri: file.uri,
          originalName: file.name.split('_').slice(1).join('_'),
        }
      })

    localMusicFiles$.set(musicFiles)
  } catch (error) {
    console.error('refreshLocalMusicList error:', error)
  }
}
