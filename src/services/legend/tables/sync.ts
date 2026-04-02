import { createTableStore } from '../createTableStore'

import type { Database } from '@/types/database.types'

type Sync = Database['public']['Tables']['gl_sync']['Row']

// Define supabase observable
const { store$, sync, clearCache } = createTableStore<Sync>({
  collection: 'gl_sync',
  actions: ['read'],
})

// Add Factory functions
export const sync$ = store$
export const syncSync = sync
export const clearCacheSync = clearCache
