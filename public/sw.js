// Maeeil PWA Service Worker
const CACHE_NAME = 'maeeil-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/sheep.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-192x192.png',
  '/icon-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// Install Event - Pre-cache essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Handle offline requests and asset caching
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip browser extensions and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  // For external API requests (e.g. Supabase, Kakao), do network-only to avoid caching sensitive user data
  if (url.origin !== self.location.origin && !url.hostname.includes('jsdelivr.net') && !url.hostname.includes('pretendard')) {
    return;
  }

  // Navigation requests (HTML pages): Network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, update cache copy of the page
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match('/index.html');
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('인터넷 연결이 필요합니다.', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            status: 503
          });
        })
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Cache First with Network Fallback & Cache Update (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, nothing to do if cachedResponse exists
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for skip waiting message from app client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
