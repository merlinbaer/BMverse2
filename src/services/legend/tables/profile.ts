import { computed } from '@legendapp/state'

import { authUser$ } from '@/services/legend'
import { ProfileType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<ProfileType>({
  collection: 'gl_profiles',
  actions: ['read', 'update'],
  filter: select => {
    const user = authUser$.get()
    return select.eq('id', user?.id)
  },
})

// Add Factory functions
export const profile$ = store$
export const profileItem$ = item$
export const profileSync = sync
export const profileClearCache = clearCache

// Domain-specific functions
export const myProfile$ = computed(() => {
  const user = authUser$.get()
  if (!user?.id) return null
  return profileItem$(user.id).get()
})
