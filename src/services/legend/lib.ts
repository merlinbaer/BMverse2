import { syncState } from '@legendapp/state'

import { SYNC } from '@/constants/constants'
import {
  concerts$,
  concertSync,
  getsSyncUpdatedAt,
  localStore$,
  news$,
  newsSync,
  setlists$,
  setlistSync,
  songs$,
  songSync,
  sync$,
  syncSync,
  upcoming$,
  upcomingSync,
  versions$,
  versionSync,
  videos$,
  videoSync,
} from '@/services/legend'

export const initializeStores = () => {
  // Wake up table stores
  try {
    sync$.peek()
    versions$.peek()
    news$.peek()
    songs$.peek()
    concerts$.peek()
    setlists$.peek()
    upcoming$.peek()
    videos$.peek()
    console.log('LegendState: Table stores initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize table stores:', error)
  }
}

export const syncAll = async () => {
  await Promise.all([
    versionSync(),
    newsSync(),
    songSync(),
    concertSync(),
    setlistSync(),
    upcomingSync(),
    videoSync(),
  ])
}

export const startSyncCoordinator = () => {
  // Cascade on sync marker change
  const unsubscribeSync = sync$.onChange(async () => {
    const serverUpdatedAt = getsSyncUpdatedAt()
    if (!serverUpdatedAt) return

    const lastLocalSync = localStore$.lastSyncTime.get()

    if (!lastLocalSync || new Date(serverUpdatedAt) > new Date(lastLocalSync)) {
      console.log(
        `LegendState: Last server update at ${serverUpdatedAt}. Start syncing tables...`,
      )
      try {
        await syncAll()
        localStore$.lastSyncTime.set(String(serverUpdatedAt))
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
