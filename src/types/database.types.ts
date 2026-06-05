export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bm_event_concert: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          setlist_artist_mbid: string
          setlist_artist_name: string
          setlist_artist_sortname: string | null
          setlist_artist_url: string | null
          setlist_artwork: string
          setlist_eventdate: string
          setlist_eventyear: number
          setlist_id: string
          setlist_info: string | null
          setlist_lastupdated: string | null
          setlist_tour_name: string | null
          setlist_url: string | null
          setlist_venue_city_coords_lat: number | null
          setlist_venue_city_coords_long: number | null
          setlist_venue_city_country_code: string
          setlist_venue_city_country_name: string
          setlist_venue_city_id: string | null
          setlist_venue_city_name: string
          setlist_venue_city_state: string | null
          setlist_venue_city_statecode: string | null
          setlist_venue_id: string | null
          setlist_venue_name: string | null
          setlist_venue_url: string | null
          setlist_versionid: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_artist_mbid: string
          setlist_artist_name: string
          setlist_artist_sortname?: string | null
          setlist_artist_url?: string | null
          setlist_artwork: string
          setlist_eventdate: string
          setlist_eventyear: number
          setlist_id: string
          setlist_info?: string | null
          setlist_lastupdated?: string | null
          setlist_tour_name?: string | null
          setlist_url?: string | null
          setlist_venue_city_coords_lat?: number | null
          setlist_venue_city_coords_long?: number | null
          setlist_venue_city_country_code: string
          setlist_venue_city_country_name: string
          setlist_venue_city_id?: string | null
          setlist_venue_city_name: string
          setlist_venue_city_state?: string | null
          setlist_venue_city_statecode?: string | null
          setlist_venue_id?: string | null
          setlist_venue_name?: string | null
          setlist_venue_url?: string | null
          setlist_versionid?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_artist_mbid?: string
          setlist_artist_name?: string
          setlist_artist_sortname?: string | null
          setlist_artist_url?: string | null
          setlist_artwork?: string
          setlist_eventdate?: string
          setlist_eventyear?: number
          setlist_id?: string
          setlist_info?: string | null
          setlist_lastupdated?: string | null
          setlist_tour_name?: string | null
          setlist_url?: string | null
          setlist_venue_city_coords_lat?: number | null
          setlist_venue_city_coords_long?: number | null
          setlist_venue_city_country_code?: string
          setlist_venue_city_country_name?: string
          setlist_venue_city_id?: string | null
          setlist_venue_city_name?: string
          setlist_venue_city_state?: string | null
          setlist_venue_city_statecode?: string | null
          setlist_venue_id?: string | null
          setlist_venue_name?: string | null
          setlist_venue_url?: string | null
          setlist_versionid?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bm_event_concert_songs: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          setlist_id: string
          setlist_versionid: string
          song_artwork: string | null
          song_encore: boolean
          song_info: string | null
          song_name: string | null
          song_name_original: string
          song_nr: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_id: string
          setlist_versionid: string
          song_artwork?: string | null
          song_encore: boolean
          song_info?: string | null
          song_name?: string | null
          song_name_original: string
          song_nr: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_id?: string
          setlist_versionid?: string
          song_artwork?: string | null
          song_encore?: boolean
          song_info?: string | null
          song_name?: string | null
          song_name_original?: string
          song_nr?: number
          updated_at?: string
        }
        Relationships: []
      }
      bm_event_concert_upcoming: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          setlist_artist_mbid: string
          setlist_artist_name: string
          setlist_artist_sortname: string | null
          setlist_artist_url: string | null
          setlist_artwork: string
          setlist_eventdate: string
          setlist_eventyear: number
          setlist_id: string
          setlist_info: string | null
          setlist_lastupdated: string | null
          setlist_tour_name: string | null
          setlist_url: string | null
          setlist_venue_city_coords_lat: number | null
          setlist_venue_city_coords_long: number | null
          setlist_venue_city_country_code: string
          setlist_venue_city_country_name: string
          setlist_venue_city_id: string | null
          setlist_venue_city_name: string
          setlist_venue_city_state: string | null
          setlist_venue_city_statecode: string | null
          setlist_venue_id: string | null
          setlist_venue_name: string | null
          setlist_venue_url: string | null
          setlist_versionid: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_artist_mbid: string
          setlist_artist_name: string
          setlist_artist_sortname?: string | null
          setlist_artist_url?: string | null
          setlist_artwork: string
          setlist_eventdate: string
          setlist_eventyear: number
          setlist_id: string
          setlist_info?: string | null
          setlist_lastupdated?: string | null
          setlist_tour_name?: string | null
          setlist_url?: string | null
          setlist_venue_city_coords_lat?: number | null
          setlist_venue_city_coords_long?: number | null
          setlist_venue_city_country_code: string
          setlist_venue_city_country_name: string
          setlist_venue_city_id?: string | null
          setlist_venue_city_name: string
          setlist_venue_city_state?: string | null
          setlist_venue_city_statecode?: string | null
          setlist_venue_id?: string | null
          setlist_venue_name?: string | null
          setlist_venue_url?: string | null
          setlist_versionid?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          setlist_artist_mbid?: string
          setlist_artist_name?: string
          setlist_artist_sortname?: string | null
          setlist_artist_url?: string | null
          setlist_artwork?: string
          setlist_eventdate?: string
          setlist_eventyear?: number
          setlist_id?: string
          setlist_info?: string | null
          setlist_lastupdated?: string | null
          setlist_tour_name?: string | null
          setlist_url?: string | null
          setlist_venue_city_coords_lat?: number | null
          setlist_venue_city_coords_long?: number | null
          setlist_venue_city_country_code?: string
          setlist_venue_city_country_name?: string
          setlist_venue_city_id?: string | null
          setlist_venue_city_name?: string
          setlist_venue_city_state?: string | null
          setlist_venue_city_statecode?: string | null
          setlist_venue_id?: string | null
          setlist_venue_name?: string | null
          setlist_venue_url?: string | null
          setlist_versionid?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bm_news: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          news_info: string
          news_update: string
          news_updater: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          news_info?: string
          news_update?: string
          news_updater: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          news_info?: string
          news_update?: string
          news_updater?: string
          updated_at?: string
        }
        Relationships: []
      }
      bm_songs: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          song_album_name: string | null
          song_album_type: string
          song_artist: string
          song_default_cover: string
          song_first_appearance: string
          song_id: string
          song_info: string | null
          song_lyrics_en: string | null
          song_lyrics_jp: string | null
          song_lyrics_rom: string | null
          song_preview: string | null
          song_preview_artwork: string | null
          song_preview_uri: string | null
          song_release_year: string | null
          song_title: string
          song_title_jp: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          song_album_name?: string | null
          song_album_type?: string
          song_artist: string
          song_default_cover: string
          song_first_appearance: string
          song_id: string
          song_info?: string | null
          song_lyrics_en?: string | null
          song_lyrics_jp?: string | null
          song_lyrics_rom?: string | null
          song_preview?: string | null
          song_preview_artwork?: string | null
          song_preview_uri?: string | null
          song_release_year?: string | null
          song_title: string
          song_title_jp?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          song_album_name?: string | null
          song_album_type?: string
          song_artist?: string
          song_default_cover?: string
          song_first_appearance?: string
          song_id?: string
          song_info?: string | null
          song_lyrics_en?: string | null
          song_lyrics_jp?: string | null
          song_lyrics_rom?: string | null
          song_preview?: string | null
          song_preview_artwork?: string | null
          song_preview_uri?: string | null
          song_release_year?: string | null
          song_title?: string
          song_title_jp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bm_videos: {
        Row: {
          channel_artwork: string
          channel_customurl: string | null
          channel_decription: string
          channel_id: string
          channel_title: string
          channel_type: string
          created_at: string
          deleted: boolean | null
          id: string
          updated_at: string
          video_artwork: string
          video_commentcount: number
          video_description: string | null
          video_duration: string
          video_id: string
          video_likecount: number
          video_publishedat: string
          video_song: string | null
          video_title: string
          video_title_original: string
          video_viewcount: number
        }
        Insert: {
          channel_artwork: string
          channel_customurl?: string | null
          channel_decription: string
          channel_id: string
          channel_title: string
          channel_type: string
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          video_artwork: string
          video_commentcount: number
          video_description?: string | null
          video_duration: string
          video_id: string
          video_likecount: number
          video_publishedat: string
          video_song?: string | null
          video_title: string
          video_title_original: string
          video_viewcount: number
        }
        Update: {
          channel_artwork?: string
          channel_customurl?: string | null
          channel_decription?: string
          channel_id?: string
          channel_title?: string
          channel_type?: string
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          video_artwork?: string
          video_commentcount?: number
          video_description?: string | null
          video_duration?: string
          video_id?: string
          video_likecount?: number
          video_publishedat?: string
          video_song?: string | null
          video_title?: string
          video_title_original?: string
          video_viewcount?: number
        }
        Relationships: []
      }
      gl_profiles: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          updated_at: string
          user_email: string
          user_name: string | null
          user_region: Database['public']['Enums']['user_region']
          user_role: Database['public']['Enums']['user_role']
          user_store: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id: string
          updated_at?: string
          user_email: string
          user_name?: string | null
          user_region?: Database['public']['Enums']['user_region']
          user_role?: Database['public']['Enums']['user_role']
          user_store?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          user_email?: string
          user_name?: string | null
          user_region?: Database['public']['Enums']['user_region']
          user_role?: Database['public']['Enums']['user_role']
          user_store?: string
        }
        Relationships: []
      }
      gl_sync: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          sync_id: number
          updated_at: string
          updater: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          sync_id?: number
          updated_at?: string
          updater?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          sync_id?: number
          updated_at?: string
          updater?: string
        }
        Relationships: []
      }
      gl_users: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          last_seen_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id: string
          last_seen_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          last_seen_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gl_versions: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          updated_at: string
          version: string
          version_id: number
          version_info: string | null
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          version: string
          version_id?: number
          version_info?: string | null
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          version?: string
          version_id?: number
          version_info?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
      is_public_user: { Args: never; Returns: boolean }
      update_last_seen: { Args: never; Returns: undefined }
    }
    Enums: {
      user_region:
        | 'UNKN'
        | 'JPAN'
        | 'NOAM'
        | 'LATM'
        | 'EURO'
        | 'UKIE'
        | 'EASI'
        | 'SEAS'
        | 'OCEA'
        | 'MEAF'
      user_role: 'user' | 'admin' | 'moderator'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_region: [
        'UNKN',
        'JPAN',
        'NOAM',
        'LATM',
        'EURO',
        'UKIE',
        'EASI',
        'SEAS',
        'OCEA',
        'MEAF',
      ],
      user_role: ['user', 'admin', 'moderator'],
    },
  },
} as const
