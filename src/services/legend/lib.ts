import { syncState } from '@legendapp/state'

import { getTimestamp } from '@/services/dateTimeHelper'
import {
  concertClearCache,
  concerts$,
  concertSync,
  getsSyncUpdatedAt,
  localStore$,
  news$,
  newsClearCache,
  newsSync,
  profile$,
  profileClearCache,
  profileSync,
  setlistClearCache,
  setlists$,
  setlistSync,
  songClearCache,
  songs$,
  songSync,
  sync$,
  syncRefresh$,
  syncSync,
  upcoming$,
  upcomingClearCache,
  upcomingSync,
  versionClearCache,
  versions$,
  versionSync,
  videoClearCache,
  videos$,
  videoSync,
} from '@/services/legend'

export const initializeStores = () => {
  // Wake up table stores
  try {
    sync$.peek()
    versions$.peek()
    profile$.peek()
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
  const syncs: Promise<void>[] = [
    versionSync(),
    profileSync(),
    newsSync(),
    songSync(),
    concertSync(),
    setlistSync(),
    upcomingSync(),
    videoSync(),
  ]
  await Promise.all(syncs)
}

export const clearCacheAll = async () => {
  const clears: Promise<void>[] = [
    versionClearCache(),
    profileClearCache(),
    newsClearCache(),
    songClearCache(),
    concertClearCache(),
    setlistClearCache(),
    upcomingClearCache(),
    videoClearCache(),
  ]
  await Promise.all(clears)
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

  let intervalId: ReturnType<typeof setInterval> | null = null

  const setupHeartbeat = (seconds: number) => {
    if (intervalId) clearInterval(intervalId)
    console.log(
      `LegendState (${getTimestamp()}): Heartbeat started with ${seconds}s interval.`,
    )
    intervalId = setInterval(async () => {
      const state$ = syncState(sync$)
      const isReady = state$.isLoaded.get() && !state$.error.get()

      if (isReady) {
        void syncSync() // Async call
      }
    }, seconds * 1000)
  }

  // Initial setup
  setupHeartbeat(syncRefresh$.peek())

  // Restart heartbeat when syncRefresh$ changes
  const unsubscribeRefresh = syncRefresh$.onChange(({ value }) => {
    console.log(`LegendState: Sync interval changed. Restarting heartbeat...`)
    setupHeartbeat(value)
  })

  return () => {
    unsubscribeSync?.()
    unsubscribeRefresh?.()
    if (intervalId) clearInterval(intervalId)
  }
}
