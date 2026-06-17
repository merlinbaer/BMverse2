/* eslint-disable no-restricted-globals */
/* global clients */

// Basic Service Worker for BMverse2
const CACHE_NAME = 'bmverse-core-v1'
const IMAGE_CACHE_NAME = 'bmverse-images-v1'

const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.png']

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
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

  // 1. Navigation strategy (Screens)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  // 2. Image Caching strategy (Cache-First)
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // Return the cached version if we have it (this makes initAssets work!)
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise, fetch from network and save to cache
        return caches.open(IMAGE_CACHE_NAME).then(cache => {
          return fetch(request).then(networkResponse => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cache.put(request, networkResponse.clone())
            return networkResponse
          })
        })
      }),
    )
  }
})
