import { computed } from '@legendapp/state'

import concertBoxTour from '@/../assets/images/concert_box_tour.png'
import concertBoxYear from '@/../assets/images/concert_box_year.png'
import { ListItem } from '@/types/list'
import { ConcertsType } from '@/types/tables'

import { createTableStore } from '../factory'

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
export const concertsItem$ = item$
export const concertsSync = sync
export const concertsClearCache = clearCache

// Domain-specific functions
export const concertsYearsList$ = computed(() => {
  const data = store$.get()
  if (!data) return []

  const yearsMap = Object.values(data).reduce((acc, item) => {
    if (item && !item.deleted) {
      const year = String(item.setlist_eventyear)
      acc.set(year, (acc.get(year) || 0) + 1)
    }
    return acc
  }, new Map<string, number>())

  return Array.from(yearsMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(
      ([year, count]): ListItem => ({
        id: year,
        line1: year,
        line2: String(count) + ' concerts performed',
        sorted: year,
        icon: concertBoxYear, //'https://flagsapi.com/JP/shiny/64.png',
        route: '/(main)/(tabs)/fox/concerts/ConcertsYear',
      }),
    )
})

export const concertsCountriesList$ = computed(() => {
  const data = store$.get()
  if (!data) return []

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

  return Array.from(countriesMap.entries())
    .map(
      ([code, details]): ListItem => ({
        id: code,
        line1: details.name,
        line2: Array.from(details.years)
          .sort((a, b) => a.localeCompare(b))
          .join(', '),
        sorted: details.name,
        icon: 'https://flagsapi.com/' + code + '/shiny/64.png',
        route: '/(main)/(tabs)/fox/concerts/ConcertsYear',
      }),
    )
    .sort((a, b) => a.line1.localeCompare(b.line1))
})

export const concertsToursList$ = computed(() => {
  const data = store$.get()
  if (!data) return []

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

  return Array.from(toursMap.entries())
    .map(([name, yearsSet]): ListItem => {
      const sortedYears = Array.from(yearsSet).sort((a, b) =>
        a.localeCompare(b),
      )
      return {
        id: name,
        line1: name,
        line2: sortedYears.join(', '),
        sorted: sortedYears[sortedYears.length - 1] || '',
        icon: concertBoxTour,
        route: '/(main)/(tabs)/fox/concerts/ConcertsYear',
      }
    })
    .sort((a, b) => b.sorted.localeCompare(a.sorted))
})

export const concertsList$ = (
  type?: 'year' | 'code' | 'tour',
  value?: string,
) =>
  computed(() => {
    const data = store$.get()
    if (!data) return []

    return Object.values(data)
      .filter(item => {
        if (!item || item.deleted) return false
        if (!type || !value) return true

        switch (type) {
          case 'year':
            return String(item.setlist_eventyear) === value
          case 'code':
            return item.setlist_venue_city_country_code === value
          case 'tour':
            return item.setlist_tour_name === value
          default:
            return true
        }
      })
      .sort(
        (a, b) =>
          new Date(a.setlist_eventdate).getTime() -
          new Date(b.setlist_eventdate).getTime(),
      )
  })
