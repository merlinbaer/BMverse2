import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import { ListItem } from '@/types/list'
import { UpcomingType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<UpcomingType>({
  collection: 'bm_event_concert_upcoming',
  actions: ['read'],
  sort: (a, b) =>
    new Date(a.setlist_eventdate).getTime() -
    new Date(b.setlist_eventdate).getTime(),
})

// Add Factory functions
export const upcoming$ = store$
export const upcomingItem$ = item$
export const upcomingSync = sync
export const upcomingClearCache = clearCache

// Domain-specific functions
export const upcomingList$ = () =>
  computed<ListItem[]>(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter((item): item is UpcomingType & { deleted: false } => {
        return !(!item || item.deleted)
      })
      .sort(
        (a, b) =>
          new Date(a.setlist_eventdate).getTime() -
          new Date(b.setlist_eventdate).getTime(),
      )
      .map(
        (item): ListItem => ({
          id: item.id,
          line1: item.setlist_venue_city_name + ' - ' + item.setlist_venue_name,
          line2: item.setlist_eventdate,
          sorted: item.setlist_eventdate,
          icon: item.setlist_artwork ?? '',
          route: {
            pathname: '/(main)/(tabs)/fox/concerts/UpcomingDetail',
            params: { id: item.id },
          } as Href,
        }),
      )
  })
