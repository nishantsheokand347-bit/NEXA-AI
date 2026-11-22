/* NEXA AI: cache only local app shell; Puter AI still requires internet. */
const CACHE = 'nexa-shell-v2026-11-22';
const APP_PATH = '/NEXA-AI/';
const SHELL = [
  APP_PATH,
  APP_PATH + 'index.html',
  APP_PATH + 'manifest.webmanifest',
  APP_PATH + 'apple-touch-icon.png',
  APP_PATH + 'icon-192.png',
  APP_PATH + 'icon-512.png',
  APP_PATH + 'icon-maskable-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('nexa-shell-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_PATH)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(APP_PATH + 'index.html')));
    return;
  }
  if (SHELL.includes(url.pathname)) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});
