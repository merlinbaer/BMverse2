import { observable } from '@legendapp/state'

// Reactive auth state — subscribe with useValue(authUser$) in any component
export const authUser$ = observable<string | null>(null)
