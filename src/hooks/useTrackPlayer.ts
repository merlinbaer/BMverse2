import { useValue } from '@legendapp/state/react'
import { Asset } from 'expo-asset'
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from 'expo-audio'
import Constants from 'expo-constants'
import * as FileSystemLegacy from 'expo-file-system/legacy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, Platform } from 'react-native'

import { IMAGES } from '@/constants/images'
import {
  activeTrackIndex$,
  activeTrackList$,
  musicFiles$,
} from '@/services/legend'
import { isValidUrl } from '@/services/urlHelper'

export const useTrackPlayer = (onFinished?: () => void) => {
  const TRANSPARENT_PIXEL_PATH = `${FileSystemLegacy.cacheDirectory}transparent_pixel.png`

  useEffect(() => {
    console.log(
      'BMverse: Build 2026-08-30 14:00 - SDK 57 Asset & FileSystem Fix & Lint Applied',
    )

    // Ensure transparent pixel exists for clearing artwork
    const ensurePixel = async () => {
      try {
        const info = await FileSystemLegacy.getInfoAsync(TRANSPARENT_PIXEL_PATH)
        if (!info.exists) {
          const base64 =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
          await FileSystemLegacy.writeAsStringAsync(
            TRANSPARENT_PIXEL_PATH,
            base64,
            { encoding: 'base64' },
          )
          console.log(
            'BMverse: useTrackPlayer: Created transparent pixel at',
            TRANSPARENT_PIXEL_PATH,
          )
        }
      } catch (e) {
        console.warn(
          'BMverse: useTrackPlayer: Failed to create transparent pixel',
          e,
        )
      }
    }
    ensurePixel()
  }, [TRANSPARENT_PIXEL_PATH])
  const activeTracks = useValue(activeTrackList$)
  const allFiles = useValue(musicFiles$)
  const activeIndex = useValue(activeTrackIndex$)

  const files = useMemo(
    () => (activeTracks.length > 0 ? activeTracks : allFiles),
    [activeTracks, allFiles],
  )
  const currentTrack = files[activeIndex]

  const sources = useMemo(
    () =>
      files.map(f => ({
        uri: f.audioUri,
        name: f.title || f.origTitle || undefined,
      })),
    [files],
  )

  const playlist = useAudioPlaylist({
    sources,
    loop: 'none',
  })
  const status = useAudioPlaylistStatus(playlist)

  // Proxy player for lock screen metadata (since AudioPlaylist currently lacks it in expo-audio)
  const proxyPlayer = useAudioPlayer(null)
  const proxyStatus = useAudioPlayerStatus(proxyPlayer)

  const isReplacing = useRef(false)
  const lastStatusPlaying = useRef(status?.playing)
  const lastProxyPlaying = useRef(proxyStatus.playing)
  const lastSyncedIndex = useRef(-1)

  const [resolvedArtworkUrl, setResolvedArtworkUrl] = useState<
    string | undefined
  >(undefined)
  const [lastTrackUri, setLastTrackUri] = useState<string | undefined>(
    currentTrack?.audioUri ?? undefined,
  )

  const currentUri = currentTrack?.audioUri ?? undefined
  if (currentUri !== lastTrackUri) {
    setLastTrackUri(currentUri)
    setResolvedArtworkUrl(undefined)
  }

  // Resolve artwork URL for lock screen metadata
  useEffect(() => {
    let isCancelled = false
    const loadArtwork = async () => {
      if (!currentTrack) {
        return
      }

      let url: string | undefined = undefined
      const rawUri = currentTrack.appCoverUri

      try {
        console.log('BMverse: useTrackPlayer: loadArtwork rawUri:', rawUri)
        if (typeof rawUri === 'string' && isValidUrl(rawUri)) {
          url = rawUri
        } else if (
          typeof rawUri === 'number' ||
          (typeof rawUri === 'string' && rawUri.length > 0)
        ) {
          const asset = Asset.fromModule(rawUri)
          console.log('BMverse: useTrackPlayer: asset before download:', asset)
          await asset.downloadAsync()
          console.log('BMverse: useTrackPlayer: asset after download:', asset)

          let candidate = asset.localUri || asset.uri

          // Fallback to Image.resolveAssetSource if candidate is not a valid URL
          if (!isValidUrl(candidate) && !candidate?.startsWith('/')) {
            try {
              const resolved = Image.resolveAssetSource(
                typeof rawUri === 'number' ? rawUri : { uri: rawUri },
              )
              console.log(
                'BMverse: useTrackPlayer: Image.resolveAssetSource:',
                resolved,
              )
              if (resolved && resolved.uri) {
                candidate = resolved.uri
              }
            } catch (e) {
              console.warn(
                'BMverse: useTrackPlayer: Image.resolveAssetSource failed',
                e,
              )
            }
          }

          console.log('BMverse: useTrackPlayer: candidate:', candidate)
          if (candidate) {
            if (candidate.startsWith('/') && !candidate.startsWith('file://')) {
              candidate = `file://${candidate}`
            }

            const isBundledAndroid =
              Platform.OS === 'android' &&
              (candidate.startsWith('asset://') ||
                candidate.startsWith('res://') ||
                candidate.startsWith('android.resource://') ||
                candidate.startsWith('file:///android_res/') ||
                candidate.startsWith('file:///android_asset/') ||
                (!candidate.includes('://') && !candidate.startsWith('/')))

            console.log(
              'BMverse: useTrackPlayer: isBundledAndroid:',
              isBundledAndroid,
            )

            if (isValidUrl(candidate) && !isBundledAndroid) {
              url = candidate
            } else if (isBundledAndroid) {
              try {
                const extension = asset.type ? `.${asset.type}` : '.png'
                const cachePath = `${FileSystemLegacy.cacheDirectory}artwork_${asset.hash || 'unknown'}${extension}`
                console.log(
                  'BMverse: useTrackPlayer: Attempting to copy bundled asset:',
                  candidate,
                  'to',
                  cachePath,
                )

                // In production, we might need different URI formats to copy from resources
                const appPkg =
                  Constants.expoConfig?.android?.package || 'eu.bruu.bmverse2'
                const nameOnly = candidate.split('/').pop() || candidate
                const possibleUris = [
                  candidate,
                  `res:///drawable/${nameOnly}`,
                  `res:///${nameOnly}`,
                  `android.resource://${appPkg}/drawable/${nameOnly}`,
                  `android.resource://${appPkg}/${nameOnly}`,
                ]

                let success = false
                for (const fromUri of possibleUris) {
                  try {
                    console.log(
                      'BMverse: useTrackPlayer: Trying copy from',
                      fromUri,
                    )
                    await FileSystemLegacy.copyAsync({
                      from: fromUri,
                      to: cachePath,
                    })
                    success = true
                    console.log(
                      'BMverse: useTrackPlayer: Copy successful from',
                      fromUri,
                    )
                    break
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (err) {
                    // try next
                  }
                }

                if (success) {
                  url = cachePath
                } else {
                  console.warn(
                    'BMverse: useTrackPlayer: All copy attempts failed for',
                    candidate,
                  )
                }
              } catch (e) {
                console.warn(
                  'useTrackPlayer: Failed to process bundled asset',
                  e,
                )
              }
            }
          }
        }

        console.log('BMverse: useTrackPlayer: final url before fallback:', url)

        if (!url) {
          const asset = Asset.fromModule(IMAGES.cover200.notFound)
          await asset.downloadAsync()
          let candidate = asset.localUri || asset.uri

          // Fallback to Image.resolveAssetSource if candidate is not a valid URL
          if (!isValidUrl(candidate) && !candidate?.startsWith('/')) {
            try {
              const resolved = Image.resolveAssetSource(
                typeof IMAGES.cover200.notFound === 'number'
                  ? IMAGES.cover200.notFound
                  : { uri: IMAGES.cover200.notFound },
              )
              if (resolved && resolved.uri) {
                candidate = resolved.uri
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // ignore
            }
          }

          if (candidate) {
            if (candidate.startsWith('/') && !candidate.startsWith('file://')) {
              candidate = `file://${candidate}`
            }
            const isBundledAndroid =
              Platform.OS === 'android' &&
              (candidate.startsWith('asset://') ||
                candidate.startsWith('res://') ||
                candidate.startsWith('android.resource://') ||
                candidate.startsWith('file:///android_res/') ||
                candidate.startsWith('file:///android_asset/') ||
                (!candidate.includes('://') && !candidate.startsWith('/')))

            if (isValidUrl(candidate) && !isBundledAndroid) {
              url = candidate
            } else if (isBundledAndroid) {
              try {
                const extension = asset.type ? `.${asset.type}` : '.png'
                const cachePath = `${FileSystemLegacy.cacheDirectory}artwork_fallback_${asset.hash || 'unknown'}${extension}`

                const appPkg =
                  Constants.expoConfig?.android?.package || 'eu.bruu.bmverse2'
                const nameOnly = candidate.split('/').pop() || candidate
                const possibleUris = [
                  candidate,
                  `res:///drawable/${nameOnly}`,
                  `android.resource://${appPkg}/drawable/${nameOnly}`,
                ]

                for (const fromUri of possibleUris) {
                  try {
                    await FileSystemLegacy.copyAsync({
                      from: fromUri,
                      to: cachePath,
                    })
                    url = cachePath
                    break
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (err) {
                    // try next
                  }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                // ignore
              }
            }
          }
        }
        console.log('BMverse: useTrackPlayer: final resolved url:', url)
      } catch (e) {
        console.warn('useTrackPlayer: loadArtwork failed', e)
      }

      if (!isCancelled) {
        setResolvedArtworkUrl(url)
      }
    }

    void loadArtwork()
    return () => {
      isCancelled = true
    }
  }, [currentTrack])

  // Synchronize current track metadata to lock screen via proxy player
  useEffect(() => {
    if (!currentTrack || !proxyPlayer) return

    isReplacing.current = true

    // Load source into proxy player (muted) so it can be active for lock screen
    proxyPlayer.replace(currentTrack.audioUri)
    proxyPlayer.volume = 0

    // Resolve artwork URL for lock screen
    // We only set the metadata.
    // Note: Play/Pause on the lock screen will control this proxy player.
    // We relay those states back to the playlist in the next effect.
    // If resolvedArtworkUrl is undefined, we use a transparent pixel to clear the previous artwork on Android
    const artworkUrl =
      typeof resolvedArtworkUrl === 'string' &&
      isValidUrl(resolvedArtworkUrl) &&
      !resolvedArtworkUrl.startsWith('data:')
        ? resolvedArtworkUrl
        : TRANSPARENT_PIXEL_PATH

    console.log(
      'BMverse: useTrackPlayer: setting metadata artworkUrl:',
      artworkUrl,
    )
    try {
      proxyPlayer.setActiveForLockScreen(true, {
        title: currentTrack.title || currentTrack.origTitle || 'Unknown Title',
        artist:
          currentTrack.artist || currentTrack.origArtist || 'Unknown Artist',
        albumTitle:
          currentTrack.album || currentTrack.origAlbum || 'Unknown Album',
        artworkUrl: artworkUrl,
      })
    } catch (e) {
      console.warn('useTrackPlayer: setActiveForLockScreen failed', e)
    }

    // Initial sync of playing state after replacement
    if (status?.playing) {
      proxyPlayer.play()
    } else {
      proxyPlayer.pause()
    }
    lastStatusPlaying.current = status?.playing
    lastProxyPlaying.current = proxyStatus.playing

    // Reset isReplacing after a short delay to allow status to stabilize
    const timer = setTimeout(() => {
      isReplacing.current = false
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, proxyPlayer, resolvedArtworkUrl])

  // Synchronize playback state between real playlist and proxy player (lock screen)
  useEffect(() => {
    if (!proxyPlayer || !status) return

    const isPlaying = status.playing
    const isProxyPlaying = proxyStatus.playing

    if (isPlaying !== lastStatusPlaying.current) {
      // In-app change: Sync TO proxy
      if (isPlaying) {
        proxyPlayer.play()
      } else {
        proxyPlayer.pause()
      }
      lastStatusPlaying.current = isPlaying
      // We don't update lastProxyPlaying here to avoid the race condition loop.
      // It will be updated in the next cycles when isProxyPlaying matches isPlaying.
    } else if (isProxyPlaying !== lastProxyPlaying.current) {
      // Proxy state changed (lock screen interaction or sync finishing)

      // CRITICAL: We only sync back to the playlist if we are NOT in the middle of a track change.
      // A track change causes the proxy player to be replaced, which momentarily reports playing: false.
      if (isProxyPlaying !== isPlaying && !isReplacing.current) {
        // This is a real change from the lock screen controls
        if (isProxyPlaying) {
          playlist.play()
        } else {
          playlist.pause()
        }
        lastStatusPlaying.current = isProxyPlaying
      }
      lastProxyPlaying.current = isProxyPlaying
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.playing, proxyStatus.playing, proxyPlayer, playlist])

  // Synchronize external index -> Playlist index (Manual selection from lists)
  useEffect(() => {
    if (activeIndex !== lastSyncedIndex.current) {
      if (!status) return

      lastSyncedIndex.current = activeIndex
      if (playlist && activeIndex >= 0 && activeIndex < files.length) {
        if (status.currentIndex !== activeIndex) {
          playlist.skipTo(activeIndex)
        }
        playlist.play()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, playlist, files.length, status?.currentIndex])

  // Synchronize playlist index -> External index (Native auto-advance or native skip)
  useEffect(() => {
    if (
      status &&
      status.currentIndex !== activeIndex &&
      status.currentIndex !== -1 &&
      status.currentIndex !== lastSyncedIndex.current
    ) {
      lastSyncedIndex.current = status.currentIndex
      activeTrackIndex$.set(status.currentIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.currentIndex, activeIndex])

  const next = useCallback(() => {
    playlist.next()
  }, [playlist])

  const previous = useCallback(() => {
    playlist.previous()
  }, [playlist])

  // Auto-advance
  useEffect(() => {
    if (status?.didJustFinish) {
      if (status.currentIndex === files.length - 1) {
        onFinished?.()
      }
    }
  }, [status?.didJustFinish, status?.currentIndex, files.length, onFinished])

  const handlePlayPause = () => {
    if (status?.playing) {
      playlist.pause()
    } else {
      playlist.play()
    }
  }

  const seek = (time: number) => playlist.seekTo(time)

  return {
    player: playlist,
    status,
    currentTrack,
    handlePlayPause,
    next,
    previous,
    seek,
    isPlaying: status?.playing ?? false,
    progress:
      (status?.duration ?? 0) > 0
        ? (status?.currentTime ?? 0) / (status?.duration ?? 0)
        : 0,
    currentTime: status?.currentTime ?? 0,
    duration: status?.duration ?? 0,
  }
}
