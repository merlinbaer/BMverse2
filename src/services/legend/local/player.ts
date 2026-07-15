import { computed, observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { Href } from 'expo-router'

import { IMAGES } from '@/constants/images'
import { ListItemType } from '@/types/list'
import { MusicFile, Playlist } from '@/types/player'

import { persistLargeStore } from '../config'

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

export const playlistTracksUpdate = (
  playlistId: string,
  newTracks: { musicFileId: string; trackNum: number }[],
) => {
  const playlist$ = playlists$.find(p => p.id.get() === playlistId)
  if (playlist$) {
    playlist$.tracks.set(newTracks)
  }
}
