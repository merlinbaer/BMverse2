import { SupabaseContext } from '@/components/AuthProviderTmp'
import { useContext } from 'react'

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used within AuthProvider')
  return context
}
