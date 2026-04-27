/* eslint-disable */
/**
 * StaffUp LMS — Service Worker
 *
 * Strategy:
 *  - precache: app shell (offline fallback page + manifest + key icons)
 *  - runtime cache (stale-while-revalidate): GET requests to course/lesson/
 *    static asset endpoints
 *  - network-first: everything else (mutations, auth, api by default)
 *  - manual cache "staffup-lessons-v1" used by the app (via window.caches API)
 *    to persist lesson content the user explicitly saves for offline. The SW
 *    serves from this cache first when offline.
 *
 * IMPORTANT: bump SW_VERSION whenever you change this file or precache list,
 * otherwise old SW will keep serving stale responses.
 */
const SW_VERSION = 'v1.0.0';
const APP_SHELL_CACHE = `staffup-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `staffup-runtime-${SW_VERSION}`;
const LESSONS_CACHE = 'staffup-lessons-v1'; // intentionally version-pinned, owned by app

const APP_SHELL = [
  '/offline',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              k.startsWith('staffup-shell-') && k !== APP_SHELL_CACHE
              || k.startsWith('staffup-runtime-') && k !== RUNTIME_CACHE,
          )
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const sameOriginGet = (request) => {
  const url = new URL(request.url);
  return request.method === 'GET' && url.origin === self.location.origin;
};

/** Match Next.js static asset paths that are safe to cache aggressively. */
const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/icon-') ||
  url.pathname === '/manifest.webmanifest' ||
  /\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)$/i.test(url.pathname);

/** Match navigation requests (HTML pages). */
const isNavigation = (request) =>
  request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    })
    .catch(() => null);
  return cached || (await networkFetch) || Response.error();
};

const networkFirstWithOfflineFallback = async (request) => {
  try {
    const response = await fetch(request);
    // Cache successful navigations so reload works offline next time.
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()).catch(() => undefined);
    }
    return response;
  } catch (_) {
    // First, try to serve from explicit lesson cache (user saved this URL)
    const lessons = await caches.open(LESSONS_CACHE);
    const lessonHit = await lessons.match(request);
    if (lessonHit) return lessonHit;

    const runtime = await caches.open(RUNTIME_CACHE);
    const runtimeHit = await runtime.match(request);
    if (runtimeHit) return runtimeHit;

    const shell = await caches.open(APP_SHELL_CACHE);
    const offline = await shell.match('/offline');
    if (offline) return offline;
    return Response.error();
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (!sameOriginGet(request)) return;

  const url = new URL(request.url);

  // Never intercept API mutations or auth — let them fail loudly when offline
  // so the app can show the right error.
  if (url.pathname.startsWith('/api/')) return;

  // First, lessons cache hit always wins (user explicitly saved this URL).
  event.respondWith(
    (async () => {
      const lessons = await caches.open(LESSONS_CACHE);
      const lessonHit = await lessons.match(request);
      if (lessonHit) {
        // Revalidate in the background but return cached immediately.
        fetch(request)
          .then((res) => {
            if (res && res.status === 200) lessons.put(request, res.clone()).catch(() => undefined);
          })
          .catch(() => undefined);
        return lessonHit;
      }

      if (isStaticAsset(url)) return staleWhileRevalidate(request);
      if (isNavigation(request)) return networkFirstWithOfflineFallback(request);
      return staleWhileRevalidate(request);
    })(),
  );
});
