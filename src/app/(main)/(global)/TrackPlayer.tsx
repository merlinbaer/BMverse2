import { Image } from 'expo-image'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { useTrackPlayer } from '@/hooks/useTrackPlayer'
import { formatAudioTime } from '@/services/dateTimeHelper'

const GRADIENT_COLORS = ['rgba(95, 10, 6, 0.9)', 'rgba(0, 0, 0, 0.9)']

export default function TrackPlayerScreen() {
  return (
    <AppModalScreen gradientColors={GRADIENT_COLORS}>
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
      <View style={styles.artworkContainer}>
        <Image
          source={currentTrack.appCoverUri || IMAGES.cover200.notFound}
          contentFit="fill"
          style={styles.artwork}
        />
      </View>

      <View style={styles.infoContainer}>
        <AppText
          fontSize={FONT.SIZE.LG}
          style={styles.songTitle}
          numberOfLines={1}
        >
          {currentTrack?.title || currentTrack?.origTitle || 'Unknown track'}
        </AppText>
        <AppText fontSize={FONT.SIZE.SM} style={styles.songAlbum}>
          {currentTrack?.album || currentTrack?.origAlbum || 'Unknown Album'}
        </AppText>
        <AppText fontSize={FONT.SIZE.XS} style={styles.songArtist}>
          {currentTrack?.artist || currentTrack?.origArtist || 'Unknown Artist'}
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
  artwork: {
    borderRadius: 8,
    height: 180,
    width: 180,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 48,
    paddingHorizontal: 20,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 50,
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
    marginBottom: 40,
    width: '100%',
  },
  skipButton: {
    padding: 10,
  },
  songAlbum: {
    color: COLORS.TEXT,
    fontWeight: 'condensed',
    marginTop: 8,
  },
  songArtist: {
    color: COLORS.SECONDARY,
    marginTop: 8,
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
