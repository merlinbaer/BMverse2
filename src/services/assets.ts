import { Asset } from 'expo-asset'
import { Platform } from 'react-native'

import { IMAGES } from '@/constants/images'

/**
 * Preloads all essential assets into the local device cache.
 * In PWA mode, this ensures the Service Worker captures and stores them offline.
 */
export async function initAssets() {
  // 1. Preload Images & Raw Files
  const imagesToLoad = [
    ...Object.values(IMAGES.characters),
    ...Object.values(IMAGES.cover200),
    ...Object.values(IMAGES.icons),
    ...Object.values(IMAGES.other),
  ]

  try {
    // Standard Expo preloading for images
    await Asset.loadAsync(imagesToLoad)

    // 2. Force Font Preloading (Web PWA specific)
    // We use the 'fonts' section because it contains the actual .ttf files
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontEntries = Object.entries(IMAGES.fonts)

      await Promise.all(
        fontEntries.map(async ([name, fontRequire]) => {
          const asset = Asset.fromModule(fontRequire)
          await asset.downloadAsync()

          // Trigger the actual binary download so sw.js can cache it
          if (asset.localUri) {
            const font = new FontFace(name, `url(${asset.localUri})`)
            return font.load().then(f => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(document as any).fonts.add(f)
            })
          }
        }),
      )
    }

    console.log('BMverse: Assets & Fonts preloaded successfully.')
  } catch (error) {
    console.error('BMverse: Asset preloading failed:', error)
  }
}
