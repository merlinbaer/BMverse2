/**
 * Returns local time in format: YYYY-MM-DD HH:MM:SS
 */
export const getPlaylistTimestamp = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Returns the current local time formatted as HH:MM:SS
 */
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

/**
 * Formats a date string to a localized short date (e.g. DD/MM/YY or MM/DD/YY depending on locale)
 */
export const formatShortDate = (
  dateStr: string | null | undefined,
  locales: string | string[] = [],
): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString(locales, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

/**
 * Formats an ISO date/time string to YYYY-MM-DD HH:MM
 */
export const formatDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return ''
  return dateStr.replace('T', ' ').substring(0, 16)
}

/**
 * Formats a date string to standard ISO date (YYYY-MM-DD)
 */
export const formatDateOnly = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A'
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'N/A'
  return date.toISOString().split('T')[0]
}
