import { computed, Observable } from '@legendapp/state'

import { VersionsType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, sync, clearCache } = createTableStore<VersionsType>({
  collection: 'gl_versions',
  actions: ['read'],
})

// Add Factory functions
export const versions$ = store$
export const versionSync = sync
export const versionClearCache = clearCache

// Domain-specific functions
export const latestVersion$ = computed(() => {
  const data = versions$.get()
  if (!data) return null

  const items = Object.values(data) as VersionsType[]
  if (items.length === 0) return null

  const latestRow = items
    .filter(v => v && !v.deleted)
    .reduce((prev, current) => {
      return prev.version_id > current.version_id ? prev : current
    })

  return latestRow?.version ?? null
}) as unknown as Observable<string | null>
