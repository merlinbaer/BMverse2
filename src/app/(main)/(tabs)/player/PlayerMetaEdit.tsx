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
  ViewStyle,
} from 'react-native'

import { AppBubbleText } from '@/components/AppBubbleText'
import { AppLoadScreen } from '@/components/AppLoadScreen'
import { AppScreen } from '@/components/AppScreen'
import { AppText } from '@/components/AppText'
import { COLORS, FONT, LAYOUT } from '@/constants/constants'
import { IMAGES } from '@/constants/images'
import { musicFile$, musicFileUpdate } from '@/services/legend'
import { MusicFile } from '@/types/player'

type MetaFieldKey = 'title' | 'artist' | 'album' | 'disc' | 'track'

interface MetaFieldProps {
  label: string
  field: MetaFieldKey
  observable$: Observable<string>
  musicFileId: string
  handleUpdate: (field: MetaFieldKey) => void
  handleRevert: (field: MetaFieldKey) => void
  keyboardType?: 'default' | 'number-pad' | 'numeric'
  isNumeric?: boolean
  style?: ViewStyle
}

const MetaField = ({
  label,
  field,
  observable$,
  musicFileId,
  handleUpdate,
  handleRevert,
  keyboardType = 'default',
  isNumeric = false,
  style,
}: MetaFieldProps) => {
  const value = useValue(observable$)
  const file = useValue(musicFile$(musicFileId))

  if (!file) return null

  const origFieldMap: Record<MetaFieldKey, keyof MusicFile> = {
    title: 'origTitle',
    artist: 'origArtist',
    album: 'origAlbum',
    disc: 'origDisc',
    track: 'origTrack',
  }

  const origField = origFieldMap[field]
  const origValue = file[origField]
  const currentValue = file[field]
  const hasChanged =
    origValue !== null && origValue !== undefined && currentValue !== origValue

  const handleChangeText = (val: string) => {
    if (isNumeric) {
      observable$.set(val.replace(/[^0-9]/g, ''))
    } else {
      observable$.set(val)
    }
  }

  return (
    <View style={[styles.fieldSection, style]}>
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
          onChangeText={handleChangeText}
          onBlur={() => handleUpdate(field)}
          onSubmitEditing={() => handleUpdate(field)}
          keyboardType={keyboardType}
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
  const draftDisc$ = useObservable(
    file?.disc !== null && file?.disc !== undefined ? String(file.disc) : '',
  )
  const draftTrack$ = useObservable(
    file?.track !== null && file?.track !== undefined ? String(file.track) : '',
  )

  const hintText =
    '**Hint:**\n' +
    'You can revert the metadata back to its original state when the music file was added.'

  // Sync draft values when file loads or changes
  React.useEffect(() => {
    if (file) {
      draftTitle$.set(file.title)
      draftArtist$.set(file.artist ?? '')
      draftAlbum$.set(file.album ?? '')
      draftDisc$.set(
        file.disc !== null && file.disc !== undefined ? String(file.disc) : '',
      )
      draftTrack$.set(
        file.track !== null && file.track !== undefined
          ? String(file.track)
          : '',
      )
    }
  }, [file, draftTitle$, draftArtist$, draftAlbum$, draftDisc$, draftTrack$])

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

  const handleUpdate = (field: MetaFieldKey) => {
    if (field === 'disc' || field === 'track') {
      const rawVal = (field === 'disc' ? draftDisc$ : draftTrack$).get().trim()
      const numVal = rawVal !== '' ? parseInt(rawVal, 10) : null
      const finalVal = numVal !== null && !isNaN(numVal) ? numVal : null

      if (finalVal !== file[field]) {
        musicFileUpdate(id ?? '', { [field]: finalVal })
      }
    } else {
      let value = ''
      if (field === 'title') value = draftTitle$.get().trim()
      if (field === 'artist') value = draftArtist$.get().trim()
      if (field === 'album') value = draftAlbum$.get().trim()

      if (value !== file[field]) {
        musicFileUpdate(id ?? '', { [field]: value })
      }
    }
  }

  const handleRevert = (field: MetaFieldKey) => {
    const origFieldMap: Record<MetaFieldKey, keyof MusicFile> = {
      title: 'origTitle',
      artist: 'origArtist',
      album: 'origAlbum',
      disc: 'origDisc',
      track: 'origTrack',
    }
    const origField = origFieldMap[field]
    const origValue = file[origField]

    if (origValue !== null && origValue !== undefined) {
      if (field === 'title') draftTitle$.set(origValue as string)
      if (field === 'artist') draftArtist$.set(origValue as string)
      if (field === 'album') draftAlbum$.set(origValue as string)
      if (field === 'disc') draftDisc$.set(String(origValue))
      if (field === 'track') draftTrack$.set(String(origValue))

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
              source={file.appCoverUri || IMAGES.cover200.notFound}
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
              musicFileId={id ?? ''}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
            <MetaField
              label="Artist"
              field="artist"
              observable$={draftArtist$}
              musicFileId={id ?? ''}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
            <MetaField
              label="Album"
              field="album"
              observable$={draftAlbum$}
              musicFileId={id ?? ''}
              handleUpdate={handleUpdate}
              handleRevert={handleRevert}
            />
            <View style={styles.rowContainer}>
              <MetaField
                label="Disc"
                field="disc"
                observable$={draftDisc$}
                musicFileId={id ?? ''}
                handleUpdate={handleUpdate}
                handleRevert={handleRevert}
                keyboardType="number-pad"
                isNumeric={true}
                style={styles.halfField}
              />
              <MetaField
                label="Track"
                field="track"
                observable$={draftTrack$}
                musicFileId={id ?? ''}
                handleUpdate={handleUpdate}
                handleRevert={handleRevert}
                keyboardType="number-pad"
                isNumeric={true}
                style={styles.halfField}
              />
            </View>
          </View>
          <AppBubbleText markup={hintText} orientation={'center'} />
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
    paddingBottom: 40,
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  halfField: {
    flex: 1,
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
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
})
