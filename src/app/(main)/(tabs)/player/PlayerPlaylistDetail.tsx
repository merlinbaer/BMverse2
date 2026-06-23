import { useObservable, useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

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
  const handleAddTrack = () => {
    // Placeholder for adding track logic
  }

  const handleCopyList = () => {
    // Placeholder for copying list logic
  }

  const handleDeleteList = () => {
    // Placeholder for deleting list logic
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Edit Playlist' }} />
      <View style={styles.container}>
        <View style={styles.headerImageContainer}>
          <Image
            source={detail.imageUri || IMAGES.cover200.notFound}
            contentFit="cover"
            style={styles.headerImage}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type here"
            placeholderTextColor={COLORS.TEXT_MUTED}
            defaultValue={detail.name}
            onChangeText={val => draftName$.set(val)}
            onSubmitEditing={handleUpdateName}
            onBlur={handleUpdateName}
          />
          <View style={styles.iconRight}>
            <IMAGES.vector.Octicons
              name="pencil"
              size={16}
              color={COLORS.TEXT_MUTED}
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddTrack}
          >
            <IMAGES.vector.Octicons name="plus" size={18} color={COLORS.TEXT} />
            <AppText fontSize={FONT.SIZE.XS} style={styles.buttonText}>
              Add Track
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyList}
          >
            <IMAGES.vector.Octicons name="copy" size={18} color={COLORS.TEXT} />
            <AppText fontSize={FONT.SIZE.XS} style={styles.buttonText}>
              Copy List
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteList}
          >
            <IMAGES.vector.Octicons
              name="trash"
              size={18}
              color={COLORS.PRIMARY}
            />
            <AppText fontSize={FONT.SIZE.XS} style={styles.buttonTextDanger}>
              Delete List
            </AppText>
          </TouchableOpacity>
        </View>
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
  actionButton: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: COLORS.TEXT,
    fontWeight: 'bold',
  },
  buttonTextDanger: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    gap: 8,
    marginTop: 8,
  },
  headerImage: {
    borderRadius: 12,
    height: 150,
    width: 150,
  },
  headerImageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.MODAL_BACKGROUND,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 10,
    padding: 20,
    width: 220,
  },
  iconRight: {
    position: 'absolute',
    right: 16,
  },
  input: {
    color: COLORS.TEXT,
    fontSize: FONT.SIZE.BASE,
    minWidth: 100,
    paddingVertical: 4,
    textAlign: 'center',
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40, // Space for the icon so text stays centered
  },
  listContainer: {
    flex: 1,
  },
})
