import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppHyperlink } from '@/components/AppHyperlink'
import { AppScreen } from '@/components/AppScreen'
import AudioWaveVisualizer from '@/components/AudioWave'
import { MomoSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT } from '@/constants/constants'
import { usePreviewPlayer } from '@/hooks/usePreviewPlayer'
import {
  activePreviewSong$,
  getRandomSongPreview,
  songQuiz$,
} from '@/services/legend'

export default function GuessItScreen() {
  const { isPlaying, previewSong } = usePreviewPlayer()

  // Initialize a random song on mount
  useEffect(() => {
    const song = getRandomSongPreview()
    if (song) {
      activePreviewSong$.set({
        song_preview: song.song_preview,
        song_preview_uri: song.song_preview_uri,
        song_title: 'Unknown Song', // Hide title during game
        song_artist: 'Unknown Artist', // Hide artist during game
        song_preview_artwork: null, // Hide artwork during game
      })
    }
    // Clear on unmount so audio stops when leaving
    return () => activePreviewSong$.set(null)
  }, [])

  const handleLoose = () => {
    songQuiz$.set('LOOSE')
    router.back()
  }

  const handleWin = () => {
    songQuiz$.set('WIN')
    router.back()
  }

  const momoMessage = isPlaying
    ? 'Listen carefully... do you know this one?'
    : 'Please select the right song.'

  return (
    <AppScreen>
      <View style={styles.container}>
        <MomoSpeaks markup={momoMessage} imageSize={80} />
        {isPlaying && (
          <>
            <View style={styles.visualizerContainer}>
              <AudioWaveVisualizer width={240} height={140} />
            </View>
            <AppHyperlink
              description={'provided courtesy of iTunes'}
              hyperlink={
                previewSong?.song_preview_uri ?? 'https://www.apple.com/itunes/'
              }
              type={'extern'}
              size={FONT.SIZE.XS}
              color={COLORS.SECONDARY}
            />
          </>
        )}
        <AppButton
          title={'Leave & Loose'}
          onPress={() => handleLoose()}
        ></AppButton>
        <AppButton title={'You Won'} onPress={() => handleWin()}></AppButton>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  visualizerContainer: {
    marginBottom: 4,
    marginTop: 16,
    paddingHorizontal: 12,
  },
})
