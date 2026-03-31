import { createContext } from 'react'

import {
  createStoreProfile,
  createStoreSync,
  createStoreVersion,
} from '@/old/stores/globalStore'
import { createStoreNews } from '@/old/stores/newsStore'

export interface StoreContextType {
  sync: ReturnType<typeof createStoreSync>
  version: ReturnType<typeof createStoreVersion>
  profile: ReturnType<typeof createStoreProfile>
  news: ReturnType<typeof createStoreNews>
}

export const StoreCache: Partial<StoreContextType> = {}

export const StoreContext = createContext<StoreContextType | null>(null)
