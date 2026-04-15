import { Href } from 'expo-router'

export type ListItem = {
  id: string
  line1: string
  line2: string
  sorted: string
  icon: string | number // for uri and assets
  route: Href
}
