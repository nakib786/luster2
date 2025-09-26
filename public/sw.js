// Enhanced service worker with cache-busting functionality
const CACHE_VERSION = Date.now().toString();
const CACHE_NAME = `luster-co-v${CACHE_VERSION}`;
const STATIC_CACHE = `luster-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `luster-dynamic-v${CACHE_VERSION}`;

// Static assets to cache
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// Install event - cache resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      self.skipWaiting() // Force activation of new service worker
    ])
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - implement cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - always fetch from network, no caching
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response('Network error', { status: 503 });
        })
    );
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return fetchResponse;
          });
        })
    );
  } else {
    // HTML pages - network first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, update cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // If no cache, return offline page
              return caches.match('/')
                .then((offlineResponse) => {
                  return offlineResponse || new Response('Offline', { status: 503 });
                });
            });
        })
    );
  }
});

// Message event - handle cache invalidation commands
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});
