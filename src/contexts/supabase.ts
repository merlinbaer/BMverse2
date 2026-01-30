import { Session, SupabaseClient } from '@supabase/supabase-js'
import { createContext } from 'react'

import { Database } from '@/types/database.types'

interface SupabaseContextType {
  supabase: SupabaseClient<Database>
  session: Session | null
  restoring: boolean
}

export const SupabaseContext = createContext<SupabaseContextType | null>(null)
