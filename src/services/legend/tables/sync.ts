import { SyncType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, list$, sync, clearCache } = createTableStore<SyncType>({
  collection: 'gl_sync',
  actions: ['read'],
})

// Add Factory functions
export const sync$ = store$
export const syncSync = sync
export const syncClearCache = clearCache

// Domain-specific functions
export const getsSyncUpdatedAt = () => {
  return list$.get()[0]?.updated_at
}
