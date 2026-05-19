import { Href } from 'expo-router'

export const CONCERT_LIST_TYPES = ['Year', 'Country', 'Tour'] as const
export type ConcertListType = (typeof CONCERT_LIST_TYPES)[number]

export const SONG_LIST_TYPES = ['Release', 'Appearance', 'Title'] as const
export type SongListType = (typeof SONG_LIST_TYPES)[number]

export type ListItemType = {
  id: string
  line1: string
  line2: string
  icon: string | number // for uri and assets
  route: Href | null
}
