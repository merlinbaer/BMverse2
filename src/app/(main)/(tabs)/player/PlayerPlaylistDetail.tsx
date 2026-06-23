import { useObservable, useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import { AppBox } from '@/components/AppBox'
import { AppFlatList } from '@/components/AppFlatList'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { useBetterSafeAreaInsets } from '@/hooks/useBetterSafeAreaInsets'
import {
  playlistDetail$,
  playlistNameUpdate,
  playlistTracksList$,
} from '@/services/legend'

export default function PlayerPlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const detail = useValue(playlistDetail$(id ?? ''))
  const tracks = useValue(playlistTracksList$(id ?? ''))
  const insets = useBetterSafeAreaInsets()

  const draftName$ = useObservable(detail?.name ?? '')

  if (!id || !detail) {
    return (
      <AppScreen>
        <AppLoadScreen message="Playlist not found" />
      </AppScreen>
    )
  }

  const handleUpdateName = () => {
    const newName = draftName$.get().trim()
    if (detail.id && newName && newName !== detail.name) {
      playlistNameUpdate(detail.id, newName)
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Playlist Details' }} />
      <View style={styles.container}>
        <View style={styles.headerImageContainer}>
          <Image
            source={detail.imageUri || IMAGES.cover200.notFound}
            contentFit="cover"
            style={styles.headerImage}
          />
        </View>

        <AppBox>
          <TextInput
            style={styles.input}
            placeholder="Type here"
            placeholderTextColor={COLORS.TEXT_MUTED}
            defaultValue={detail.name}
            onChangeText={val => draftName$.set(val)}
            onSubmitEditing={handleUpdateName}
            onBlur={handleUpdateName}
          />
          <AppText fontSize={FONT.SIZE.XS} style={{ color: COLORS.SECONDARY }}>
            Tap to edit playlist name
          </AppText>
        </AppBox>

        <View
          style={[styles.listContainer, { marginBottom: insets.bottom + 60 }]}
        >
          <AppFlatList data={tracks} displayIconAsText={false} />
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    marginTop: 8,
  },
  headerImage: {
    borderRadius: 12,
    height: 200,
    width: 200,
  },
  headerImageContainer: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  input: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.BASE,
    paddingVertical: 8,
  },
  listContainer: {
    flex: 1,
  },
})
