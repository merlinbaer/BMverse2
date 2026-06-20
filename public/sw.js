/* eslint-disable no-restricted-globals */

// Core cache for the HTML shell, Asset cache for JS/Images
const CORE_CACHE = 'bmverse-core-v2' // Incremented version
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
  const url = new URL(request.url)

  // 1. Navigation strategy (HTML Shell)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  // 2. Combined Asset Strategy (JS, Images, Fonts)
  // This merges the previous Step 2 and Step 3 to prevent multiple 'respondWith' calls
  const isInternal = url.origin === self.location.origin
  const isImage = request.destination === 'image'
  const isFont = request.destination === 'font' || url.pathname.endsWith('.ttf')
  const isJS = isInternal && url.pathname.endsWith('.js')

  if (isImage || isFont || isJS) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse

        return fetch(request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200)
              return networkResponse

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
