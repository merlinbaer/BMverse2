/* eslint-disable no-restricted-globals */

// Core cache for the HTML shell, Asset cache for JS/Images/Fonts
const CORE_CACHE = 'bmverse-core-v2'
const ASSET_CACHE = 'bmverse-assets-v2'

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/splash-icon.png',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then(cache =>
        Promise.allSettled(
          PRECACHE_URLS.map(url => cache.add(url).catch(() => null)),
        ),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  self.clients.claim()
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CORE_CACHE && key !== ASSET_CACHE)
            .map(key => caches.delete(key)),
        ),
      ),
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const requestUrl = new URL(request.url) // Renamed to avoid confusion

  // 1. Navigation strategy (HTML Shell)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  // 2. Resource strategy (JS, Images, Fonts)
  // Consolidating all logic here to prevent "respondWith already called" error
  const isInternal = requestUrl.origin === self.location.origin
  const isImage = request.destination === 'image'
  const isFont =
    request.destination === 'font' || requestUrl.pathname.endsWith('.ttf')
  const isJS = isInternal && requestUrl.pathname.endsWith('.js')

  if (isImage || isFont || isJS) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // Return cached version if exists
        if (cachedResponse) return cachedResponse

        // Otherwise fetch and cache
        return fetch(request)
          .then(networkResponse => {
            // Allow status 0 for opaque YouTube/Google images
            const isValid =
              networkResponse.status === 200 || networkResponse.status === 0
            if (!isValid) return networkResponse

            const responseToCache = networkResponse.clone()
            caches.open(ASSET_CACHE).then(cache => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              cache.put(request, responseToCache)
            })
            return networkResponse
          })
          .catch(() => caches.match(request))
      }),
    )
  }
})
