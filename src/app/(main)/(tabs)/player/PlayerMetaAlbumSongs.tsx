import { useValue } from '@legendapp/state/react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/AppButton'
import { AppFlatList } from '@/components/AppFlatList'
import { AppStaticScreen } from '@/components/AppStaticScreen'
import { albumTracksList$ } from '@/services/legend'

export default function PlayerMetaAlbumSongsScreen() {
  const { album } = useLocalSearchParams<{ album: string }>()
  const list$ = useMemo(() => albumTracksList$(album ?? ''), [album])
  const data = useValue(list$)

  const handleChangeArtwork = () => {
    if (!album) return
    router.push({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pathname: '/(main)/(global)/AlbumSelectCover' as any,
      params: { album },
    })
  }

  const Header = (
    <View style={styles.headerContainer}>
      <AppButton title="Change all Artwork" onPress={handleChangeArtwork} />
    </View>
  )

  return (
    <AppStaticScreen>
      <Stack.Screen options={{ title: album || 'Album Songs' }} />
      <View style={styles.container}>
        <AppFlatList
          data={data}
          scrollEnabled={true}
          ListHeaderComponent={Header}
        />
      </View>
    </AppStaticScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    marginTop: 8,
  },
  headerContainer: {
    padding: 24,
  },
})
