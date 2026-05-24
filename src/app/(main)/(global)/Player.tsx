import { useValue } from '@legendapp/state/react'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native'

import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { activePreviewSong$ } from '@/types/player'

type PlayerStatus = ReturnType<typeof useAudioPlayerStatus>

function AutoDismissHandler({
  status,
  dismiss,
}: {
  status: PlayerStatus
  dismiss: () => void
}) {
  useEffect(() => {
    if (status?.didJustFinish) {
      dismiss()
    }
  }, [status, dismiss])

  return null
}

export default function PlayerScreen() {
  const previewSong = useValue(activePreviewSong$)

  const player = useAudioPlayer({ uri: previewSong?.song_preview ?? '' })
  const status = useAudioPlayerStatus(player)

  useEffect(() => {
    if (player && previewSong?.song_preview) {
      player.play()
      const isExpoGo =
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient
      if (Platform.OS === 'android' && !isExpoGo) {
        try {
          console.log(Platform.OS, isExpoGo)
          player.setActiveForLockScreen(true, {
            title: previewSong.song_title ?? 'Unknown Song',
            artist: previewSong.song_artist ?? 'Unknown Artist',
            artworkUrl: previewSong.song_preview_artwork ?? undefined,
          })
        } catch (e) {
          console.warn('Player: Service binding for lock screen failed', e)
        }
      }
    }
  }, [player, previewSong])

  const duration = status?.duration || 0
  const currentTime = status?.currentTime || 0
  const progress = duration > 0 ? currentTime / duration : 0

  const formatTime = (ms: number) => {
    if (!ms || isNaN(ms)) return '0:00'
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handlePlayPause = () => {
    if (status?.playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const skipBackward = () => {
    const newPos = Math.max(0, currentTime - 5000)
    void player.seekTo(newPos)
  }

  const skipForward = () => {
    const newPos = Math.min(duration, currentTime + 5000)
    void player.seekTo(newPos)
  }

  const handleOpenExternal = async () => {
    if (previewSong?.song_preview_uri) {
      await WebBrowser.openBrowserAsync(previewSong.song_preview_uri)
    }
  }

  return (
    <AppModalScreen>
      {dismiss => (
        <View style={styles.container}>
          <AutoDismissHandler status={status} dismiss={dismiss} />
          <AppText fontSize={FONT.SIZE.LG} style={styles.header}>
            {'Preview Player'}
          </AppText>

          <View style={styles.artworkContainer}>
            {previewSong?.song_preview_artwork ? (
              <Image
                source={{ uri: previewSong.song_preview_artwork }}
                style={styles.artwork}
              />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <MaterialIcons
                  name="music-note"
                  size={80}
                  color={COLORS.PRIMARY}
                />
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <AppText fontSize={FONT.SIZE.LG} style={styles.songTitle}>
              {previewSong?.song_title || 'Unknown Song'}
            </AppText>
            <AppText fontSize={FONT.SIZE.SM} style={styles.songArtist}>
              {previewSong?.song_artist || 'Unknown Artist'}
            </AppText>
          </View>

          {previewSong?.song_preview ? (
            <View style={styles.playerControlsWrapper}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.timeRow}>
                  <AppText fontSize={FONT.SIZE.XS} style={styles.timeText}>
                    {formatTime(currentTime)}
                  </AppText>
                  <AppText fontSize={FONT.SIZE.XS} style={styles.timeText}>
                    {formatTime(duration)}
                  </AppText>
                </View>
              </View>

              <View style={styles.controlsRow}>
                <Pressable onPress={skipBackward} style={styles.skipButton}>
                  <MaterialIcons
                    name="replay-5"
                    size={32}
                    color={COLORS.TEXT}
                  />
                </Pressable>

                <Pressable onPress={handlePlayPause} style={styles.playButton}>
                  <MaterialIcons
                    name={status?.playing ? 'pause' : 'play-arrow'}
                    size={40}
                    color={COLORS.TEXT}
                  />
                </Pressable>

                <Pressable onPress={skipForward} style={styles.skipButton}>
                  <MaterialIcons
                    name="forward-5"
                    size={32}
                    color={COLORS.TEXT}
                  />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.fallbackContainer}>
              <AppText fontSize={FONT.SIZE.SM} style={styles.fallbackText}>
                {'No audio preview available for this track.'}
              </AppText>
            </View>
          )}

          {previewSong?.song_preview_uri && (
            <Pressable
              onPress={handleOpenExternal}
              style={styles.externalLinkButton}
            >
              <MaterialIcons name="open-in-new" size={18} color={COLORS.TEXT} />
              <AppText fontSize={FONT.SIZE.XS} style={styles.externalLinkText}>
                {'provided courtesy of iTunes'}
              </AppText>
            </Pressable>
          )}
        </View>
      )}
    </AppModalScreen>
  )
}

const styles = StyleSheet.create({
  artwork: {
    borderRadius: 8,
    height: 180,
    width: 180,
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 8,
    height: 180,
    justifyContent: 'center',
    width: 180,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  externalLinkButton: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  externalLinkText: {
    fontWeight: 'bold',
  },
  fallbackContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  fallbackText: {
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
  header: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    marginHorizontal: 24,
    width: 70,
  },
  playerControlsWrapper: {
    width: '100%',
  },
  progressBarBg: {
    backgroundColor: COLORS.MAXIMUM_TRACK_TINT_COLOR,
    borderRadius: 3,
    height: 6,
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
    height: '100%',
  },
  progressContainer: {
    marginTop: 10,
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  songArtist: {
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
    textAlign: 'center',
  },
  songTitle: {
    color: COLORS.TEXT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: COLORS.TEXT_MUTED,
  },
})
