import { Observable } from '@legendapp/state'
import { useObservable, useValue } from '@legendapp/state/react'
import { Image } from 'expo-image'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { musicFile$, musicFileUpdate } from '@/services/legend'
import { MusicFile } from '@/types/player'

interface MetaFieldProps {
  label: string
  field: 'title' | 'artist' | 'album'
  observable$: Observable<string>
  file: MusicFile
  handleUpdate: (field: 'title' | 'artist' | 'album') => void
  handleRevert: (field: 'title' | 'artist' | 'album') => void
}

const MetaField = ({
  label,
  field,
  observable$,
  file,
  handleUpdate,
  handleRevert,
}: MetaFieldProps) => {
  const value = useValue(observable$)
  const origField =
    `orig${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof MusicFile
  const origValue = file[origField]
  const currentValue = file[field]
  const hasChanged =
    origValue !== null && origValue !== undefined && currentValue !== origValue

  return (
    <View style={styles.fieldSection}>
      <View style={styles.labelRow}>
        <AppText style={styles.label}>{label}</AppText>
        {hasChanged && (
          <TouchableOpacity
            onPress={() => handleRevert(field)}
            style={styles.revertButton}
            activeOpacity={0.6}
          >
            <IMAGES.vector.Octicons
              name="history"
              size={14}
              color={COLORS.PRIMARY}
            />
            <AppText style={styles.revertText}>Revert</AppText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.TEXT_MUTED}
          value={value}
          onChangeText={val => observable$.set(val)}
          onBlur={() => handleUpdate(field)}
          onSubmitEditing={() => handleUpdate(field)}
        />
        <IMAGES.vector.Octicons
          name="pencil"
          size={16}
          color={COLORS.TEXT_MUTED}
        />
      </View>
    </View>
  )
}

export default function PlayerMetaEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const file = useValue(musicFile$(id ?? ''))

  const draftTitle$ = useObservable(file?.title ?? '')
  const draftArtist$ = useObservable(file?.artist ?? '')
  const draftAlbum$ = useObservable(file?.album ?? '')

  // Sync draft values when file loads or changes
  React.useEffect(() => {
    if (file) {
      draftTitle$.set(file.title)
      draftArtist$.set(file.artist ?? '')
      draftAlbum$.set(file.album ?? '')
    }
  }, [file, draftTitle$, draftArtist$, draftAlbum$])

  if (!file) {
    return (
      <AppScreen>
        <Stack.Screen options={{ title: 'Edit Metadata' }} />
        <AppLoadScreen message="Music file not found" />
      </AppScreen>
    )
  }

  const handleImagePress = () => {
    router.push({
      pathname: '/(main)/(global)/PlaylistSelectCover',
      params: { musicFileId: id },
    })
  }

  const handleUpdate = (field: 'title' | 'artist' | 'album') => {
    let value = ''
    if (field === 'title') value = draftTitle$.get().trim()
    if (field === 'artist') value = draftArtist$.get().trim()
    if (field === 'album') value = draftAlbum$.get().trim()

    if (value !== file[field]) {
      musicFileUpdate(id ?? '', { [field]: value })
    }
  }

  const handleRevert = (field: 'title' | 'artist' | 'album') => {
    const origField =
      `orig${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof MusicFile
    const origValue = file[origField] as string | null

    if (origValue !== null && origValue !== undefined) {
      if (field === 'title') draftTitle$.set(origValue)
      if (field === 'artist') draftArtist$.set(origValue)
      if (field === 'album') draftAlbum$.set(origValue)

      musicFileUpdate(id ?? '', { [field]: origValue })
    }
  }

  return (
    <AppScreen>
      <Stack.Screen options={{ title: 'Edit Metadata' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.headerImageContainer}
            onPress={handleImagePress}
            activeOpacity={0.7}
          >
            <Image
              source={
                file.appCoverUri || file.coverUri || IMAGES.cover200.notFound
              }
              contentFit="cover"
              style={styles.headerImage}
            />
            <View style={styles.kebabIconContainer}>
              <IMAGES.vector.Octicons
                name="kebab-horizontal"
                size={18}
                color={COLORS.TEXT_MUTED}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <MetaField
              label="Title"
              field="title"
              observable$={draftTitle$}
              file={file}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
            <MetaField
              label="Artist"
              field="artist"
              observable$={draftArtist$}
              file={file}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
            <MetaField
              label="Album"
              field="album"
              observable$={draftAlbum$}
              file={file}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  fieldSection: {
    gap: 6,
  },
  formContainer: {
    gap: 20,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  headerImage: {
    borderRadius: 12,
    height: 160,
    width: 160,
  },
  headerImageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.MODAL_BACKGROUND,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 20,
    padding: 8,
    width: 190,
  },
  input: {
    color: COLORS.TEXT,
    flex: 1,
    fontSize: FONT.SIZE.SM,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: COLORS.BG_GREY,
    borderColor: COLORS.MODAL_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    height: 48,
    paddingHorizontal: 16,
  },
  kebabIconContainer: {
    bottom: 8,
    position: 'absolute',
    right: 20,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT.SIZE.XS,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  revertButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  revertText: {
    color: COLORS.PRIMARY,
    fontSize: FONT.SIZE.XS,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
})
