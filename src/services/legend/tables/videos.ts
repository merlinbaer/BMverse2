import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import { ListItemType } from '@/types/list'
import { VideoType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<VideoType>({
  collection: 'bm_videos',
  actions: ['read'],
  sort: (a, b) => (b.video_viewcount ?? 0) - (a.video_viewcount ?? 0),
})

// Add Factory functions
export const videos$ = store$
export const videoItem$ = item$
export const videoSync = sync
export const videoClearCache = clearCache

// Domain-specific functions
export const videoList$ = () =>
  computed<ListItemType[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is VideoType & { deleted: false } => {
        return !(!item || item.deleted)
      })
      .sort((a, b) => (b.video_viewcount ?? 0) - (a.video_viewcount ?? 0))
      .map(
        (item): ListItemType => ({
          id: item.id,
          line1: item.video_title,
          line2: `${Number(item.video_viewcount).toLocaleString()} views`,
          icon: item.channel_artwork,
          route: {
            pathname: '/(main)/(tabs)/fox/videos/VideoDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })
