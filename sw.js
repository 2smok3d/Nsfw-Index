/* ============================================================
   sw.js — service worker for the installable app shell only.
   Caches this app's own static files (stale-while-revalidate:
   serve from cache instantly, refresh in the background) so the
   shell loads offline. Never touches cross-origin requests — the
   directory's external site links and the in-app search iframes
   are untouched, exactly as if there were no service worker at all.
   Bump CACHE_VERSION on any shell-file change to force a refresh.
   ============================================================ */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `noir-index-${CACHE_VERSION}`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/theme.css',
  './assets/js/store.js',
  './assets/js/router.js',
  './assets/js/nav.js',
  './assets/js/palette.js',
  './assets/js/views/home.js',
  './assets/js/views/directory.js',
  './assets/js/views/search.js',
  './assets/js/views/tools.js',
  './assets/js/views/settings.js',
  './assets/data/sites.js',
  './assets/fonts/fraunces-normal-variable.woff2',
  './assets/fonts/fraunces-italic-variable.woff2',
  './assets/fonts/instrument-sans-normal-variable.woff2',
  './assets/fonts/instrument-sans-italic-variable.woff2',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
