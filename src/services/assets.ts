import { Asset } from 'expo-asset'
import { Image, Platform } from 'react-native'

import channelDataRaw from '@/constants/channel.json'
import flagsDataRaw from '@/constants/flags.json'
import { IMAGES } from '@/constants/images'
import { isOfflineReady$ } from '@/services/pwa'
import { isValidUrl } from '@/services/urlHelper'

export interface FlagItem {
  setlist_artwork: string
}

export interface ChannelItem {
  channel_artwork: string
}

const flagsData = flagsDataRaw as unknown as FlagItem[]
const channelData = channelDataRaw as unknown as ChannelItem[]

export const getFlagsList = (): string[] => {
  return flagsData.map((item: FlagItem) => item.setlist_artwork)
}
export const getChannelList = (): string[] => {
  return channelData.map((item: ChannelItem) => item.channel_artwork)
}

/**
 * Preloads all essential assets into the local device cache.
 * In PWA mode, this ensures the Service Worker captures and stores them offline.
 */
export async function initAssets() {
  // Wait for the Service Worker to take control before starting downloads
  // This ensures the first-run caching actually works.
  if (Platform.OS === 'web') {
    await isOfflineReady$
  }

  const safeAssets = [
    ...Object.values(IMAGES.characters),
    ...Object.values(IMAGES.cover200),
    ...Object.values(IMAGES.icons),
    ...Object.values(IMAGES.other),
    ...getFlagsList(),
  ]

  try {
    // 1. Load local images and safe third party image
    await Asset.loadAsync(safeAssets)

    // 2. Load YouTube Channel Images (Throttled & Browser-Native)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const channelUrls = getChannelList()

      for (const url of channelUrls) {
        // Use 1-second delay specifically for YouTube to avoid 429
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Using a standard Image object is less likely to trigger 429 than fetch()
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.src = url
      }
    } else {
      await Asset.loadAsync(getChannelList())
    }

    // 3. Force Font Preloading (Web PWA specific)
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

/**
 * Resolves a bundled Expo asset module to a local file URI formatted with file://.
 */
export async function getAssetLocalUri(
  assetModule: string | number,
): Promise<string | undefined> {
  try {
    const asset = Asset.fromModule(assetModule)
    await asset.downloadAsync()

    let uri = asset.localUri || asset.uri

    if (!uri || (!isValidUrl(uri) && !uri.startsWith('/'))) {
      try {
        const resolved = Image.resolveAssetSource(
          typeof assetModule === 'number' ? assetModule : { uri: assetModule },
        )
        if (resolved?.uri) {
          uri = resolved.uri
        }
      } catch (e) {
        console.log(
          'BMverse: assets.ts: resolveAssetSource fallback failed:',
          e,
        )
      }
    }

    if (uri?.startsWith('/') && !uri.startsWith('file://')) {
      return `file://${uri}`
    }

    return uri || undefined
  } catch (error) {
    console.log('BMverse: assets.ts: getAssetLocalUri failed:', error)
    return undefined
  }
}

/**
 * Resolves IMAGES.cover200.notFound to a local file URI.
 */
export async function getFallbackArtworkAssetUri(): Promise<
  string | undefined
> {
  const fallbackAssetModule = IMAGES.cover200.notFound
  if (!fallbackAssetModule) {
    console.log(
      'BMverse: assets.ts: Fallback asset module not found in IMAGES.cover200.notFound',
    )
    return undefined
  }
  return await getAssetLocalUri(fallbackAssetModule)
}
