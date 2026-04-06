import { syncState } from '@legendapp/state'

import { SYNC } from '@/constants/constants'
import {
  getsSyncUpdatedAt,
  localStore$,
  news$,
  newsSync,
  sync$,
  syncSync,
  version$,
  versionSync,
} from '@/services/legend'

export const initializeStores = () => {
  // Wake up local-only persisted stores
  try {
    localStore$.peek()
    console.log('LegendState: Local states initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize local states:', error)
  }
  // Wake up table stores
  try {
    sync$.peek()
    version$.peek()
    news$.peek()
    console.log('LegendState: Table stores initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize table stores:', error)
  }
}

export const syncAll = async () => {
  await Promise.all([versionSync(), newsSync()])
}

export const startSyncCoordinator = () => {
  // Cascade on sync marker change
  const unsubscribeSync = sync$.onChange(async () => {
    const serverUpdatedAt = getsSyncUpdatedAt()
    if (!serverUpdatedAt) return

    const lastLocalSync = localStore$.lastSync.get()

    if (!lastLocalSync || new Date(serverUpdatedAt) > new Date(lastLocalSync)) {
      console.log(
        `LegendState: Last server update at ${serverUpdatedAt}. Start syncing tables...`,
      )
      try {
        await syncAll()
        localStore$.lastSync.set(String(serverUpdatedAt))
        console.log('LegendState: Cascade sync successful.')
      } catch (err) {
        console.error('LegendState: Cascade sync failed:', err)
      }
    }
  })
  // Automated "Heartbeat" Sync
  const intervalId = setInterval(async () => {
    const state$ = syncState(sync$)
    const isReady = state$.isLoaded.get() && !state$.error.get()

    if (isReady) {
      void syncSync() // Async call
    }
  }, SYNC.REFRESH_INTERVAL)

  return () => {
    unsubscribeSync?.()
    clearInterval(intervalId)
  }
}
