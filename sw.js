// Mein Vorrat – Service Worker
const CACHE = 'mv-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const net = fetch(e.request).then(r => { cache.put(e.request, r.clone()); return r; }).catch(() => cached);
      return cached || net;
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(all => {
    if (all.length) return all[0].focus();
    return clients.openWindow('./');
  }));
});
