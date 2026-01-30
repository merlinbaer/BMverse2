import { createContext } from 'react'

import {
  createStoreProfile,
  createStoreSync,
  createStoreVersion,
} from '@/stores/globalStore'

export interface StoreContextType {
  sync: ReturnType<typeof createStoreSync>
  version: ReturnType<typeof createStoreVersion>
  profile: ReturnType<typeof createStoreProfile>
}

export const StoreCache: Partial<StoreContextType> = {}

export const StoreContext = createContext<StoreContextType | null>(null)
