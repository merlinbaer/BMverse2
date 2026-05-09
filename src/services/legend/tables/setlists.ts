import { computed } from '@legendapp/state'

import { ListItem } from '@/types/list'
import { SetlistType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<SetlistType>({
  collection: 'bm_event_concert_songs',
  actions: ['read'],
  sort: (a, b) => b.song_nr - a.song_nr,
})

// Add Factory functions
export const setlists$ = store$
export const setlistItem$ = item$
export const setlistSync = sync
export const setlistClearCache = clearCache

// Domain-specific functions
export const setlistsList$ = (setlistId?: string) =>
  computed<ListItem[]>(() => {
    const data = store$.get()
    if (!data || !setlistId) return []
    return Object.values(data)
      .filter((item): item is SetlistType & { deleted: false } => {
        if (!item || item.deleted) return false
        return item.setlist_id === setlistId
      })
      .sort((a, b) => a.song_nr - b.song_nr)
      .map(
        (item): ListItem => ({
          id: item.song_name ?? '',
          line1: item.song_name ?? '',
          line2: item.song_info ?? '',
          icon: (item.song_nr + 1).toString(), // Ensure icon matches string | number
          route: null,
        }),
      )
  })
