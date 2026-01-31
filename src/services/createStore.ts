import { Observable, syncState, when } from '@legendapp/state'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { v4 as uuid4 } from 'uuid'

const generateId = () => uuid4()

export const customSynced = configureSynced(syncedSupabase, {
  fieldId: 'id',
  generateId,
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
  realtime: false,
})

export const attachSyncLogger = (
  store$: Observable<unknown>,
  tableName: string,
) => {
  const state = syncState(store$)
  state.lastSync?.onChange?.(({ value }) => {
    if (!value) {
      console.log(`LegendState: No lastSync of ${tableName}`)
    } else {
      const iso = new Date(value).toISOString()
      console.log(`LegendState: LastSync of ${tableName} changed to ${iso}-UTC`)
    }
  })
}

export const attachUpdateLogger = (
  store$: Observable<unknown>,
  tableName: string,
) => {
  const state$ = syncState(store$)
  state$.onChange(({ value, getPrevious }) => {
    const prev = getPrevious()
    // 1. We only care about updates happening AFTER an initial load
    if (!value.isLoaded) return
    // 2. Detect the transition from 'Setting' to 'Idle'
    const wasSetting = prev?.isSetting === true
    const isNotSetting = value.isSetting === false
    // 3. Ensure there are no more changes waiting in the queue
    const nothingPending = value.numPendingSets === 0

    if (wasSetting && isNotSetting && nothingPending) {
      console.log(
        `LegendState: ${tableName} update successful and confirmed by Supabase!`,
      )
    }
  })
}

export const syncStore = async (
  store$: Observable<unknown>,
  tableName: string,
) => {
  await when(syncState(store$).isPersistLoaded)
  try {
    await syncState(store$).sync()
    console.log(`LegendState: Sync for ${tableName} called`)
  } catch (err) {
    console.error(`LegendState: Sync ${tableName} failed:`, err)
  }
}

export const clearCacheStore = async (
  store$: Observable<unknown>,
  tableName: string,
) => {
  try {
    await syncState(store$).clearPersist()
    syncState(store$).reset?.()
    console.log(`LegendState: ${tableName} cache cleared.`)
  } catch (err) {
    console.warn(`LegendState: Failed to clear ${tableName} cache:`, err)
  } finally {
    console.log(`LegendState: Finally ${tableName}`)
  }
}
