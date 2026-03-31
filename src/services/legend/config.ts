import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { configureSynced } from '@legendapp/state/sync'
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { supabase } from '@/services/supabase'

// JS UUID v4 generator to avoid issues in React Native
export const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

export const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
})
