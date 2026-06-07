export const SONG_QUIZ_TYPES = [
  'NEW',
  'WIN',
  'LOOSE',
  'GIVEUP',
  'TIMEOUT',
] as const
export type SongQuizType = (typeof SONG_QUIZ_TYPES)[number]

export type PlayerStats = {
  roundsPlayed: number
  correctAnswers: number
  wrongAnswers: number
  giveUps: number
  timeouts: number

  totalQuestionTimeMs: number // Sum of all question times
  totalReactionTimeMs: number // Sum of all reaction times
  reactions: number //Number of reactions (answer or give-up)

  currentStreak: number // Current consecutive correct answers
  bestStreak: number // Best consecutive correct answers ever
}
