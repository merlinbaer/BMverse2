import type { Database } from '@/types/database.types'

export type VersionsType = Database['public']['Tables']['gl_versions']['Row']
export type NewsType = Database['public']['Tables']['bm_news']['Row']
export type SyncType = Database['public']['Tables']['gl_sync']['Row']
export type ConcertsType =
  Database['public']['Tables']['bm_event_concert']['Row']
export type SetlistType =
  Database['public']['Tables']['bm_event_concert_songs']['Row']
export type UpcomingType =
  Database['public']['Tables']['bm_event_concert_upcoming']['Row']
export type SongType = Database['public']['Tables']['bm_songs']['Row']
