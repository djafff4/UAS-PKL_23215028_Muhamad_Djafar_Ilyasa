const CACHE_NAME = 'akman-pwa-v2'
const STATIC_CACHE = [
  '/login',
  '/manifest.webmanifest',
  '/assets/logo/logo_akman.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key)
          return Promise.resolve()
        }),
      ),
    ).then(() => self.clients.claim()),
  )
})

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE_NAME)

  try {
    const response = await fetch(request)
    if (response && response.ok && request.method === 'GET') {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl)
      if (fallback) return fallback
    }
    throw new Error('offline')
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/login'))
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(networkFirst(request))
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).catch(() => new Response('Offline', { status: 503 }))
    }).catch(() => new Response('Offline', { status: 503 })),
  )
})
