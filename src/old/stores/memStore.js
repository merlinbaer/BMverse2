import { observable } from '@legendapp/state'

// Store for in-memory only data (cleared on app restart)
export const memStore$ = observable({
  isSyncing: false,
  lastError: null,
})
