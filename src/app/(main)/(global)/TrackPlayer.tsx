import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ColorValue,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

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
    <AppModalScreen gradientColors={gradientColors}>
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
    seek,
    isPlaying,
    progress: playerProgress,
    currentTime: playerCurrentTime,
    duration,
  } = useTrackPlayer(dismiss)

  const coverFiles = useValue(coverFiles$)

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekProgress, setSeekProgress] = useState(0)

  const progressBarWidthRef = useRef(0)
  const durationRef = useRef(duration)
  const seekRef = useRef(seek)
  const initialLocationX = useRef(0)

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

  useEffect(() => {
    seekRef.current = seek
  }, [seek])

  const progress = isSeeking ? seekProgress : playerProgress
  const currentTime = isSeeking ? seekProgress * duration : playerCurrentTime

  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(
    null,
  )

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: evt => {
          setIsSeeking(true)
          const x = evt.nativeEvent.locationX
          initialLocationX.current = x
          if (progressBarWidthRef.current > 0) {
            const newProgress = Math.max(
              0,
              Math.min(1, x / progressBarWidthRef.current),
            )
            setSeekProgress(newProgress)
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          if (progressBarWidthRef.current > 0) {
            const x = initialLocationX.current + gestureState.dx
            const newProgress = Math.max(
              0,
              Math.min(1, x / progressBarWidthRef.current),
            )
            setSeekProgress(newProgress)
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (progressBarWidthRef.current > 0) {
            const x = initialLocationX.current + gestureState.dx
            const newProgress = Math.max(
              0,
              Math.min(1, x / progressBarWidthRef.current),
            )
            seekRef.current(newProgress * durationRef.current)
          }
          setIsSeeking(false)
        },
        onPanResponderTerminate: () => {
          setIsSeeking(false)
        },
        onPanResponderTerminationRequest: () => false,
      }),
    )
  }, [])

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

      <View
        style={styles.progressContainer}
        {...(panResponder?.panHandlers || {})}
        onLayout={e => {
          progressBarWidthRef.current = e.nativeEvent.layout.width
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
