import { useContext } from 'react'

import { SupabaseContext } from '@/components/AuthProvider'

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used within AuthProvider')
  return context
}
