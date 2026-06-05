import { Href } from 'expo-router'

export const CONCERT_LIST_TYPES = ['Year', 'Country', 'Tour'] as const
export type ConcertListType = (typeof CONCERT_LIST_TYPES)[number]

export const SONG_LIST_TYPES = ['Release', 'Appearance', 'Title'] as const
export type SongListType = (typeof SONG_LIST_TYPES)[number]

export const VIDEO_LIST_TYPES = ['Views', 'Newest', 'Title'] as const
export type VideoListType = (typeof VIDEO_LIST_TYPES)[number]

export type ListItemType = {
  id: string
  line1: string
  line2: string
  icon: string | number // for uri and assets
  route: Href | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
}
