/* eslint-disable no-restricted-globals */
/* global clients */

// Basic Service Worker for BMverse2
const IMAGE_CACHE_NAME = 'bmverse-images-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', event => {
  const { request } = event

  // 1. Navigation strategy (Screens)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/')
      }),
    )
    return
  }

  // 2. Image Caching strategy (Cache-First)
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          return (
            response ||
            fetch(request).then(networkResponse => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              cache.put(request, networkResponse.clone())
              return networkResponse
            })
          )
        })
      }),
    )
  }
})
