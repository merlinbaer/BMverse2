import { ProfileType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<ProfileType>({
  collection: 'gl_profiles',
  actions: ['read', 'update'],
})

// Add Factory functions
export const profile$ = store$
export const profileItem$ = item$
export const profileSync = sync
export const profileClearCache = clearCache

// Domain-specific functions
