import type { Database } from '@/types/database.types'

export type VersionsType = Database['public']['Tables']['gl_versions']['Row']
export type NewsType = Database['public']['Tables']['bm_news']['Row']
export type SyncType = Database['public']['Tables']['gl_sync']['Row']
