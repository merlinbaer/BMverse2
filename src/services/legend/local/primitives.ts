import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'

import { persistLargeStore } from '@/services/legend/config'

// Store for local-only persisted data
export const localStore$ = observable({
  lastSyncTime: null as string | null,
  isOnboarding: true,
})

// Use the same 'persistLargeStore' (IndexedDB/SQLite) as your tables
syncObservable(localStore$, {
  persist: {
    name: 'localStore',
    plugin: persistLargeStore,
    retrySync: true,
  },
})

console.log('LegendState: Local store initialized.')
