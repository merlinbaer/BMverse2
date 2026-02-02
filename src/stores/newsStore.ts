import { computed, observable } from '@legendapp/state'
import { SupabaseClient } from '@supabase/supabase-js'

import { StoreCache, StoreContextType } from '@/contexts/legendstate'
import {
  attachSyncLogger,
  clearCacheStore,
  customSynced,
  syncStore,
} from '@/services/createStore'
import { Database } from '@/types/database.types'

// --- create gl_versions store --------------------------------------
export function createStoreNews(supabase: SupabaseClient<Database>) {
  const tableName = 'bm_news'
  const data$ = observable(
    customSynced({
      supabase,
      collection: tableName,
      // use changesSince:'all' for small tables < 100 rows and more robust sync
      changesSince: 'all', // 'all' | 'last-sync'
      // use syncMode:'manual' when an event (change) should not be synced automatically
      syncMode: 'auto', // 'auto' | 'manual'
      actions: ['read'], // ['create' | 'read' | 'update' | 'delete'];
      persist: { name: tableName },
    }),
  )
  // Computed observable for a sorted array
  const news$ = computed(() => {
    const data = data$.get()
    if (!data) return []

    return Object.values(data)
      .sort((a, b) => {
        const dateA = a.news_update ? new Date(a.news_update).getTime() : 0
        const dateB = b.news_update ? new Date(b.news_update).getTime() : 0
        return dateB - dateA
      })
      .map(item => ({
        ...item,
        displayDate: item.news_update
          ? new Date(item.news_update).toLocaleDateString([], {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
          : '',
      }))
  })
  attachSyncLogger(data$, tableName)

  // noinspection JSUnusedGlobalSymbols // clearCacheNews is currently not used
  return {
    data$: data$,
    news$: news$,
    syncNews: () => syncStore(data$, tableName),
    clearCacheNews: () => clearCacheStore(data$, tableName),
  }
}

// Define getter for storeVersionInstance
export const getStoreNews = (
  supabase: SupabaseClient<Database>,
): StoreContextType['news'] => {
  if (!StoreCache.news) {
    StoreCache.news = createStoreNews(supabase)
  }
  return StoreCache.news
}
