import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import React, { useEffect, useMemo, useState } from 'react'
import { ColorValue, Pressable, StyleSheet, View } from 'react-native'
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler'

import { AppModalScreen } from '@/components/AppModalScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { useTrackPlayer } from '@/hooks/useTrackPlayer'
import { formatAudioTime } from '@/services/dateTimeHelper'
import { coverFiles$ } from '@/services/legend/local/player'
import { currentPlayerDominantColor$ } from '@/services/legend/memory/variables'

export default function TrackPlayerScreen() {
  const dominantColor = useValue(currentPlayerDominantColor$)

  const gradientColors = useMemo(():
    readonly [ColorValue, ColorValue, ...ColorValue[]] | undefined => {
    if (dominantColor) {
      return [dominantColor, COLORS.MODAL_GRADIENT_BOTTOM] as const
    }
    return undefined
  }, [dominantColor])

  return (
    <AppModalScreen gradientColors={gradientColors} isFullWidth={true}>
      {dismiss => <TrackContent dismiss={dismiss} />}
    </AppModalScreen>
  )
}

function TrackContent({ dismiss }: { dismiss: () => void }) {
  const {
    currentTrack,
    tracksCount,
    handlePlayPause,
    next,
    previous,
    seek,
    shuffle,
    isLooping,
    toggleLoop,
    isPlaying,
    progress: playerProgress,
    currentTime: playerCurrentTime,
    duration,
  } = useTrackPlayer(dismiss)

  const coverFiles = useValue(coverFiles$)

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekProgress, setSeekProgress] = useState(0)
  const [progressBarWidth, setProgressBarWidth] = useState(0)

  const progress = isSeeking ? seekProgress : playerProgress
  const currentTime = isSeeking ? seekProgress * duration : playerCurrentTime

  const tapGesture = useTapGesture({
    runOnJS: true,
    maxDuration: 500,
    onBegin: e => {
      setIsSeeking(true)
      if (progressBarWidth > 0) {
        const newProgress = Math.max(0, Math.min(1, e.x / progressBarWidth))
        setSeekProgress(newProgress)
      }
    },
    onDeactivate: e => {
      if (progressBarWidth > 0) {
        const newProgress = Math.max(0, Math.min(1, e.x / progressBarWidth))
        seek(newProgress * duration)
      }
      setIsSeeking(false)
    },
    onFinalize: () => {
      setIsSeeking(false)
    },
  })

  const panGesture = usePanGesture({
    runOnJS: true,
    minDistance: 0,
    onBegin: e => {
      setIsSeeking(true)
      if (progressBarWidth > 0) {
        const newProgress = Math.max(0, Math.min(1, e.x / progressBarWidth))
        setSeekProgress(newProgress)
      }
    },
    onUpdate: e => {
      if (progressBarWidth > 0) {
        const newProgress = Math.max(0, Math.min(1, e.x / progressBarWidth))
        setSeekProgress(newProgress)
      }
    },
    onDeactivate: e => {
      if (progressBarWidth > 0) {
        const newProgress = Math.max(0, Math.min(1, e.x / progressBarWidth))
        seek(newProgress * duration)
      }
      setIsSeeking(false)
    },
    onFinalize: () => {
      setIsSeeking(false)
    },
  })

  const scrubGesture = useCompetingGestures(panGesture, tapGesture)

  useEffect(() => {
    if (currentTrack?.appCoverUri) {
      const coverFile = coverFiles.find(
        f => f.coverUri === currentTrack.appCoverUri,
      )
      if (coverFile?.dominantColor) {
        currentPlayerDominantColor$.set(coverFile.dominantColor)
      } else {
        currentPlayerDominantColor$.set(null)
      }
    } else {
      currentPlayerDominantColor$.set(null)
    }

    return () => {
      currentPlayerDominantColor$.set(null)
    }
  }, [currentTrack, coverFiles])

  return (
    <View style={styles.container}>
      <View style={styles.artworkContainer}>
        <Image
          source={currentTrack?.appCoverUri || IMAGES.cover200.notFound}
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

      <GestureDetector gesture={scrubGesture}>
        <View
          style={styles.progressContainer}
          onLayout={e => {
            setProgressBarWidth(e.nativeEvent.layout.width)
          }}
        >
          <View style={styles.progressBarBg} pointerEvents="none">
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
            <View
              style={[styles.progressHandle, { left: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.timeRow} pointerEvents="none">
            <AppText fontSize={FONT.SIZE.XS} style={styles.timeText}>
              {formatAudioTime(currentTime)}
            </AppText>
            <AppText fontSize={FONT.SIZE.XS} style={styles.timeText}>
              {`-${formatAudioTime(duration - currentTime)}`}
            </AppText>
          </View>
        </View>
      </GestureDetector>

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

      <View
        style={[
          styles.secondaryControlsRow,
          tracksCount < 3 && styles.secondaryControlsRowCentered,
        ]}
      >
        {tracksCount >= 3 && (
          <Pressable onPress={shuffle} style={styles.controlIconButton}>
            <IMAGES.vector.MaterialIcons
              name="shuffle"
              size={28}
              color={COLORS.TEXT}
            />
          </Pressable>
        )}

        <Pressable onPress={toggleLoop} style={styles.controlIconButton}>
          <IMAGES.vector.MaterialIcons
            name="repeat"
            size={28}
            color={isLooping ? COLORS.PRIMARY : COLORS.TEXT_MUTED}
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
  controlIconButton: {
    padding: 8,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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
    paddingVertical: 10,
    width: '100%',
  },
  progressHandle: {
    backgroundColor: COLORS.TEXT,
    borderRadius: 6,
    height: 12,
    marginLeft: -6,
    marginTop: -3,
    position: 'absolute',
    width: 12,
  },
  secondaryControlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 32,
    width: '100%',
  },
  secondaryControlsRowCentered: {
    justifyContent: 'center',
    paddingHorizontal: 0,
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
