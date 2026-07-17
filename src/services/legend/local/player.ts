import { computed, observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { Href } from 'expo-router'

import { IMAGES } from '@/constants/images'
import { getPlaylistTimestamp } from '@/services/dateTimeHelper'
import { ListItemType } from '@/types/list'
import { MusicFile, Playlist } from '@/types/player'

import { generateId, persistLargeStore } from '../config'

// Store for local-only persisted music metadata
export const musicFiles$ = observable<MusicFile[]>([])

syncObservable(musicFiles$, {
  persist: {
    name: 'musicFiles',
    plugin: persistLargeStore,
    retrySync: true,
  },
})

export const playlists$ = observable<Playlist[]>([])

syncObservable(playlists$, {
  persist: {
    name: 'playlists',
    plugin: persistLargeStore,
    retrySync: true,
  },
})

export const playlistList$ = computed<ListItemType[]>(() => {
  const list = playlists$.get()
  if (!list) return []

  return list
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (item): ListItemType => ({
        id: item.id,
        line1: item.name,
        line2: `${item.tracks.length} Tracks`,
        icon: item.imageUri ?? IMAGES.cover200.notFound,
        route: {
          pathname: '/(main)/(tabs)/player/PlayerPlaylistDetail',
          params: { id: item.id },
        } as Href,
      }),
    )
})

export const musicFilesFullList$ = computed<ListItemType[]>(() => {
  const allFiles = musicFiles$.get()
  if (!allFiles) return []

  return allFiles
    .slice()
    .sort((a, b) => {
      return (
        (a.album || a.origAlbum || '').localeCompare(
          b.album || b.origAlbum || '',
        ) ||
        (a.origYear ?? 0) - (b.origYear ?? 0) ||
        (a.origDisc ?? 0) - (b.origDisc ?? 0) ||
        (a.origTrack ?? 0) - (b.origTrack ?? 0) ||
        a.title.localeCompare(b.title)
      )
    })
    .map((file, index): ListItemType => {
      const playlistTimestamp = getPlaylistTimestamp(new Date(file.importedAt))
      const albumName = file.album || file.origAlbum || playlistTimestamp
      const line1 = albumName.includes(playlistTimestamp)
        ? albumName
        : `${albumName} - ${playlistTimestamp}`

      const discPart = file.origDisc ? `D/${file.origDisc}` : ''
      const trackPart = file.origTrack ? `T/${file.origTrack}` : ''
      const metaPrefix = [discPart, trackPart].filter(Boolean).join(' - ')

      return {
        id: file.id,
        line1,
        line2: metaPrefix ? `${metaPrefix} - ${file.title}` : file.title,
        icon: String(index + 1),
        route: null,
      }
    })
})

export const musicFilesPickerList$ = (playlistId: string) =>
  computed<ListItemType[]>(() => {
    const allFiles = musicFiles$.get()
    const playlist = playlists$.find(p => p.id.get() === playlistId)?.get()
    if (!allFiles) return []

    const existingTrackIds = new Set(
      playlist?.tracks.map(t => t.musicFileId) || [],
    )

    return allFiles
      .filter(file => !existingTrackIds.has(file.id))
      .slice()
      .sort((a, b) => {
        return (
          (a.album || a.origAlbum || '').localeCompare(
            b.album || b.origAlbum || '',
          ) ||
          (a.origDisc ?? 0) - (b.origDisc ?? 0) ||
          (a.origTrack ?? 0) - (b.origTrack ?? 0) ||
          a.title.localeCompare(b.title)
        )
      })
      .map((file, index): ListItemType => {
        const playlistTimestamp = getPlaylistTimestamp(
          new Date(file.importedAt),
        )
        const albumName = file.album || file.origAlbum || playlistTimestamp
        const line1 = albumName.includes(playlistTimestamp)
          ? albumName
          : `${albumName} - ${playlistTimestamp}`
        const discPart = file.origDisc ? `D/${file.origDisc}` : ''
        const trackPart = file.origTrack ? `T/${file.origTrack}` : ''
        const metaPrefix = [discPart, trackPart].filter(Boolean).join(' - ')

        return {
          id: file.id,
          line1,
          line2: metaPrefix ? `${metaPrefix} - ${file.title}` : file.title,
          icon: String(index + 1),
          route: null,
        }
      })
  })

export const playlistDetail$ = (playlistId: string) =>
  computed(() => playlists$.find(p => p.id.get() === playlistId)?.get() ?? null)

export const playlistTracksList$ = (playlistId: string) =>
  computed<ListItemType[]>(() => {
    const playlist = playlists$.find(p => p.id.get() === playlistId)
    const allFiles = musicFiles$.get()
    if (!playlist || !allFiles) return []

    return playlist.tracks
      .get()
      .map(track => {
        const file = allFiles.find(f => f.id === track.musicFileId)
        return {
          id: track.musicFileId,
          line1: file?.title ?? 'Unknown Title',
          line2:
            (file?.album ?? 'Unknown Album') +
            ' - ' +
            (file?.artist ?? 'Unknown Artist'),
          icon: IMAGES.cover200.single,
          route: null,
          value: track.trackNum,
        } as ListItemType
      })
      .sort((a, b) => ((a.value as number) ?? 0) - ((b.value as number) ?? 0))
  })

export const playlistNameUpdate = (playlistId: string, newName: string) => {
  const playlist$ = playlists$.find(p => p.id.get() === playlistId)
  if (playlist$) {
    playlist$.name.set(newName)
  }
}

export const playlistCreate = (name?: string, existingId?: string): string => {
  const newId = existingId || generateId()
  const newPlaylist: Playlist = {
    id: newId,
    name: name || getPlaylistTimestamp(new Date()),
    imageUri: null,
    tracks: [],
  }
  playlists$.push(newPlaylist)
  return newId
}

export const playlistCopy = (playlistId: string): string | null => {
  const original = playlists$.find(p => p.id.get() === playlistId)?.get()
  if (!original) return null

  // logic for name suffix
  let newName = original.name
  const suffixMatch = newName.match(/_(\d)$/) // Matches _1 to _9 at the end

  if (suffixMatch) {
    const currentNum = parseInt(suffixMatch[1], 10)
    if (currentNum < 9) {
      newName = newName.replace(/_\d$/, `_${currentNum + 1}`)
    } else {
      newName = `${newName}_1`
    }
  } else {
    newName = `${newName}_1`
  }

  const newId = generateId()
  const duplicate: Playlist = {
    id: newId,
    name: newName,
    imageUri: original.imageUri,
    tracks: original.tracks.map(t => ({ ...t })),
  }

  playlists$.push(duplicate)
  return newId
}

export const playlistDelete = (playlistId: string) => {
  const index = playlists$.get().findIndex(p => p.id === playlistId)
  if (index !== -1) {
    playlists$.splice(index, 1)
  }
}

export const playlistTracksUpdate = (
  playlistId: string,
  newTracks: { musicFileId: string; trackNum: number }[],
) => {
  const playlist$ = playlists$.find(p => p.id.get() === playlistId)
  if (playlist$) {
    playlist$.tracks.set(newTracks)
  }
}
