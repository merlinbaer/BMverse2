import { playerStats$ } from '@/services/legend'

export const initPlayerStats = () => {
  playerStats$.set({
    roundsPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    giveUps: 0,
    timeouts: 0,
    totalQuestionTimeMs: 0,
    totalReactionTimeMs: 0,
    reactions: 0,
    currentStreak: 0,
    bestStreak: 0,
  })
}

export const getMoaMessage = (songQuizState: string) => {
  if (songQuizState === 'TIMEOUT') {
    return "Time's up. No worries\nLet's try the next one."
  }
  if (songQuizState === 'LOOSE') {
    const randomMessages = [
      'Not quite right.',
      'Not this time.',
      'Nice attempt!',
      'Close.',
    ]
    return randomMessages[Math.floor(Math.random() * randomMessages.length)]
  }
  return "Oh no. Don't give up.\nKeep trying."
}

export const processLooseGame = (songQuizState: string) => {
  const current = playerStats$.peek()

  playerStats$.assign({
    roundsPlayed: (current?.roundsPlayed ?? 0) + 1,
    wrongAnswers:
      (current?.wrongAnswers ?? 0) + (songQuizState === 'LOOSE' ? 1 : 0),
    giveUps: (current?.giveUps ?? 0) + (songQuizState === 'GIVEUP' ? 1 : 0),
    timeouts: (current?.timeouts ?? 0) + (songQuizState === 'TIMEOUT' ? 1 : 0),
    reactions:
      (current?.reactions ?? 0) + (songQuizState !== 'TIMEOUT' ? 1 : 0),
    currentStreak: 0, // Reset streak on loose
  })
}

export const processWinGame = () => {
  const current = playerStats$.peek()
  const newStreak = (current?.currentStreak ?? 0) + 1

  playerStats$.assign({
    roundsPlayed: (current?.roundsPlayed ?? 0) + 1,
    correctAnswers: (current?.correctAnswers ?? 0) + 1,
    reactions: (current?.reactions ?? 0) + 1,
    currentStreak: newStreak,
    bestStreak: Math.max(current?.bestStreak ?? 0, newStreak),
  })
}
