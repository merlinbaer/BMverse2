import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import coverBABYMETAL from '@/../assets/images/BM_Splatter_200.png'
import coverMETALFORTH from '@/../assets/images/Forth_Splatter_200.png'
import coverMETALGALAXY from '@/../assets/images/Galaxy_Splatter_200.png'
import coverTHEONE from '@/../assets/images/One_Splatter_200.png'
import coverMETALRESISTANCE from '@/../assets/images/Resistance_Splatter_200.png'
import coverSINGLE from '@/../assets/images/Single_200.png'
import coverNotFound from '@/../assets/images/unknown_track.png'
import { ListItem } from '@/types/list'
import { SongType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<SongType>({
  collection: 'bm_songs',
  actions: ['read'],
  sort: (a, b) => a.song_id.localeCompare(b.song_id),
})

// Add Factory functions
export const songs$ = store$
export const songItem$ = item$
export const songSync = sync
export const songClearCache = clearCache

// Domain-specific functions
const getSongCover = (coverName: string | null) => {
  switch (coverName) {
    case 'BABYMETAL':
      return coverBABYMETAL
    case 'METAL RESISTANCE':
      return coverMETALRESISTANCE
    case 'METAL GALAXY':
      return coverMETALGALAXY
    case 'THE OTHER ONE':
      return coverTHEONE
    case 'METAL FORTH':
      return coverMETALFORTH
    case 'SINGLE':
      return coverSINGLE
    default:
      return coverNotFound
  }
}

export const songList$ = () =>
  computed<ListItem[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is SongType & { deleted: false } => {
        return !(!item || item.deleted)
      })
      .sort((a, b) => a.song_id.localeCompare(b.song_id))
      .map(
        (item): ListItem => ({
          id: item.id,
          line1: item.song_title ?? '',
          line2: item.song_artist ?? '',
          sorted: item.song_id,
          icon: getSongCover(item.song_default_cover),
          route: {
            pathname: '/(main)/(tabs)/fox/songs/SongDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })
