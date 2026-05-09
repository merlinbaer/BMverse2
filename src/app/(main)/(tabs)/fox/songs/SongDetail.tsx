import { useValue } from '@legendapp/state/react'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { AppBox } from '@/components/AppBox'
import { AppMarkdown } from '@/components/AppMarkdown'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { FONT } from '@/constants/constants'
import { songItem$ } from '@/services/legend'

export default function UpComingDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const detail = useValue(songItem$(id))

  //<AppText>{'ID: ' + detail?.setlist_id}</AppText>
  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Upcoming Details' }} />
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{detail?.song_title}</AppText>
        <AppText fontSize={FONT.SIZE.LG}>{detail?.song_title_jp}</AppText>
        <AppText> {detail?.song_artist} </AppText>
      </AppBox>
      <AppBox>
        <AppText> {detail?.song_album_name} </AppText>
      </AppBox>
      <AppBox>
        <AppText fontSize={FONT.SIZE.LG}>{'Info:'}</AppText>
        <AppMarkdown markup={detail?.song_info ?? 'No info available.'} />
      </AppBox>
    </AppScreen>
  )
}
