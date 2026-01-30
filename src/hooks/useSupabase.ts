import { useContext } from 'react'

import { SupabaseContext } from '@/contexts/supabase'

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used within AuthProvider')
  return context
}
