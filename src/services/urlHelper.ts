/**
 * Returns the domain part of a URL (e.g., ticketmaster.evyy.net)
 */
export const getDomainFromUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split(/[/?#]/)[0]
}
