import { Buffer } from 'buffer'

import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import * as mm from 'music-metadata'
import { Platform } from 'react-native'

import { musicFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import { MusicFile } from '@/types/player'

/**
 * A lightweight pure-JavaScript MP4/M4A Atom parser.
 * It manually parses the binary file structure to extract standard iTunes metadata,
 * bypassing the Metro bundling/dynamic-import issues completely.
 */
const parseM4aBufferMetadata = (buffer: Buffer) => {
  const metadata = {
    title: null as string | null,
    artist: null as string | null,
    album: null as string | null,
    lyrics: null as string | null,
    track: null as number | null,
    disc: null as number | null,
    year: null as number | null,
  }

  try {
    let offset = 0
    console.log(
      `[Parser Debug] Starting parse. Buffer size: ${buffer.length} bytes.`,
    )

    while (offset < buffer.length - 8) {
      const size = buffer.readUInt32BE(offset)

      // Safety check: Atom sizes must be valid (at least 8 bytes, and not exceeding remaining buffer)
      if (size < 8 || offset + size > buffer.length) {
        if (size === 1 && offset + 16 <= buffer.length) {
          const largeSize = Number(buffer.readBigUInt64BE(offset + 8))
          offset += largeSize
          continue
        }
        offset += 4 // Skip invalid structures safely
        continue
      }

      const type = buffer.toString('ascii', offset + 4, offset + 8)

      // We are looking for the containers which contain metadata
      if (type === 'moov' || type === 'udta' || type === 'ilst') {
        offset += 8
        continue
      }

      // 'meta' atom has a 4-byte header (Version & Flags) right after size & type
      if (type === 'meta') {
        offset += 12
        continue
      }

      // Read standard iTunes Metadata Atoms.
      const isTitle = type === '©nam' || type === ')nam'
      const isArtist = type === '©ART' || type === ')ART' || type === 'aART'
      const isAlbum = type === '©alb' || type === ')alb'
      const isLyrics = type === '©lyr' || type === ')lyr'
      const isYear = type === '©day' || type === ')day'

      if (isTitle || isArtist || isAlbum || isLyrics || isYear) {
        let subOffset = offset + 8
        const tagEnd = offset + size

        while (subOffset < tagEnd - 8) {
          const subSize = buffer.readUInt32BE(subOffset)
          const subType = buffer.toString('ascii', subOffset + 4, subOffset + 8)

          if (subType === 'data') {
            const typeFlags = buffer.readUInt32BE(subOffset + 8)

            // typeFlags === 1 indicates UTF-8 string data
            if ((typeFlags & 0xff000000) === 0 || (typeFlags & 0xff) === 1) {
              const dataString = buffer.toString(
                'utf8',
                subOffset + 16,
                subOffset + subSize,
              )
              if (isTitle) metadata.title = dataString
              if (isArtist) metadata.artist = dataString
              if (isAlbum) metadata.album = dataString
              if (isLyrics) metadata.lyrics = dataString
              if (isYear) {
                // Parse first 4 digits of release date string (e.g. "2014-02-26" -> 2014)
                const matchedYear = dataString.match(/^\d{4}/)
                if (matchedYear) metadata.year = parseInt(matchedYear[0], 10)
              }
            }
            break
          }
          subOffset += subSize
        }
      }

      // Read binary Metadata Atoms (trkn & disk)
      if (type === 'trkn' || type === 'disk') {
        let subOffset = offset + 8
        const tagEnd = offset + size

        while (subOffset < tagEnd - 8) {
          const subSize = buffer.readUInt32BE(subOffset)
          const subType = buffer.toString('ascii', subOffset + 4, subOffset + 8)

          if (subType === 'data') {
            // Check that the data payload has the expected size
            if (subOffset + 20 <= subOffset + subSize) {
              // Read 16-bit index values at subOffset + 18 (skipping 8-byte container + 8-byte flags/zeros)
              const indexVal = buffer.readUInt16BE(subOffset + 18)
              if (type === 'trkn') metadata.track = indexVal
              if (type === 'disk') metadata.disc = indexVal
              console.log(
                `[Parser Debug] Parsed binary tag '${type}': index is ${indexVal}`,
              )
            }
            break
          }
          subOffset += subSize
        }
      }

      offset += size
    }
  } catch (e) {
    console.log('M4A manual binary parse error:', e)
  }

  console.log(
    '[Parser Debug] Parsing complete. Extracted:',
    JSON.stringify(metadata),
  )
  return metadata
}
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

    if (isM4a) {
      // Use our custom pure-JS binary parser for iTunes M4A files
      const m4aTags = parseM4aBufferMetadata(buffer)
      return {
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

    // Use music-metadata for MP3 and other formats
    return await mm.parseBuffer(buffer)
  } catch (e) {
    console.log(`music-metadata: Failed parsing metadata for ${uri}:`, e)
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
        origTitle: common?.title ?? null,
        origArtist: common?.artist ?? null,
        origAlbum: common?.album ?? null,
        origTrack: common?.track.no ?? null,
        origDisc: common?.disk.no ?? null,
        origYear: common?.year ?? null,
        origLyrics: common?.lyrics?.[0].text ?? null,
        title: common?.title ?? asset.name,
        artist: importedAt + ' ' + (common?.title ?? asset.name),
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
          const common = metadata?.common

          return {
            id,
            audioUri: file.uri,
            coverUri: existing?.coverUri ?? null,
            origFilename: filename,
            importedAt,
            origTitle: common?.title ?? null,
            origArtist: common?.artist ?? null,
            origAlbum: common?.album ?? null,
            origTrack: common?.track.no ?? null,
            origDisc: common?.disk.no ?? null,
            origYear: common?.year ?? null,
            origLyrics: common?.lyrics?.[0].text ?? null,
            title: existing?.title ?? common?.title ?? filename,
            artist: importedAt + ' ' + (common?.title ?? filename),
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
