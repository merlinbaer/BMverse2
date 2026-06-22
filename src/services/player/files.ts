import { Buffer } from 'buffer'

import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { musicFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import {
  parseM4aBufferMetadata,
  parseMp3BufferMetadata,
} from '@/services/player/tagParser'
import { MusicFile } from '@/types/player'

/**
 * Extracts metadata from a local file URI.
 */
const getFileMetadata = async (uri: string) => {
  try {
    const file = new File(uri)
    const uint8Array = await file.bytes()
    const buffer = Buffer.from(uint8Array)

    const decodedUri = decodeURIComponent(uri).toLowerCase()
    const isM4a = decodedUri.endsWith('.m4a') || decodedUri.endsWith('.mp4')
    const isMp3 = decodedUri.endsWith('.mp3')

    if (isM4a) {
      const m4aTags = parseM4aBufferMetadata(buffer)
      return {
        fileFormat: 'm4a' as const,
        tagVersion: m4aTags.tagVersion,
        common: {
          title: m4aTags.title,
          artist: m4aTags.artist,
          album: m4aTags.album,
          track: { no: m4aTags.track },
          disk: { no: m4aTags.disc },
          year: m4aTags.year,
          lyrics: m4aTags.lyrics ? [{ text: m4aTags.lyrics }] : null,
        },
      }
    }
    if (isMp3) {
      const mp3Tags = parseMp3BufferMetadata(buffer)
      return {
        fileFormat: 'mp3' as const,
        tagVersion: mp3Tags.tagVersion,
        common: {
          title: mp3Tags.title,
          artist: mp3Tags.artist,
          album: mp3Tags.album,
          track: { no: mp3Tags.track },
          disk: { no: mp3Tags.disc },
          year: mp3Tags.year,
          lyrics: mp3Tags.lyrics ? [{ text: mp3Tags.lyrics }] : null,
        },
      }
    }

    // Default fallback (returns null values safely)
    return null
  } catch (e) {
    console.log(`Failed parsing manual metadata for ${uri}:`, e)
    return null
  }
}

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
      type: ['audio/mpeg', 'audio/x-m4a', 'audio/mp4'],
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
      const safeName = asset.name.replace(/[^a-zA-Z0-9. _-]/g, '')
      const newFileName = `${uuid}_${importedAt}_${safeName}`

      // Copy the file to the persistent document area
      const sourceFile = new File(asset.uri)
      const destinationFile = new File(docDir, newFileName)
      void sourceFile.copy(destinationFile)

      // get meta tags
      const metadata = await getFileMetadata(asset.uri)
      const common = metadata?.common

      // Add to LegendState memory observable
      musicFiles$.push({
        id: uuid,
        audioUri: destinationFile.uri,
        coverUri: null,
        origFilename: asset.name,
        importedAt,
        fileFormat: metadata?.fileFormat ?? null,
        tagVersion: metadata?.tagVersion ?? null,
        origTitle: common?.title ?? null,
        origArtist: common?.artist ?? null,
        origAlbum: common?.album ?? null,
        origTrack: common?.track.no ?? null,
        origDisc: common?.disk.no ?? null,
        origYear: common?.year ?? null,
        origLyrics: common?.lyrics?.[0].text ?? null,
        title: common?.title ?? asset.name,
        artist: common?.artist ?? null,
        album: common?.album ?? null,
        lyrics: common?.lyrics?.[0].text ?? null,
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
    const contents = docDir.list()
    const currentStore = musicFiles$.peek() || []

    const musicFiles = await Promise.all(
      contents
        .filter(
          item => item instanceof File && /^[0-9a-f-]{36}/.test(item.name),
        )
        .map(async item => {
          const file = item as File
          // Parts: 0: ID, 1: ImportedAt, 2+: Filename
          const parts = file.name.split('_')
          const id = parts[0]
          const importedAt = parts[1]
          const filename = parts.slice(2).join('_')
          const existing = currentStore.find(f => f.id === id)
          const metadata = await getFileMetadata(file.uri)
          // console.log('metadata:', metadata)
          const common = metadata?.common

          return {
            id,
            audioUri: file.uri,
            coverUri: existing?.coverUri ?? null,
            origFilename: filename,
            importedAt,
            fileFormat: metadata?.fileFormat ?? null,
            tagVersion: metadata?.tagVersion ?? null,
            origTitle: common?.title ?? null,
            origArtist: common?.artist ?? null,
            origAlbum: common?.album ?? null,
            origTrack: common?.track.no ?? null,
            origDisc: common?.disk.no ?? null,
            origYear: common?.year ?? null,
            origLyrics: common?.lyrics?.[0].text ?? null,
            title: existing?.title ?? common?.title ?? filename,
            artist: existing?.artist ?? common?.artist ?? null,
            album: existing?.album ?? common?.album ?? null,
            lyrics: existing?.lyrics ?? common?.lyrics?.[0].text ?? null,
            appCoverUri: existing?.appCoverUri ?? null,
          } as MusicFile
        }),
    )
    musicFiles$.set(musicFiles)
  } catch (error) {
    console.error('refreshLocalMusicList error:', error)
  }
  console.log('BMverse: Local music files refreshed.')
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

    musicFiles$.set([])
  } catch (error) {
    console.error('deleteAllMusicFiles error:', error)
    throw error
  }
}
