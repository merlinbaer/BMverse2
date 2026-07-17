import { useObservable, useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { AppDragList } from '@/components/AppDragList'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppScreen } from '@/components/AppScreen'
import { AppStaticScreen } from '@/components/AppStaticScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { useAlert } from '@/hooks/useAlert'
import {
  playlistCopy,
  playlistCreate,
  playlistDelete,
  playlistDetail$,
  playlistNameUpdate,
  playlistTracksList$,
  playlistTracksUpdate,
} from '@/services/legend'
import { generateId } from '@/services/legend/config'
import { ListItemType } from '@/types/list'

export default function PlayerPlaylistDetailScreen() {
  const { id: initialId } = useLocalSearchParams<{ id: string }>()
  const [id] = React.useState(() => initialId || generateId())

  const detail = useValue(playlistDetail$(id ?? ''))
  const tracks = useValue(playlistTracksList$(id ?? ''))
  const { showAlert } = useAlert()

  // Effect to create playlist if no ID exists
  React.useEffect(() => {
    if (!initialId && !detail) {
      playlistCreate(undefined, id)
    }
  }, [initialId, detail, id])

  const draftName$ = useObservable(detail?.name ?? '')

  if (!detail && initialId) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'Edit Playlist' }} />
        <AppLoadScreen message="Playlist not found" />
      </AppScreen>
    )
  }
  // Handle loading state for new playlists
  if (!detail) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'Add Playlist' }} />
        <AppLoadScreen message="Initializing Playlist..." />
      </AppScreen>
    )
  }

  const handleImagePress = () => {
    router.push({
      pathname: '/(main)/(global)/PlaylistSelectCover',
      params: { playlistId: id },
    })
  }

  const handleUpdateName = () => {
    const newName = draftName$.get().trim()
    if (detail.id && newName && newName !== detail.name) {
      playlistNameUpdate(detail.id, newName)
    }
  }

  const handleReorder = (newData: ListItemType[]) => {
    if (!id) return
    // Remove the placeholder zone before saving to state
    const updatedTracks = newData
      .filter(t => t.id !== 'DELETE_ZONE')
      .map((item, index) => ({
        musicFileId: item.id,
        trackNum: index + 1,
      }))
    playlistTracksUpdate(id, updatedTracks)
  }

  const handleRemoveTrack = (item: ListItemType) => {
    showAlert(
      'Remove Track',
      `Are you sure you want to remove "${item.line1}" from this playlist?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (!id) return
            // Filter global tracks state
            const updatedTracks = tracks
              .filter(t => t.id !== item.id)
              .map((t, index) => ({
                musicFileId: t.id,
                trackNum: index + 1,
              }))
            playlistTracksUpdate(id, updatedTracks)
          },
        },
      ],
    )
  }

  const handleAddTrack = () => {
    router.push({
      pathname: '/(main)/(global)/PlaylistAddTrack',
      params: { playlistId: id },
    })
  }

  const handleCopyList = () => {
    const newId = playlistCopy(id)
    if (newId) {
      router.replace({
        pathname: '/(main)/(tabs)/player/PlayerPlaylistDetail',
        params: { id: newId },
      })
    }
  }

  const handleDeleteList = () => {
    if (!detail) return

    showAlert(
      'Delete Playlist',
      `Are you sure you want to delete "${detail.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            playlistDelete(id)
            router.back()
          },
        },
      ],
    )
  }

  const Header = (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerImageContainer}
        onPress={handleImagePress}
        activeOpacity={0.7}
      >
        <Image
          source={detail.imageUri || IMAGES.cover200.notFound}
          contentFit="cover"
          style={styles.headerImage}
        />
        <View style={styles.kebabIconContainer}>
          <IMAGES.vector.Octicons
            name="kebab-horizontal"
            size={16}
            color={COLORS.TEXT_MUTED}
          />
        </View>
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.actionButton} onPress={handleAddTrack}>
          <IMAGES.vector.Octicons name="plus" size={18} color={COLORS.TEXT} />
          <AppText fontSize={FONT.SIZE.XS} style={styles.buttonText}>
            Add Track
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopyList}>
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
    </View>
  )

  // Prepend the delete zone to the track data only if tracks exist
  const listData: ListItemType[] = [
    ...(tracks.length > 0
      ? [
          {
            id: 'DELETE_ZONE',
            line1: 'Move here to remove track',
            line2: '',
            icon: '',
            route: null,
          } as ListItemType,
        ]
      : []),
    ...tracks,
  ]

  return (
    <AppStaticScreen>
      <Stack.Screen
        options={{ title: initialId ? 'Edit Playlist' : 'New Playlist' }}
      />
      <View style={styles.container}>
        <AppDragList
          data={listData}
          onReorder={handleReorder}
          onDeleteItem={handleRemoveTrack}
          ListHeaderComponent={Header}
        />
      </View>
    </AppStaticScreen>
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
  headerContainer: {
    gap: 8,
    paddingBottom: 16,
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
  kebabIconContainer: {
    bottom: 8,
    position: 'absolute',
    right: 8,
  },
})
