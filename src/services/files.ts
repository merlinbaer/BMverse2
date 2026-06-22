import { Buffer } from 'buffer'

import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { musicFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import { MusicFile } from '@/types/player'

/**
 * A lightweight, pure-JavaScript ID3v2 (MP3) metadata tag parser.
 * Supports both ID3v2.2 (3-byte frames) and ID3v2.3/2.4 (4-byte frames).
 */
const parseMp3BufferMetadata = (buffer: Buffer) => {
  const metadata = {
    title: null as string | null,
    artist: null as string | null,
    album: null as string | null,
    lyrics: null as string | null,
    track: null as number | null,
    disc: null as number | null,
    year: null as number | null,
    tagVersion: null as string | null, // Added property
  }

  try {
    const header = buffer.toString('ascii', 0, 3)
    if (header !== 'ID3') return metadata

    const version = buffer.readUInt8(3)
    metadata.tagVersion = `ID3v2.${version}.0` // Set identified tag version

    const sizeBytes = [
      buffer.readUInt8(6),
      buffer.readUInt8(7),
      buffer.readUInt8(8),
      buffer.readUInt8(9),
    ]
    const tagSize =
      (sizeBytes[0] << 21) |
      (sizeBytes[1] << 14) |
      (sizeBytes[2] << 7) |
      sizeBytes[3]

    let offset = 10
    const end = 10 + tagSize

    const isV2_2 = version === 2
    const headerSize = isV2_2 ? 6 : 10
    const frameIdLen = isV2_2 ? 3 : 4

    while (offset < end && offset < buffer.length - headerSize) {
      const frameID = buffer.toString('ascii', offset, offset + frameIdLen)

      if (frameID.replace(/\0/g, '') === '' || !/^[A-Z0-9]+$/.test(frameID)) {
        break
      }

      let frameSize = 0
      if (isV2_2) {
        frameSize =
          (buffer.readUInt8(offset + 3) << 16) |
          (buffer.readUInt8(offset + 4) << 8) |
          buffer.readUInt8(offset + 5)
      } else {
        frameSize = buffer.readUInt32BE(offset + 4)
      }

      if (frameSize <= 0 || offset + headerSize + frameSize > buffer.length) {
        break
      }

      const frameDataOffset = offset + headerSize

      const isTitle = isV2_2 ? frameID === 'TT2' : frameID === 'TIT2'
      const isArtist = isV2_2 ? frameID === 'TP1' : frameID === 'TPE1'
      const isAlbum = isV2_2 ? frameID === 'TAL' : frameID === 'TALB'
      const isLyrics = isV2_2 ? frameID === 'ULT' : frameID === 'USLT'
      const isYear = isV2_2 ? frameID === 'TYE' : frameID === 'TYER'
      const isTrack = isV2_2 ? frameID === 'TRK' : frameID === 'TRCK'
      const isDisc = isV2_2 ? frameID === 'TPA' : frameID === 'TPOS'

      if (
        isTitle ||
        isArtist ||
        isAlbum ||
        isLyrics ||
        isYear ||
        isTrack ||
        isDisc
      ) {
        const encoding = buffer.readUInt8(frameDataOffset)

        let text = ''
        if (encoding === 1 || encoding === 2) {
          text = buffer
            .toString(
              'utf16le',
              frameDataOffset + 3,
              frameDataOffset + frameSize,
            )
            .replace(/^\uFEFF/, '')
        } else {
          text = buffer.toString(
            'utf8',
            frameDataOffset + 1,
            frameDataOffset + frameSize,
          )
        }

        text = text.replace(/\0/g, '').trim()

        if (isTitle) metadata.title = text
        if (isArtist) metadata.artist = text
        if (isAlbum) metadata.album = text
        if (isLyrics) {
          metadata.lyrics = text.substring(4)
        }
        if (isYear) {
          const parsedYear = parseInt(text, 10)
          if (!isNaN(parsedYear)) metadata.year = parsedYear
        }
        if (isTrack) {
          const match = text.match(/^(\d+)/)
          if (match) metadata.track = parseInt(match[1], 10)
        }
        if (isDisc) {
          const match = text.match(/^(\d+)/)
          if (match) metadata.disc = parseInt(match[1], 10)
        }
      }

      offset += headerSize + frameSize
    }
  } catch (e) {
    console.log('MP3 manual ID3v2 parse error:', e)
  }

  return metadata
}

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
    tagVersion: 'iTunes Atom' as string | null, // M4A uses iTunes Atoms structure
  }

  try {
    let offset = 0
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
                // Parse the first 4 digits of the release date string (e.g. "2014-02-26" -> 2014)
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
    const isMp3 = decodedUri.endsWith('.mp3')

    if (isM4a) {
      // Use our custom pure-JS binary parser for iTunes M4A files
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
      // Use our custom pure-JS binary parser for MP3 ID3v2 files
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
    console.log('musicFiles:', musicFiles)
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

    musicFiles$.set([])
  } catch (error) {
    console.error('deleteAllMusicFiles error:', error)
    throw error
  }
}
