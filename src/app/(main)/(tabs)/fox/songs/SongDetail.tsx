import { observable } from '@legendapp/state'
import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppInfoRow } from '@/components/AppInfoRow'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppMarkdown } from '@/components/AppMarkdown'
import { AppPictureCarousel } from '@/components/AppPictureCarousel'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { MoaSpeaks, MomoSpeaks, SuSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT } from '@/constants/constants'
import {
  songItem$,
  songPerformanceStats$,
  videosBySong$,
} from '@/services/legend'

type LyricsType = 'jp' | 'rom' | 'en'
const activeTab$ = observable<LyricsType>('jp')

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()

  const detail = useValue(songItem$(id ?? ''))
  const activeTab = useValue(activeTab$)
  const videos = useValue(videosBySong$(detail?.song_title ?? ''))
  const stats = useValue(songPerformanceStats$(detail?.song_title ?? '')) || {
    totalLivePlays: '0',
    firstPerformed: 'N/A',
    firstPerformedIn: 'N/A',
    lastPerformed: 'N/A',
    lastPerformedIn: 'N/A',
  }

  useEffect(() => {
    activeTab$.set('jp')
  }, [id])

  const { lyrics, focusColor } = useMemo(() => {
    if (!detail) {
      return { lyrics: '', focusColor: COLORS.PRIMARY }
    }
    switch (activeTab) {
      case 'rom':
        return { lyrics: detail?.song_lyrics_rom, focusColor: COLORS.SECONDARY }
      case 'en':
        return { lyrics: detail?.song_lyrics_en, focusColor: COLORS.TEXT }
      case 'jp':
      default:
        return { lyrics: detail?.song_lyrics_jp, focusColor: COLORS.PRIMARY }
    }
  }, [activeTab, detail])

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
      <View style={styles.characterSpeakBox}>
        <SuSpeaks markup={'Do you want to hear a preview?'} />
      </View>
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{'Info:'}</AppText>
        <AppMarkdown
          markup={
            detail?.song_info ??
            'Work in progress. Join the [discord channel](https://discord.gg/69wxecseRw)'
          }
        />
      </AppBox>
      {!!detail?.song_lyrics_jp && (
        <>
          <View style={styles.tabsContainer}>
            <Pressable
              onPress={() => activeTab$.set('jp')}
              style={[
                styles.tabItem,
                activeTab === 'jp'
                  ? { borderBottomColor: COLORS.PRIMARY }
                  : styles.tabInactive,
              ]}
            >
              <AppText
                fontSize={FONT.SIZE.XS}
                style={[
                  styles.tabText,
                  activeTab === 'jp' && { color: COLORS.PRIMARY },
                ]}
              >
                {'ORIGINAL'}
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => activeTab$.set('rom')}
              style={[
                styles.tabItem,
                activeTab === 'rom'
                  ? { borderBottomColor: COLORS.SECONDARY }
                  : styles.tabInactive,
              ]}
            >
              <AppText
                fontSize={FONT.SIZE.XS}
                style={[
                  styles.tabText,
                  activeTab === 'rom' && { color: COLORS.SECONDARY },
                ]}
              >
                {'ROMAJI'}
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => activeTab$.set('en')}
              style={[
                styles.tabItem,
                activeTab === 'en'
                  ? { borderBottomColor: COLORS.TEXT }
                  : styles.tabInactive,
              ]}
            >
              <AppText
                fontSize={FONT.SIZE.XS}
                style={[
                  styles.tabText,
                  activeTab === 'en' && { color: COLORS.TEXT },
                ]}
              >
                {'ENGLISH'}
              </AppText>
            </Pressable>
          </View>

          <AppText
            fontSize={FONT.SIZE.SM}
            style={[styles.songLyrics, { color: focusColor }]}
          >
            {lyrics}
          </AppText>
        </>
      )}
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
  songLyrics: {
    paddingTop: 16,
    textAlign: 'center',
  },
  songTitle_jp: {
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
  tabInactive: {
    borderBottomColor: COLORS.BG_GREY,
  },
  tabItem: {
    alignItems: 'center',
    borderBottomWidth: 2,
    flex: 1,
    paddingVertical: 12,
  },
  tabText: {
    color: COLORS.BG_GREY,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
})
