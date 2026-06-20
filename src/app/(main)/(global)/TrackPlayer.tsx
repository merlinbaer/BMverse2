import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { useTrackPlayer } from '@/hooks/useTrackPlayer'
import { formatAudioTime } from '@/services/dateTimeHelper'

export default function TrackPlayerScreen() {
  return (
    <AppModalScreen>
      {dismiss => <TrackContent dismiss={dismiss} />}
    </AppModalScreen>
  )
}

function TrackContent({ dismiss }: { dismiss: () => void }) {
  const {
    currentTrack,
    handlePlayPause,
    next,
    previous,
    isPlaying,
    progress,
    currentTime,
    duration,
  } = useTrackPlayer(dismiss)

  return (
    <View style={styles.container}>
      <AppText fontSize={FONT.SIZE.LG} style={styles.header}>
        {'Track Player'}
      </AppText>

      <View style={styles.artworkPlaceholder}>
        <IMAGES.vector.MaterialIcons
          name="library-music"
          size={80}
          color={COLORS.PRIMARY}
        />
      </View>

      <View style={styles.infoContainer}>
        <AppText
          fontSize={FONT.SIZE.LG}
          style={styles.songTitle}
          numberOfLines={1}
        >
          {currentTrack?.originalName || 'No track selected'}
        </AppText>
        <AppText fontSize={FONT.SIZE.SM} style={styles.songArtist}>
          {'Local Library'}
        </AppText>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
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
        <Pressable onPress={previous} style={styles.skipButton}>
          <IMAGES.vector.MaterialIcons
            name="skip-previous"
            size={40}
            color={COLORS.TEXT}
          />
        </Pressable>

        <Pressable onPress={handlePlayPause} style={styles.playButton}>
          <IMAGES.vector.MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={40}
            color={COLORS.TEXT}
          />
        </Pressable>

        <Pressable onPress={next} style={styles.skipButton}>
          <IMAGES.vector.MaterialIcons
            name="skip-next"
            size={40}
            color={COLORS.TEXT}
          />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  artworkPlaceholder: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 8,
    height: 180,
    justifyContent: 'center',
    marginVertical: 20,
    width: 180,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    marginHorizontal: 30,
    width: 70,
  },
  progressBarBg: {
    backgroundColor: COLORS.MAXIMUM_TRACK_TINT_COLOR,
    borderRadius: 3,
    height: 6,
  },
  progressBarFill: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
    height: '100%',
  },
  progressContainer: {
    marginBottom: 20,
    width: '100%',
  },
  skipButton: {
    padding: 10,
  },
  songArtist: {
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
  },
  songTitle: {
    color: COLORS.TEXT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: COLORS.TEXT_MUTED,
  },
})
