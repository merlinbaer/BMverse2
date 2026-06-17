import { useObservable } from '@legendapp/state/react'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import SongAudioWave from '@/components/SongAudioWave'
import { SongTimerCircle } from '@/components/SongTimerCircle'
import { COLORS, FONT } from '@/constants/constants'
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer'
import { processLooseGame, processWinGame } from '@/services/games'
import {
  activePreviewSong$,
  getRandomSongPreviews,
  songQuiz$,
} from '@/services/legend'
import { isPWA } from '@/services/pwa'
import { ListItemType } from '@/types/list'
import { PreviewSong } from '@/types/player'

const bottomWave = 120

export default function GuessItScreen() {
  const { top } = useSafeAreaInsets()
  const dynamicMarginTop = isPWA()
    ? 40 + top
    : Platform.select({
        ios: -50,
        android: 50,
        default: 40,
      })

  const { isPlaying, previewSong, currentTime, duration } = usePreviewPlayer(
    () => {
      songQuiz$.set('TIMEOUT')
      processLooseGame('TIMEOUT')
      router.back()
    },
  )
  // Handle accidental exits (back button, swipe, etc.)
  useEffect(() => {
    return () => {
      if (songQuiz$.peek() === 'GIVEUP') {
        processLooseGame('GIVEUP')
      }
    }
  }, [])

  // game$ consists of game$.winner and game$.options
  const game$ = useObservable<{
    winner: PreviewSong
    options: ListItemType[]
  } | null>(() => getRandomSongPreviews())

  // Synchronize the global audio state with the generated winner
  useEffect(() => {
    const winner = game$.winner.peek()
    if (winner) {
      activePreviewSong$.set({
        ...winner,
        song_title: '???',
        song_artist: '???',
        song_preview_artwork: null,
      })
    }
    return () => activePreviewSong$.set(null)
  }, [game$.winner])

  const momoMessage = isPlaying
    ? 'Listen carefully... do you know this one?'
    : "One moment, I'm preparing the song for you..."

  return (
    <AppScreen>
      <View style={[styles.container, { marginTop: dynamicMarginTop }]}>
        <MomoSpeaks markup={momoMessage} imageSize={80} />
        <View style={styles.visualizerRow}>
          {/* Left Column: Visualizer + Link */}
          <View style={styles.visualizerColumn}>
            <SongAudioWave width={240} height={bottomWave} />
            <View style={styles.hyperlinkWrapper}>
              <AppHyperlink
                description={'provided courtesy of iTunes'}
                hyperlink={
                  previewSong?.song_preview_uri ??
                  'https://www.apple.com/itunes/'
                }
                type={'extern'}
                size={FONT.SIZE.XS}
                color={COLORS.SECONDARY}
              />
            </View>
          </View>
          <View style={styles.timerContainer}>
            <SongTimerCircle
              size={60}
              currentTime={currentTime}
              duration={duration || 30}
            />
          </View>
        </View>
      </View>
      <View style={styles.listHeaderContainer}>
        <AppText
          fontSize={FONT.SIZE.LG}
          style={{ color: COLORS.PRIMARY, fontWeight: '800' }}
        >
          {'Select a Song:'}
        </AppText>
      </View>
      <AppFlatList
        data={game$.options.get() ?? []}
        displayIconAsText={true}
        pressAction={{
          type: 'none',
        }}
        onPressItem={item => {
          const outcome = item.value === 'WIN' ? 'WIN' : 'LOOSE'
          songQuiz$.set(outcome)
          if (outcome === 'WIN') {
            processWinGame()
          } else {
            processLooseGame('LOOSE')
          }
          router.back()
        }}
      />
      <View style={styles.giveUpContainer}>
        <AppButton title="Give Up" onPress={() => router.back()} />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  giveUpContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  hyperlinkWrapper: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  listHeaderContainer: {
    marginTop: 20,
  },
  timerContainer: {
    height: bottomWave,
    justifyContent: 'flex-end',
  },
  visualizerColumn: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  visualizerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 24,
    paddingLeft: 0,
    paddingRight: 12,
    width: '100%',
  },
})
