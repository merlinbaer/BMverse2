/* eslint-disable no-restricted-globals */
/* global clients */

// Core cache for the HTML shell, Asset cache for JS/Images
const CORE_CACHE = 'bmverse-core-v1'
const ASSET_CACHE = 'bmverse-assets-v1'

const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.png']

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // 1. Navigation strategy (Screens)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  // 2. Internal Asset strategy (Stale-While-Revalidate)
  // This ensures the JavaScript application bundle is saved for offline use
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchedResponse = fetch(request)
            .then(networkResponse => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              cache.put(request, networkResponse.clone())
              return networkResponse
            })
            .catch(() => null)

          return cachedResponse || fetchedResponse
        })
      }),
    )
    return
  }

  // 3. External Image Caching (Cache-First) - For Supabase images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) return response

        return fetch(request).then(networkResponse => {
          return caches.open(ASSET_CACHE).then(cache => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
        })
      }),
    )
  }
})
