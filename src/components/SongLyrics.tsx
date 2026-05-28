import { observable } from '@legendapp/state'
import { useValue } from '@legendapp/state/react'
import React, { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AppText } from 'src/components/AppText'
import { COLORS, FONT } from 'src/constants/constants'
import { SongType } from 'src/types/tables'

type LyricsType = 'jp' | 'rom' | 'en'
const activeTab$ = observable<LyricsType>('jp')

interface SongLyricsProps {
  detail: SongType
}

export const SongLyrics = ({ detail }: SongLyricsProps) => {
  const activeTab = useValue(activeTab$)

  const { lyrics, focusColor } = useMemo(() => {
    switch (activeTab) {
      case 'rom':
        return { lyrics: detail.song_lyrics_rom, focusColor: COLORS.SECONDARY }
      case 'en':
        return { lyrics: detail.song_lyrics_en, focusColor: COLORS.TEXT }
      case 'jp':
      default:
        return { lyrics: detail.song_lyrics_jp, focusColor: COLORS.PRIMARY }
    }
  }, [activeTab, detail])

  if (!detail.song_lyrics_jp) return null

  return (
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
  )
}

const styles = StyleSheet.create({
  songLyrics: {
    paddingTop: 16,
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
