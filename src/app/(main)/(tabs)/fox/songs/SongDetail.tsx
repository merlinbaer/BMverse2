import { useValue } from '@legendapp/state/react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppInfoRow } from '@/components/AppInfoRow'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppMarkdown } from '@/components/AppMarkdown'
import { AppPictureCarousel } from '@/components/AppPictureCarousel'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { MoaSpeaks, MomoSpeaks, SuSpeaks } from '@/components/CharacterSpeaks'
import { SongLyrics } from '@/components/SongLyrics'
import { COLORS, FONT } from '@/constants/constants'
import {
  activePreviewSong$,
  songItem$,
  songPerformanceStats$,
  videosBySong$,
} from '@/services/legend'

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()

  const detail = useValue(songItem$(id ?? ''))
  const videos = useValue(videosBySong$(detail?.song_title ?? ''))
  const stats = useValue(songPerformanceStats$(detail?.song_title ?? '')) || {
    totalLivePlays: '0',
    firstPerformed: 'N/A',
    firstPerformedIn: 'N/A',
    lastPerformed: 'N/A',
    lastPerformedIn: 'N/A',
  }

  const playPreview = () => {
    activePreviewSong$.set({
      song_preview: detail?.song_preview ?? null,
      song_title: detail?.song_title ?? null,
      song_artist: detail?.song_artist ?? null,
      song_preview_artwork: detail?.song_preview_artwork ?? null,
      song_preview_uri: detail?.song_preview_uri ?? null,
    })
    router.push('/Player')
  }

  if (!id || !detail)
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'Song Details' }} />
        <AppLoadScreen message="Song not found" />
      </AppScreen>
    )

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Song Details' }} />
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG} style={styles.appTextCenter}>
          {detail?.song_title}
        </AppText>
        <AppText fontSize={FONT.SIZE.BASE} style={styles.songTitle_jp}>
          {detail?.song_title_jp}
        </AppText>
        <AppText fontSize={FONT.SIZE.XS} style={styles.appTextCenter}>
          {detail?.song_artist}
        </AppText>
      </AppBox>
      {detail?.song_preview && detail.song_preview.trim().length > 0 && (
        <Pressable
          onPress={() => playPreview()}
          style={styles.characterSpeakBox}
        >
          <SuSpeaks markup={'Do you want to hear a preview?'} />
        </Pressable>
      )}
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{'Info:'}</AppText>
        <AppMarkdown
          markup={
            detail?.song_info ??
            'Work in progress. Join the [discord channel](https://discord.gg/69wxecseRw)'
          }
        />
      </AppBox>
      <SongLyrics detail={detail} />
      {videos && videos.length > 0 && (
        <>
          <View style={styles.characterSpeakBox}>
            <MoaSpeaks markup={'Want to see us?'} />
          </View>
          <AppBox>
            <View style={styles.carouselWrapper}>
              <AppPictureCarousel data={videos} />
            </View>
          </AppBox>
        </>
      )}
      <View style={styles.characterSpeakBox}>
        <MomoSpeaks markup={'Stats from our concerts'} />
      </View>
      <AppBox>
        <AppInfoRow label="TOTAL LIVE Plays:" value={stats.totalLivePlays} />
        <AppInfoRow label="FIRST PERFORMED:" value={stats.firstPerformed} />
        <AppInfoRow
          label="FIRST PERFORMED IN:"
          value={stats.firstPerformedIn}
        />
        <AppInfoRow label="LAST PERFORMED:" value={stats.lastPerformed} />
        <AppInfoRow label="LAST PERFORMED IN:" value={stats.lastPerformedIn} />
      </AppBox>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  appTextCenter: {
    textAlign: 'center',
  },
  carouselWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
  },
  characterSpeakBox: {
    paddingVertical: 12,
  },
  songTitle_jp: {
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
})
