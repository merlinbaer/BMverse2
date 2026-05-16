import { useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Linking, Pressable, StyleSheet, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, MAP_HEIGHT } from '@/constants/constants'
import { videoItem$ } from '@/services/legend'

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const detail = useValue(videoItem$(id))
  const handleOpenMap = () => {
    Linking.openURL(detail?.video_artwork ? detail?.video_artwork : '').catch(
      err => console.error('Error opening maps:', err),
    )
  }
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Youtube' }} />
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>
          {detail?.video_title_original}
        </AppText>
        <Pressable
          onPress={handleOpenMap}
          style={({ pressed }) => [
            styles.mapContainer,
            pressed && styles.mapPressed,
          ]}
        >
          <Image
            source={detail?.video_artwork}
            contentFit="fill"
            style={styles.mapImage}
          />
        </Pressable>
        <AppText fontSize={FONT.SIZE.SM}>{detail?.video_duration}</AppText>
      </AppBox>
      <AppBox>
        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'PUBLISHED at:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {detail?.video_publishedat}
          </AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'VIEW count:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {Number(detail?.video_viewcount).toLocaleString()}
          </AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'LIKE count:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {Number(detail?.video_likecount).toLocaleString()}
          </AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText fontSize={FONT.SIZE.XS} style={styles.prompt}>
            {'COMMENT count:'}
          </AppText>
          <AppText fontSize={FONT.SIZE.SM} style={styles.value}>
            {Number(detail?.video_commentcount).toLocaleString()}
          </AppText>
        </View>
      </AppBox>
      <AppBox>
        <AppText>{detail?.video_description}</AppText>
      </AppBox>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  mapContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    width: '100%',
  },
  mapImage: {
    height: MAP_HEIGHT,
    width: (MAP_HEIGHT / 3) * 4,
  },
  mapPressed: {
    opacity: 0.7,
  },
  prompt: {
    color: COLORS.TEXT_MUTED,
  },
  value: {
    color: COLORS.SECONDARY,
  },
})
