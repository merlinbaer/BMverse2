export const SONG_QUIZ_TYPES = ['NEW', 'WIN', 'LOOSE'] as const
export type SongQuizType = (typeof SONG_QUIZ_TYPES)[number]
