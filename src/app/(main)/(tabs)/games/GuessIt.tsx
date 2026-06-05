import { useObservable } from '@legendapp/state/react'
import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { AppFlatList } from '@/components/AppFlatList'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import AudioWaveVisualizer from '@/components/AudioWave'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT } from '@/constants/constants'
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer'
import {
  activePreviewSong$,
  getRandomSongPreviews,
  songQuiz$,
} from '@/services/legend'
import { ListItemType } from '@/types/list'
import { PreviewSong } from '@/types/player'

export default function GuessItScreen() {
  const { isPlaying, previewSong } = usePreviewPlayer()
  const isp = true

  // We use the property access game$.winner or game$.options later.
  const game$ = useObservable<{
    winner: PreviewSong
    options: ListItemType[]
  } | null>(() => getRandomSongPreviews())

  // 2. Synchronize the global audio state with the generated winner
  useEffect(() => {
    const winner = game$.winner.peek() // Use peek() for one-time initialization
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
    : 'Please select the right song.'

  return (
    <AppScreen>
      {isp && (
        <>
          <View style={styles.container}>
            <MomoSpeaks markup={momoMessage} imageSize={80} />
            <View style={styles.visualizerRow}>
              {/* Left Column: Visualizer + Link */}
              <View style={styles.visualizerColumn}>
                <AudioWaveVisualizer width={250} height={100} />
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

              {/* Right Column: Mystery Text */}
              <AppText fontSize={FONT.SIZE.LG} style={styles.mysteryText}>
                {'XXX'}
              </AppText>
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
            data={game$.options.get() ?? []} // Correct property access
            displayIconAsText={true}
            pressAction={{
              type: 'set-observable-back',
              observable: songQuiz$,
            }}
          />
        </>
      )}
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
  hyperlinkWrapper: {
    alignItems: 'center',
    marginTop: 8,
    width: 200, // Match visualizer width to ensure true center
  },
  listHeaderContainer: {
    marginTop: 16,
  },
  mysteryText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
  visualizerColumn: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  visualizerRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 12,
    width: '100%',
  },
})
