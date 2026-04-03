import { syncState } from '@legendapp/state'

import { SYNC } from '@/constants/constants'
import {
  localStore$,
  newsSync,
  sync$,
  syncSync,
  versionSync,
} from '@/services/legend'
import { Database } from '@/types/database.types'

export const startSyncCoordinator = () => {
  type SyncRow = Database['public']['Tables']['gl_sync']['Row']
  type SyncCollection = Record<string, SyncRow>

  const getSyncRow = (value?: SyncCollection) => {
    const rows = Object.values(value ?? {})
    return rows.find(row => row?.sync_id === 1) ?? rows[0]
  }

  // Cascade on sync marker change
  const unsubscribeSync = sync$.onChange(async ({ value }) => {
    const row = getSyncRow(value as SyncCollection | undefined)
    if (!row?.updated_at) return

    const serverUpdatedAt = row.updated_at
    const lastLocalSync = localStore$.lastSync.get()

    if (!lastLocalSync || new Date(serverUpdatedAt) > new Date(lastLocalSync)) {
      console.log(
        `LegendState: Last server update at ${serverUpdatedAt}. Start syncing tables...`,
      )
      try {
        await versionSync()
        await newsSync()
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
      // console.log('LegendState: Heartbeat trigger - checking for updates...')
      // Above log is not needed "Sync for gl_sync called" is shown in syncSync
      try {
        await syncSync()
      } catch {
        // Already? handled by global onError and internal syncSync catch
      }
    }
  }, SYNC.REFRESH_INTERVAL)

  return () => {
    unsubscribeSync?.()
    clearInterval(intervalId)
  }
}
