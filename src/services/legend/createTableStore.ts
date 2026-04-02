/* eslint-disable @typescript-eslint/no-explicit-any */
// Need to suppress any warnings due to Legend State v3 beta generic limitations:
// RecursiveValueOrFunction<T> on the callback and missing string index signature on the observable proxy
import {
  computed,
  Observable,
  observable,
  syncState,
  when,
} from '@legendapp/state'

import { customSynced, generateId } from './config'

// Only the four columns guaranteed on every table
interface BaseRow {
  id: string
  created_at: string
  updated_at: string
  deleted: boolean | null
}

// Observable supabase config template
interface TableConfig<T extends BaseRow> {
  collection: string
  /** CRUD actions to enable. Default: read-only */
  actions?: ('read' | 'create' | 'update' | 'delete')[]
  /** Incremental sync strategy. Default: 'all' */
  changesSince?: 'all' | 'last-sync'
  /** Custom sort for the list$. Default: newest created_at first */
  sort?: (a: T, b: T) => number
}

// Main call to factory (with defaults when not passed)
export function createTableStore<T extends BaseRow>(config: TableConfig<T>) {
  const {
    collection,
    actions = ['read'] as const,
    changesSince = 'all',
    sort = (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  } = config
  // Create supabase observable
  const store$ = observable<Record<string, T>>(
    customSynced({
      collection,
      actions,
      realtime: false,
      persist: { name: collection, retrySync: true },
      changesSince,
      syncMode: 'auto', // 'auto' | 'manual'
      retry: {
        infinite: true,
        backoff: 'exponential', //  "constant" | "exponential"
        delay: 1000, // 1000 ms = 1 second
        maxDelay: 1000 * 128, // ~2 min
      },
    }),
  )
  // Computed array filtered deleted entries & sorted
  const list$ = computed((() => {
    const data = store$.get()
    if (!data) return [] as T[]
    return (Object.values(data) as T[])
      .filter((item): item is T => !!item && !item.deleted)
      .sort(sort)
  }) as any) as unknown as Observable<T[]>

  // Computed single row of table
  const item$ = (id: string) =>
    computed((() => {
      const item = (store$ as any)[id].get() as T | undefined
      return !item || item.deleted ? null : item
    }) as any) as unknown as Observable<T | null>

  // Add row
  const add = (defaults?: Partial<T>) => {
    const id = generateId()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(store$ as any)[id].assign({ id, ...defaults } as Partial<T>)
    return id
  }
  // Delete row (does only flag deleted in supabase)
  const remove = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(store$ as any)[id].delete()
  }
  // Sync from supabase
  const sync = async () => {
    await when(syncState(store$).isPersistLoaded)
    try {
      await syncState(store$).sync()
      console.log(`LegendState: Sync for ${collection} called`)
    } catch (err) {
      console.error(`LegendState: Sync for ${collection} failed:`, err)
    }
  }
  // Delete local async cache and sync new (sync type is depending on changesSince)
  const clearCache = async () => {
    try {
      await syncState(store$).clearPersist()
      await syncState(store$).reset?.()
      console.log(`LegendState: ${collection} cache cleared.`)
    } catch (err) {
      console.warn(`LegendState: Failed to clear ${collection} cache:`, err)
    } finally {
      await sync()
    }
  }
  // Sync state logger. Information when the last sync date has changed.
  const state = syncState(store$)
  state.lastSync?.onChange?.(({ value }) => {
    if (!value) {
      console.log(`LegendState: No lastSync of ${collection}`)
    } else {
      const iso = new Date(value).toISOString()
      console.log(
        `LegendState: LastSync of ${collection} changed to ${iso}-UTC`,
      )
    }
  })
  // CRUD listener with self-healing. Refetch added rows when sync is stuck.
  // Legend-State bug in sync mechanism
  state.onChange(({ value, getPrevious }) => {
    const prev = getPrevious()
    if (!value.isLoaded) return
    const wasSetting = prev?.isSetting === true
    const isNotSetting = value.isSetting === false
    const nothingPending = value.numPendingSets === 0

    if (wasSetting && isNotSetting && nothingPending) {
      console.log(`LegendState: Changes of ${collection} synced to database.`)
      const data = store$.peek()
      if (!data) return
      const hasStaleItems = (Object.values(data) as T[]).some(
        item => item && !item.created_at,
      )
      if (hasStaleItems) {
        console.log(
          `LegendState: Missing values in ${collection} detected. Fetching...`,
        )
        syncState(store$).sync().then()
      }
    }
  })
  return { store$, list$, item$, add, remove, sync, clearCache }
}
