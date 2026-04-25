import { Href } from 'expo-router'

export const LIST_TYPES = ['Year', 'Country', 'Tour', 'Setlist'] as const
export type ListType = (typeof LIST_TYPES)[number]

export type ListItem = {
  id: string
  line1: string
  line2: string
  sorted: string
  icon: string | number // for uri and assets
  route: Href
}
