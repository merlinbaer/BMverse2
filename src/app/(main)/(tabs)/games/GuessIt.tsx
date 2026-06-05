import { useObservable } from '@legendapp/state/react'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import AudioWaveVisualizer from '@/components/AudioWave'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { SongTimerCircle } from '@/components/SongTimerCircle'
import { COLORS, FONT } from '@/constants/constants'
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer'
import {
  activePreviewSong$,
  getRandomSongPreviews,
  songQuiz$,
} from '@/services/legend'
import { ListItemType } from '@/types/list'
import { PreviewSong } from '@/types/player'

const bottomWave = 120

export default function GuessItScreen() {
  const { isPlaying, previewSong, currentTime, duration } = usePreviewPlayer(
    () => {
      router.back()
    },
  )

  // game$ consists game$.winner and game$.options
  const game$ = useObservable<{
    winner: PreviewSong
    options: ListItemType[]
  } | null>(() => getRandomSongPreviews())

  // 2. Synchronize the global audio state with the generated winner
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
    : 'One moment...'

  return (
    <AppScreen>
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} imageSize={80} />
        <View style={styles.visualizerRow}>
          {/* Left Column: Visualizer + Link */}
          <View style={styles.visualizerColumn}>
            <AudioWaveVisualizer width={240} height={bottomWave} />
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
          type: 'set-observable-back',
          observable: songQuiz$,
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
    marginTop: Platform.select({
      ios: -50,
      android: 50,
      default: 40,
    }),
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
