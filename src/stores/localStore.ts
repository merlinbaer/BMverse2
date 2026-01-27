import { observable } from '@legendapp/state'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { syncObservable } from '@legendapp/state/sync'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Store for local-only persisted data
export const localStore$ = observable({
  lastSync: null as string | null,
})

// By providing only 'persist' and no sync plugin, it remains local-only.
syncObservable(localStore$, {
  persist: {
    name: 'localSync',
    plugin: new ObservablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
})
