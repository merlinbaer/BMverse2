import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import { ListItemType, VideoListType } from '@/types/list'
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
export const videoList$ = (sortType?: VideoListType) =>
  computed<ListItemType[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is VideoType & { deleted: false } => {
        return !(!item || item.deleted)
      })
      .sort((a, b) => {
        switch (sortType) {
          case 'Views':
            return (b.video_viewcount ?? 0) - (a.video_viewcount ?? 0)
          case 'Title':
            return a.video_title.localeCompare(b.video_title)
          case 'Newest':
          default:
            return (
              new Date(b.video_publishedat).getTime() -
              new Date(a.video_publishedat).getTime()
            )
        }
      })
      .map(
        (item): ListItemType => ({
          id: item.id,
          line1: item.video_title,
          line2:
            sortType === 'Views'
              ? `${Number(item.video_viewcount).toLocaleString()} views`
              : sortType === 'Title'
                ? (item.video_song ?? '')
                : (item.video_publishedat?.replace('T', ' ').substring(0, 16) ??
                  ''),
          icon: item.channel_artwork,
          route: {
            pathname: '/(main)/(tabs)/fox/videos/VideoDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })

export const videosBySong$ = (songTitle: string) =>
  computed<ListItemType[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is VideoType & { deleted: false } => {
        return !(!item || item.deleted) && item.video_song === songTitle
      })
      .sort((a, b) => (b.video_viewcount ?? 0) - (a.video_viewcount ?? 0))
      .map(
        (item): ListItemType => ({
          id: item.id,
          line1: item.channel_type,
          line2: item.video_duration,
          icon: item.video_artwork,
          route: {
            pathname: '/(main)/(tabs)/fox/videos/VideoDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })
