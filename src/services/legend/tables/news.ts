import { generateId } from '@/services/legend/config'
import { NewsType } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, list$, item$, remove, sync, clearCache } =
  createTableStore<NewsType>({
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

export const newsAdd = () => {
  const id = generateId()
  news$[id].assign({
    id,
    news_info: 'News added',
    news_update: new Date().toISOString(),
    news_updater: 'user', // Will be overwritten in insert in database
  })
  return id
}
