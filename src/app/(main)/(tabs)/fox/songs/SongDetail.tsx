import { observable } from '@legendapp/state'
import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppMarkdown } from '@/components/AppMarkdown'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { MoaSpeaks, MomoSpeaks, SuSpeaks } from '@/components/CharacterSpeaks'
import { COLORS, FONT } from '@/constants/constants'
import { songItem$ } from '@/services/legend'

type LyricsType = 'jp' | 'rom' | 'en'
const activeTab$ = observable<LyricsType>('jp')

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const detail = useValue(songItem$(id))
  const activeTab = useValue(activeTab$)

  useEffect(() => {
    activeTab$.set('jp')
  }, [id])

  const { lyrics, focusColor } = useMemo(() => {
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
        <AppMarkdown markup={detail?.song_info ?? 'No info available.'} />
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
      <View style={styles.characterSpeakBox}>
        <MomoSpeaks markup={'Some concert statistics'} />
      </View>
      <AppBox>
        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'TOTAL LIVE Plays:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {'142'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'FIRST PERFORMED:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {'SEP 07, 2018'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'FIRST PERFORMED IN:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {'UK'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'LAST PERFORMED:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {'MAR 14, 2024'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'LAST PERFORMED IN:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {'Japan'}
          </AppText>
        </View>
      </AppBox>
      <View style={styles.characterSpeakBox}>
        <MoaSpeaks markup={'Want to see us?'} />
      </View>
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{'Youtube'}</AppText>
        <AppText fontSize={FONT.SIZE.LG}>{'...'}</AppText>
        <AppText fontSize={FONT.SIZE.LG}>{'Viewer'}</AppText>
        <AppText fontSize={FONT.SIZE.XS} style={styles.songTitle_jp}>
          {'Official MV'}
        </AppText>
      </AppBox>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  appTextCenter: {
    textAlign: 'center',
  },
  characterSpeakBox: {
    paddingVertical: 12,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  prompt: {
    color: COLORS.TEXT_MUTED,
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
  value: {
    color: COLORS.SECONDARY,
  },
})
