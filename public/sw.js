/* eslint-disable no-restricted-globals */
/* global clients */

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
      .then(cache => {
        // We use a map to catch individual errors so one 404 doesn't kill the worker
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache
              .add(url)
              .catch(err => console.warn(`PWA: Failed to cache ${url}`, err)),
          ),
        )
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CORE_CACHE && key !== ASSET_CACHE)
            .map(key => caches.delete(key)),
        ),
      )
      .then(() => clients.claim()),
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // 1. Navigation strategy (Screens)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  // 2. Asset strategy (Images, Fonts, and internal JS bundles)
  // This is the CRITICAL part for initAssets()
  const isInternalAsset = url.origin === self.location.origin
  const isImageOrFont =
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.includes('.ttf')

  if (isImageOrFont || (isInternalAsset && url.pathname.includes('.js'))) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse

        return fetch(request)
          .then(networkResponse => {
            // Only cache valid responses
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

  // 3. Image & Font Caching (Cache-First)
  // We extend the check to include fonts so vector icons work offline
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.ttf')
  ) {
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
