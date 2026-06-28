const CACHE = 'natilev-ia-v2';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Nunca interceptar llamadas externas — siempre van directo a la red
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Archivos locales: red primero, caché como respaldo
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
