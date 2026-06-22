import { computed, observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'

import { IMAGES } from '@/constants/images'
import { ListItemType } from '@/types/list'
import { MusicFile } from '@/types/player'

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

export const musicPlaylist$ = computed<ListItemType[]>(() => {
  const files = musicFiles$.get()
  if (!files) return []

  return files.map(
    (file): ListItemType => ({
      id: file.id,
      line1: file.title,
      line2: file.artist ?? 'Unknown',
      icon: IMAGES.cover200.single,
      route: null,
      value: file.audioUri,
    }),
  )
})
