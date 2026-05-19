import { observable } from '@legendapp/state'

import { SongListType } from '@/types/list'

// Reactive auth states
export const authUser$ = observable<string | null>(null)
export const isAuthLoaded$ = observable(false) // New: Track hydration
// States for list sorts
export const songSort$ = observable<SongListType>('Release')
