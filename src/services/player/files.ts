import { Buffer } from 'buffer'

import * as DocumentPicker from 'expo-document-picker'
import { File, FileMode, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { IMAGES } from '@/constants/images'
import { musicFiles$, playlists$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import {
  parseM4aBufferMetadata,
  parseMp3BufferMetadata,
} from '@/services/player/tagParser'
import { MusicFile } from '@/types/player'

import { getPlaylistTimestamp } from '../dateTimeHelper'

/**
 * Extracts metadata from a local file URI.
 */
const getFileMetadata = async (uri: string, fileName?: string) => {
  try {
    const checkString = (fileName || uri || '').toLowerCase()
    const isM4a = checkString.endsWith('.m4a') || checkString.endsWith('.mp4')
    const isMp3 = checkString.endsWith('.mp3')

    let buffer: Buffer

    const file = new File(uri)
    if (!file.exists) return null

    const handle = file.open(FileMode.ReadOnly)
    try {
      if (isMp3) {
        // Read first 10 bytes to check for ID3 tag size
        const headBytes = handle.readBytes(10)
        const headBuffer = Buffer.from(headBytes)

        if (
          headBuffer.toString('ascii', 0, 3) === 'ID3' &&
          headBuffer.length >= 10
        ) {
          const sizeBytes = [
            headBuffer.readUInt8(6),
            headBuffer.readUInt8(7),
            headBuffer.readUInt8(8),
            headBuffer.readUInt8(9),
          ]
          // ID3v2 size is 4 bytes, each with 7 bits.
          // We shift according to the spec to get the full tag size.
          const tagSize =
            (sizeBytes[0] << 21) |
            (sizeBytes[1] << 14) |
            (sizeBytes[2] << 7) |
            sizeBytes[3]

          // Read the tag + header (10 bytes header + tagSize)
          handle.offset = 0 // Reset to start
          const fullBytes = handle.readBytes(tagSize + 10)
          buffer = Buffer.from(fullBytes)
        } else {
          // No ID3v2 tag at start, read a small chunk for ID3v1 or other info
          handle.offset = 0
          const smallBytes = handle.readBytes(4096)
          buffer = Buffer.from(smallBytes)
        }
      } else if (isM4a) {
        // M4A atoms can be scattered, but 'moov' is typically at the start or end.
        // Reading the whole file is slow, so we try the first 1 MB, which covers most cases.
        const bytes = handle.readBytes(1024 * 1024)
        buffer = Buffer.from(bytes)
      } else {
        // Unknown type, read a reasonable chunk
        const bytes = handle.readBytes(1024 * 1024)
        buffer = Buffer.from(bytes)
      }
    } finally {
      handle.close()
    }

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

  const docDir = Paths.document.uri
  if (!docDir) {
    throw new Error('Document directory not available')
  }

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/x-m4a', 'audio/mp4'],
      copyToCacheDirectory: false,
      multiple: true,
    })

    if (result.canceled || !result.assets) {
      return { count: 0, playlistCreated: false }
    }

    const importedMusicFiles: MusicFile[] = []
    const importedCount = result.assets.length

    for (const asset of result.assets) {
      const uuid = generateId()
      const importedAt = new Date().toISOString()
      const timestamp = Date.now()
      const safeName = asset.name.replace(/[^a-zA-Z0-9. _-]/g, '')
      const newFileName = `${uuid}_${timestamp}_${safeName}`

      // Copy the file to the persistent document area
      const destinationFile = new File(Paths.document, newFileName)
      const destinationUri = destinationFile.uri
      try {
        const sourceFile = new File(asset.uri)
        await sourceFile.copy(destinationFile)
      } catch (copyError) {
        console.error(
          `BMverse: copyAsync failed for ${asset.uri}, trying read/write fallback:`,
          copyError,
        )
        // Fallback: Read as Base64 and write to destination
        const sourceFile = new File(asset.uri)
        const base64 = await sourceFile.base64()
        destinationFile.write(base64, {
          encoding: 'base64',
        })
      }

      // get meta tags
      const metadata = await getFileMetadata(destinationUri, asset.name)
      const common = metadata?.common

      // Add to LegendState memory observable
      const musicFile: MusicFile = {
        id: uuid,
        audioUri: destinationUri,
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
      }
      musicFiles$.push(musicFile)
      importedMusicFiles.push(musicFile)
    }

    // Create a playlist if more than one file is imported
    let playlistCreated = false
    if (importedCount > 1) {
      const now = new Date()

      // Sort imported files by album, disc, and track
      importedMusicFiles.sort((a, b) => {
        const albumA = a.album || a.origAlbum || ''
        const albumB = b.album || b.origAlbum || ''
        return (
          albumA.localeCompare(albumB) ||
          (a.origDisc ?? 0) - (b.origDisc ?? 0) ||
          (a.origTrack ?? 0) - (b.origTrack ?? 0)
        )
      })

      playlists$.push({
        id: generateId(),
        name: getPlaylistTimestamp(now),
        imageUri: IMAGES.cover200.notFound,
        tracks: importedMusicFiles.map((file, index) => ({
          musicFileId: file.id,
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
    const docDir = Paths.document.uri
    if (!docDir) return

    const items = Paths.document.list()
    const contents = items.map(item => item.name)
    const currentStore = musicFiles$.peek() || []

    const musicFiles: MusicFile[] = []

    // Process files sequentially to avoid memory pressure and bridge congestion
    const relevantFiles = contents.filter(name => /^[0-9a-f-]{36}/.test(name))

    for (const name of relevantFiles) {
      const fileUri = `${docDir}${name}`
      // Parts: 0: ID, 1: ImportedAt, 2+: Filename
      const parts = name.split('_')
      const id = parts[0]
      const timestamp = parts[1]
      const importedAt = /^\d+$/.test(timestamp)
        ? new Date(parseInt(timestamp, 10)).toISOString()
        : timestamp // Fallback for old format
      const filename = parts.slice(2).join('_')

      const existing = currentStore.find(f => f.id === id)

      // Skip parsing if we already have this file and its metadata in the store
      if (existing && existing.fileFormat) {
        musicFiles.push({
          ...existing,
          audioUri: fileUri, // Always update URI in case docDir path changed
          origFilename: filename,
          importedAt,
        })
        continue
      }

      const metadata = await getFileMetadata(fileUri, filename)
      const common = metadata?.common

      musicFiles.push({
        id,
        audioUri: fileUri,
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
      } as MusicFile)
    }

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
    const docDir = Paths.document.uri
    if (!docDir) return

    const items = Paths.document.list()
    const contents = items.map(item => item.name)

    const filesToDelete = contents.filter(name => /^[0-9a-f-]{36}/.test(name))

    for (const name of filesToDelete) {
      const file = new File(Paths.document, name)
      if (file.exists) {
        file.delete()
      }
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
    if (file.exists) {
      file.delete()
    }

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
