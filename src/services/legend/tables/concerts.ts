import { computed } from '@legendapp/state'
import { Href } from 'expo-router'

import concertBoxTour from '@/../assets/images/concert_box_tour.png'
import concertBoxYear from '@/../assets/images/concert_box_year.png'
import { ConcertListType, ListItemType } from '@/types/list'
import { ConcertsType, SetlistType } from '@/types/tables'

import { createTableStore } from '../factory'

import { setlists$ } from './setlists'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<ConcertsType>({
  collection: 'bm_event_concert',
  actions: ['read'],
  sort: (a, b) =>
    new Date(b.setlist_eventdate).getTime() -
    new Date(a.setlist_eventdate).getTime(),
})

// Add Factory functions
export const concerts$ = store$
export const concertItem$ = item$
export const concertSync = sync
export const concertClearCache = clearCache

// Domain-specific functions
export const concertsYearList$ = computed<ListItemType[]>(() => {
  const data = store$.get()
  if (!data) return []
  // 1. Filter and 2. Group (Aggregation by year is needed)
  const yearsMap = Object.values(data)
    .filter(
      (item): item is ConcertsType & { deleted: false } =>
        !!item && !item.deleted,
    )
    .reduce((acc, item) => {
      const year = String(item.setlist_eventyear)
      acc.set(year, (acc.get(year) || 0) + 1)
      return acc
    }, new Map<string, number>())
  // 3. Sort (Years descending) and then 4. construct UI elements with Map
  return Array.from(yearsMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(
      ([year, count]): ListItemType => ({
        id: year,
        line1: year,
        line2: `${count} concerts performed`,
        icon: concertBoxYear,
        route: {
          pathname: '/(main)/(tabs)/fox/concerts/ConcertsVenue',
          params: { type: 'Year', id: year },
        } as Href,
      }),
    )
})

export const concertsCountryList$ = computed<ListItemType[]>(() => {
  const data = store$.get()
  if (!data) return []
  // 1. Filter and Group (Aggregation by country is needed)
  const countriesMap = Object.values(data).reduce((acc, item) => {
    if (item && !item.deleted) {
      const code = item.setlist_venue_city_country_code
      const year = String(item.setlist_eventyear)

      if (!acc.has(code)) {
        acc.set(code, {
          name: item.setlist_venue_city_country_name,
          years: new Set<string>(),
        })
      }
      acc.get(code)!.years.add(year)
    }
    return acc
  }, new Map<string, { name: string; years: Set<string> }>())
  // 3. Sort (Country Name ascending) and then 4. construct UI elements with Map
  return Array.from(countriesMap.entries())
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .map(
      ([code, details]): ListItemType => ({
        id: code,
        line1: details.name,
        line2: Array.from(details.years)
          .sort((a, b) => b.localeCompare(a))
          .join(', '),
        icon: `https://flagsapi.com/${code}/shiny/64.png`,
        route: {
          pathname: '/(main)/(tabs)/fox/concerts/ConcertsVenue',
          params: { type: 'Country', id: code },
        } as Href,
      }),
    )
})

export const concertsTourList$ = computed<ListItemType[]>(() => {
  const data = store$.get()
  if (!data) return []
  // 1. Filter and Group (Aggregation by tour and year is needed)
  const toursMap = Object.values(data).reduce((acc, item) => {
    if (item && !item.deleted && item.setlist_tour_name) {
      const name = item.setlist_tour_name
      const year = String(item.setlist_eventyear)

      if (!acc.has(name)) {
        acc.set(name, new Set<string>())
      }
      acc.get(name)!.add(year)
    }
    return acc
  }, new Map<string, Set<string>>())
  // 2. Sort the raw data (By last year of tour, then name) and then 4. construct UI elements with Map
  return Array.from(toursMap.entries())
    .sort((a, b) => {
      const yearsA = Array.from(a[1]).sort()
      const yearsB = Array.from(b[1]).sort()
      return (
        yearsB[yearsB.length - 1].localeCompare(yearsA[yearsA.length - 1]) ||
        a[0].localeCompare(b[0])
      )
    })
    .map(
      ([name, yearsSet]): ListItemType => ({
        id: name,
        line1: name,
        line2: Array.from(yearsSet).sort().join(', '),
        icon: concertBoxTour,
        route: {
          pathname: '/(main)/(tabs)/fox/concerts/ConcertsVenue',
          params: { type: 'Tour', id: name },
        } as Href,
      }),
    )
})

export const concertsVenueList$ = (type?: ConcertListType, value?: string) =>
  computed<ListItemType[]>(() => {
    const data = store$.get()
    if (!data || !type || !value) return []

    return Object.values(data)
      .filter((item): item is ConcertsType & { deleted: false } => {
        if (!item || item.deleted) return false

        switch (type) {
          case 'Year':
            return String(item.setlist_eventyear) === value
          case 'Country':
            return item.setlist_venue_city_country_code === value
          case 'Tour':
            return item.setlist_tour_name === value
          default:
            return false
        }
      })
      .sort(
        (a, b) =>
          new Date(b.setlist_eventdate).getTime() -
          new Date(a.setlist_eventdate).getTime(),
      )
      .map(
        (item): ListItemType => ({
          id: item.id,
          line1:
            item.setlist_venue_city_name +
            (item.setlist_venue_name ? ' - ' + item.setlist_venue_name : ''),
          line2:
            item.setlist_eventdate +
            (item.setlist_tour_name ? ' - ' + item.setlist_tour_name : ''),
          icon: item.setlist_artwork,
          route: {
            pathname: '/(main)/(tabs)/fox/concerts/ConcertDetail',
            params: { id: item.id, setlistId: item.setlist_id },
          } as Href,
        }),
      )
  })

export const songPerformanceStats$ = (songTitle: string) =>
  computed(() => {
    const concertsData = store$.get()
    const setlistsData = setlists$.get()
    if (!concertsData || !setlistsData) return null

    const songSetlistEntries = Object.values(setlistsData).filter(
      (item): item is SetlistType & { deleted: false } =>
        !!item &&
        !item.deleted &&
        !!item.song_name &&
        item.song_name.includes(songTitle),
    )

    if (songSetlistEntries.length === 0) return null

    const matchingConcerts = songSetlistEntries
      .map(entry => {
        return Object.values(concertsData).find(
          c => c && !c.deleted && c.setlist_id === entry.setlist_id,
        )
      })
      .filter((c): c is ConcertsType => !!c)

    if (matchingConcerts.length === 0) return null

    const sortedConcerts = matchingConcerts.sort(
      (a, b) =>
        new Date(a.setlist_eventdate).getTime() -
        new Date(b.setlist_eventdate).getTime(),
    )

    const firstConcert = sortedConcerts[0]
    const lastConcert = sortedConcerts[sortedConcerts.length - 1]

    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'N/A'
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return 'N/A'
      return d.toISOString().split('T')[0]
    }

    return {
      totalLivePlays: String(matchingConcerts.length),
      firstPerformed: formatDate(firstConcert.setlist_eventdate),
      firstPerformedIn: firstConcert.setlist_venue_city_country_name,
      lastPerformed: formatDate(lastConcert.setlist_eventdate),
      lastPerformedIn: lastConcert.setlist_venue_city_country_name,
    }
  })
