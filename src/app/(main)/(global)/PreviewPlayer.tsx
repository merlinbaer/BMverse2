import MaterialIcons from '@react-native-vector-icons/material-icons'
import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'

import { AppHyperlink } from '@/components/AppHyperlink'
import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer'
import { formatAudioTime } from '@/services/dateTimeHelper'

export default function PreviewPlayerScreen() {
  return (
    <AppModalScreen>
      {dismiss => <PlayerContent dismiss={dismiss} />}
    </AppModalScreen>
  )
}

function PlayerContent({ dismiss }: { dismiss: () => void }) {
  const {
    previewSong,
    handlePlayPause,
    skipBackward,
    skipForward,
    duration,
    currentTime,
    progress,
    isPlaying,
  } = usePreviewPlayer(dismiss) // Pass dismiss as the onFinished callback

  return (
    <View style={styles.container}>
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
            <MaterialIcons name="music-note" size={80} color={COLORS.PRIMARY} />
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
                {formatAudioTime(currentTime)}
              </AppText>
              <AppText fontSize={FONT.SIZE.XS} style={styles.timeText}>
                {formatAudioTime(duration)}
              </AppText>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => skipBackward(5)}
              style={styles.skipButton}
            >
              <MaterialIcons name="replay-5" size={32} color={COLORS.TEXT} />
            </Pressable>

            <Pressable onPress={handlePlayPause} style={styles.playButton}>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={40}
                color={COLORS.TEXT}
              />
            </Pressable>

            <Pressable onPress={() => skipForward(5)} style={styles.skipButton}>
              <MaterialIcons name="forward-5" size={32} color={COLORS.TEXT} />
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
        <AppHyperlink
          description="provided courtesy of iTunes"
          hyperlink={previewSong.song_preview_uri}
          type="extern"
          size={FONT.SIZE.XS}
        />
      )}
    </View>
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
    marginVertical: 20,
    width: '100%',
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
