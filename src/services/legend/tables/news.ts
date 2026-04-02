import { createTableStore } from '../createTableStore'

import type { Database } from '@/types/database.types'

type News = Database['public']['Tables']['bm_news']['Row']

// Define supabase observable
const { store$, list$, item$, add, remove, sync, clearCache } =
  createTableStore<News>({
    collection: 'bm_news',
    actions: ['read', 'create', 'update', 'delete'],
    sort: (a, b) =>
      new Date(b.news_update).getTime() - new Date(a.news_update).getTime(),
  })

// Add Factory functions
export const news$ = store$
export const newsList$ = list$
export const newsItem$ = item$
export const addNews = () => add()
export const deleteNews = remove
export const syncNews = sync
export const clearCacheNews = clearCache

// Domain-specific functions
export const updateNews = (id: string) => {
  news$[id].news_info.set('News invalidated')
}
