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
      bm_songs: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          song_artist: string
          song_default_media: string | null
          song_first_appearance: string
          song_id: string
          song_info: string | null
          song_release_type: string
          song_title: string
          song_title_jp: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          song_artist: string
          song_default_media?: string | null
          song_first_appearance: string
          song_id: string
          song_info?: string | null
          song_release_type: string
          song_title: string
          song_title_jp?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          song_artist?: string
          song_default_media?: string | null
          song_first_appearance?: string
          song_id?: string
          song_info?: string | null
          song_release_type?: string
          song_title?: string
          song_title_jp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gl_profiles: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          last_seen_at: string | null
          updated_at: string
          user_country: string | null
          user_email: string
          user_name: string | null
          user_role: Database['public']['Enums']['user_role']
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id: string
          last_seen_at?: string | null
          updated_at?: string
          user_country?: string | null
          user_email: string
          user_name?: string | null
          user_role?: Database['public']['Enums']['user_role']
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          last_seen_at?: string | null
          updated_at?: string
          user_country?: string | null
          user_email?: string
          user_name?: string | null
          user_role?: Database['public']['Enums']['user_role']
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
          updater: string
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
      gl_versions: {
        Row: {
          created_at: string
          deleted: boolean | null
          id: string
          updated_at: string
          version: string
          version_info: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          version: string
          version_info: string
        }
        Update: {
          created_at?: string
          deleted?: boolean | null
          id?: string
          updated_at?: string
          version?: string
          version_info?: string
        }
        Relationships: []
      }
    }
    Views: {
      gl_version_view: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          id: string | null
          updated_at: string | null
          version: string | null
          version_info: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
      is_public_user: { Args: never; Returns: boolean }
      update_last_seen: { Args: never; Returns: undefined }
    }
    Enums: {
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
      user_role: ['user', 'admin', 'moderator'],
    },
  },
} as const
