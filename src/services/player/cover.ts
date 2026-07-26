import * as DocumentPicker from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import React from 'react'
import { Platform } from 'react-native'
import { Image as RNImage } from 'react-native/Libraries/Image/Image'
import Canvas, { Image as CanvasImage } from 'react-native-canvas'

import { IMAGES } from '@/constants/images'
import { cleanupPlaylistImages, coverFiles$ } from '@/services/legend'
import { generateId } from '@/services/legend/config'
import { CoverFile } from '@/types/player'

function getTop5DominantColors(data: any): string[] {
  const counts: Record<string, number> = {}
  const dataArray = Array.isArray(data) ? data : Object.values(data)

  for (let i = 0; i < dataArray.length; i += 4) {
    const r = dataArray[i] as number
    const g = dataArray[i + 1] as number
    const b = dataArray[i + 2] as number
    const a = dataArray[i + 3] as number

    // 1. Skip transparent or near-transparent pixels
    if (a < 128) continue

    // 2. QUANTIZATION: Round values to groups of 16 to group similar colors
    const qr = Math.floor(r / 16) * 16
    const qg = Math.floor(g / 16) * 16
    const qb = Math.floor(b / 16) * 16

    // 3. Skip extremely dark pixels (near black) unless the whole image is black
    if (qr < 20 && qg < 20 && qb < 20) continue

    const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1).toUpperCase()}`
    counts[hex] = (counts[hex] || 0) + 1
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color)

  // Fallback if the image was mostly black and we filtered everything out
  return sorted.length > 0 ? sorted : ['#000000']
}

export const processImage = async (
  /* Use in hidden canvas
    <View style={styles.hiddenCanvas}>
        <Canvas ref={canvasRef} />
    </View>
    hiddenCanvas: {
     left: -1000,
     position: 'absolute',
     top: -1000,
  },
  */
  currentTrack: {
    appCoverUri: string | number | null
  },
  canvasRef: React.RefObject<Canvas | null>,
) => {
  const canvas = canvasRef.current
  if (!canvas) {
    console.log('BMverse Debug: Canvas ref not available yet.')
    return
  }
  const source = currentTrack?.appCoverUri || IMAGES.cover200.notFound
  let imageUri =
    typeof source === 'number' ? RNImage.resolveAssetSource(source).uri : source
  console.log('BMVerse Debug ImageUri =', imageUri)
  if (!imageUri) {
    console.log('BMverse Debug: No imageUri found, skipping.')
    return
  }

  try {
    if (!imageUri.startsWith('data:')) {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpeg'
      const mime = extension === 'png' ? 'image/png' : 'image/jpeg'
      imageUri = `data:${mime};base64,${base64}`
    }

    const ctx = canvas.getContext('2d')
    const size = 50
    canvas.width = size
    canvas.height = size

    const image = new CanvasImage(canvas)

    image.addEventListener('load', async () => {
      try {
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(image, 0, 0, size, size)
        const imageData = await ctx.getImageData(0, 0, size, size)
        const colors = getTop5DominantColors(imageData.data)
        console.log('BMverse Result: Extracted dominant colors:', colors)
      } catch (err) {
        console.log('BMverse Error during color extraction:', err)
      }
    })

    image.src = imageUri
  } catch (error) {
    console.log('BMverse Error: ProcessImage main block failed:', error)
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
        coverUri: destinationFile.uri,
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
          coverUri: value,
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
          coverUri: file.uri,
        } as CoverFile
      })

    coverFiles$.set([...assetList, ...loadedFiles])
  } catch (error) {
    console.error('refreshLocalCoverList error:', error)
  }
}

/**
 * Deletes all imported cover images from the document directory.
 * Keeps 'asset' type covers in the store.
 * Resets playlist covers if they were using a deleted file.
 */
export const deleteAllCoverFiles = async () => {
  if (Platform.OS === 'web') return
  try {
    const docDir = new Directory(Paths.document)
    const contents = docDir.list()

    // 1. Delete physical files from the disk
    const filesToDelete = contents.filter(
      item => item instanceof File && item.name.startsWith('cover_'),
    )

    for (const item of filesToDelete) {
      const file = item as File
      void file.delete()
    }

    // 2. Filter store to keep only assets
    const assetsOnly = coverFiles$.get().filter(f => f.fileFormat === 'asset')
    coverFiles$.set(assetsOnly)

    // 3. Reset playlist imageUri for all local files
    cleanupPlaylistImages()
  } catch (error) {
    console.error('deleteAllCoverFiles error:', error)
    throw error
  }
}

export const deleteSingleCoverFile = async (coverId: string) => {
  if (Platform.OS === 'web') return
  try {
    const coverToDelete = coverFiles$.find(c => c.id.get() === coverId)?.get()
    if (!coverToDelete || coverToDelete.fileFormat === 'asset') return

    // 1. Delete a physical file
    const file = new File(coverToDelete.coverUri as string)
    file.delete()

    // 2. Remove from store
    const index = coverFiles$.get().findIndex(c => c.id === coverId)
    if (index !== -1) {
      coverFiles$.splice(index, 1)
    }

    // 3. Cleanup playlists using this specific image
    cleanupPlaylistImages(coverToDelete.coverUri as string)
  } catch (error) {
    console.error('deleteSingleCoverFile error:', error)
    throw error
  }
}
