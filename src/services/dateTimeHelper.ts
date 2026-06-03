export const getTimestamp = () => {
  const now = new Date()
  return (
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0') +
    ':' +
    now.getSeconds().toString().padStart(2, '0')
  )
}

/**
 * Formats a duration in seconds to a string (M:SS)
 */
export const formatAudioTime = (secondsTotal: number | undefined | null) => {
  if (!secondsTotal || isNaN(secondsTotal)) return '0:00'

  const minutes = Math.floor(secondsTotal / 60)
  const seconds = Math.floor(secondsTotal % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
