import { Asset } from 'expo-asset'

import { IMAGES } from '@/constants/images'

/**
 * Preloads all essential assets into the local device cache.
 * In PWA mode, this ensures the Service Worker captures and stores them offline.
 */
export async function initAssets() {
  const assetsToLoad = [
    ...Object.values(IMAGES.characters),
    ...Object.values(IMAGES.cover200),
    ...Object.values(IMAGES.icons),
  ]

  try {
    await Asset.loadAsync(assetsToLoad)
    console.log('BMverse: Assets preloaded successfully.')
  } catch (error) {
    console.error('BMverse: Asset preloading failed:', error)
  }
}
