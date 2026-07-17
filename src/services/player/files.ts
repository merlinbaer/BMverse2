import { Buffer } from 'buffer'

import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { IMAGES } from '@/constants/images'
import { coverFiles$, musicFiles$, playlists$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import {
  parseM4aBufferMetadata,
  parseMp3BufferMetadata,
} from '@/services/player/tagParser'
import { CoverFile, MusicFile } from '@/types/player'

import { getPlaylistTimestamp } from '../dateTimeHelper'

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
    return { count: 0, playlistCreated: false }
  }
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/x-m4a', 'audio/mp4'],
      copyToCacheDirectory: true,
      multiple: true,
    })

    if (result.canceled || !result.assets) {
      return { count: 0, playlistCreated: false }
    }

    const docDir = Paths.document
    const newTrackIds: string[] = []
    const importedCount = result.assets.length

    for (const asset of result.assets) {
      const uuid = generateId()
      newTrackIds.push(uuid)
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

    // Create a playlist if more than one file is imported
    let playlistCreated = false
    if (importedCount > 1) {
      const now = new Date()
      playlists$.push({
        id: generateId(),
        name: getPlaylistTimestamp(now),
        imageUri: IMAGES.cover200.notFound,
        tracks: newTrackIds.map((id, index) => ({
          musicFileId: id,
          trackNum: index + 1,
        })),
      })
      playlistCreated = true
    }
    return { count: importedCount, playlistCreated }
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
    playlists$.set([]) // Clear playlists as well
  } catch (error) {
    console.error('deleteAllMusicFiles error:', error)
    throw error
  }
}

export const deleteSingleMusicFile = async (fileId: string) => {
  if (Platform.OS === 'web') return
  try {
    const fileToDelete = musicFiles$.find(f => f.id.get() === fileId)?.get()
    if (!fileToDelete) return

    // 1. Delete a physical file
    const file = new File(fileToDelete.audioUri)
    file.delete()

    // 2. Remove from musicFiles store
    const fileIndex = musicFiles$.get().findIndex(f => f.id === fileId)
    if (fileIndex !== -1) musicFiles$.splice(fileIndex, 1)

    // 3. Remove from all playlists and re-index track numbers
    const currentPlaylists = playlists$.get()
    currentPlaylists.forEach((playlist, pIndex) => {
      const trackIndex = playlist.tracks.findIndex(
        t => t.musicFileId === fileId,
      )
      if (trackIndex !== -1) {
        const updatedTracks = playlist.tracks
          .filter(t => t.musicFileId !== fileId)
          .map((t, idx) => ({ ...t, trackNum: idx + 1 }))
        playlists$[pIndex].tracks.set(updatedTracks)
      }
    })
  } catch (error) {
    console.error('deleteSingleMusicFile error:', error)
    throw error
  }
}

/**
 * Picks image files (PNG/JPG) and saves them to the app's document directory.
 */
export const pickAndSaveCoverFiles = async () => {
  if (Platform.OS === 'web') return { count: 0 }
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpeg'],
      copyToCacheDirectory: true,
      multiple: true,
    })

    if (result.canceled || !result.assets) return { count: 0 }

    const docDir = Paths.document
    const importedCount = result.assets.length

    for (const asset of result.assets) {
      const uuid = generateId()
      const importedAt = new Date().toISOString()
      const extension = asset.name.toLowerCase().endsWith('.png')
        ? 'png'
        : 'jpg'
      const safeName = asset.name.replace(/[^a-zA-Z0-9. _-]/g, '')
      const newFileName = `cover_${uuid}_${importedAt}_${safeName}`

      const sourceFile = new File(asset.uri)
      const destinationFile = new File(docDir, newFileName)
      void sourceFile.copy(destinationFile)

      coverFiles$.push({
        id: uuid,
        importedAt,
        origFilename: asset.name,
        fileFormat: extension,
      })
    }
    return { count: importedCount }
  } catch (error) {
    console.error('pickAndSaveCoverFiles error:', error)
    throw error
  }
}

/**
 * Refresh cover list: ensures assets are present and reloads document-stored images
 */
export const refreshLocalCoverList = async () => {
  if (Platform.OS === 'web') return
  try {
    const docDir = new Directory(Paths.document)
    const contents = docDir.list()
    const currentStore = coverFiles$.peek() || []

    // 1. Process App Assets
    const assets = IMAGES.cover600
    const assetList: CoverFile[] = Object.entries(assets).map(
      ([key, value]) => {
        // Check if this asset already exists in our persistent store to keep its metadata
        const existing = currentStore.find(
          f => f.fileFormat === 'asset' && f.origFilename === key,
        )

        return {
          id: existing?.id || String(value),
          importedAt: existing?.importedAt || new Date().toISOString(),
          origFilename: key,
          fileFormat: 'asset',
        }
      },
    )

    // 2. Load from Filesystem using structured filenames
    const loadedFiles = contents
      .filter(item => item instanceof File && item.name.startsWith('cover_'))
      .map(item => {
        const file = item as File
        // Pattern: cover_{uuid}_{importedAt}_{origFilename}
        const nameWithoutPrefix = file.name.replace(/^cover_/, '')
        const parts = nameWithoutPrefix.split('_')

        const id = parts[0]
        const importedAt = parts[1]
        const origFilename = parts.slice(2).join('_')
        const extension = file.name.toLowerCase().endsWith('.png')
          ? 'png'
          : 'jpg'

        return {
          id,
          importedAt,
          origFilename,
          fileFormat: extension as 'png' | 'jpg',
        } as CoverFile
      })

    coverFiles$.set([...assetList, ...loadedFiles])
  } catch (error) {
    console.error('refreshLocalCoverList error:', error)
  }
}
