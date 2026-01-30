import { useContext } from 'react'

import { StoreContext } from '@/contexts/legendstate'

// Define hook for storeSyncInstance
export const useStoreSync = () => {
  const context = useContext(StoreContext)
  if (!context)
    throw new Error('useStoreSync must be used within GlobalStoreProvider')
  return context.sync
}

// Define hook for storeVersionInstance
export const useStoreVersion = () => {
  const context = useContext(StoreContext)
  if (!context)
    throw new Error('useStoreVersion must be used within GlobalStoreProvider')
  return context.version
}

// Define hook for storeProfileInstance
export const useStoreProfile = () => {
  const context = useContext(StoreContext)
  if (!context)
    throw new Error('useStoreProfile must be used within GlobalStoreProvider')
  return context.profile
}
