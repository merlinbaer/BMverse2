import { generateId } from '@/services/legend/config'

import { createTableStore } from '../createTableStore'

import type { Database } from '@/types/database.types'

type News = Database['public']['Tables']['bm_news']['Row']

// Define supabase observable
const { store$, list$, item$, remove, sync, clearCache } =
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
export const newsDelete = remove
export const newsSync = sync
export const newsClearCache = clearCache

// Domain-specific functions
export const newsUpdate = (id: string) => {
  news$[id].news_info.set('News invalidated')
}

export const newsAdd2 = () => {
  const id = generateId()
  news$[id].assign({
    id,
    news_info: 'News added',
    news_update: new Date().toISOString(),
    news_updater: 'XXX',
  })
  return id
}
