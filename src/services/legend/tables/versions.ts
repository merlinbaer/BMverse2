import { VersionsType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, sync, clearCache } = createTableStore<VersionsType>({
  collection: 'gl_versions',
  actions: ['read'],
})

// Add Factory functions
export const version$ = store$
export const versionSync = sync
export const versionClearCache = clearCache

// Domain-specific functions
