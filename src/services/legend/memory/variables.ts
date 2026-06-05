import { observable } from '@legendapp/state'

import { SongQuizType } from '@/types/games'
import { SongListType, VideoListType } from '@/types/list'
import { PreviewSong } from '@/types/player'
import { User } from '@/types/user'

// Reactive auth states
export const authUser$ = observable<User | null>(null)
export const isAuthLoaded$ = observable(false) // New: Track hydration
// States for list sorts
export const songSort$ = observable<SongListType>('Release')
export const videoSort$ = observable<VideoListType>('Views')
//Sync state
export const syncRefresh$ = observable<number>(60) // 1-minute
// audio player state
export const activePreviewSong$ = observable<PreviewSong | null>(null)
// game state
export const songQuiz$ = observable<SongQuizType>('NEW')
