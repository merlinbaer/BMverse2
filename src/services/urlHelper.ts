/**
 * Returns the domain part of a URL (e.g., ticketmaster.evyy.net)
 */
export const getDomainFromUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split(/[/?#]/)[0]
}

/**
 * Checks if a value is a valid URL string with a protocol
 */
export const isValidUrl = (url: any): boolean => {
  if (typeof url !== 'string') return false
  const lowerUrl = url.toLowerCase()
  return (
    lowerUrl.startsWith('http://') ||
    lowerUrl.startsWith('https://') ||
    lowerUrl.startsWith('file://') ||
    lowerUrl.startsWith('content://') ||
    lowerUrl.startsWith('data:')
  )
}
