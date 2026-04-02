import { createTableStore } from '../createTableStore'

import type { Database } from '@/types/database.types'

type Versions = Database['public']['Tables']['gl_versions']['Row']

// Define supabase observable
const { store$, sync, clearCache } = createTableStore<Versions>({
  collection: 'gl_versions',
  actions: ['read'],
})

// Add Factory functions
export const version$ = store$
export const syncVersion = sync
export const clearCacheVersion = clearCache
