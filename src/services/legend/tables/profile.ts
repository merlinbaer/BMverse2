import { ProfileType, UserRegion } from '@/types/tables'

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
export const profileRegionUpdate = (id: string, region: UserRegion) => {
  profile$[id].user_region.set(region)
}

export const profileUsernameUpdate = (id: string, name: string) => {
  profile$[id].user_name.set(name)
}
