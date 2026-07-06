/* Kill-switch service worker.
   The app no longer uses a service worker. If an old one is still
   installed on a device, the browser will eventually fetch this file,
   replace the old worker with this one, and this one immediately
   unregisters itself and deletes every cache — freeing the page to
   always load fresh from the network. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});

// Pass every request straight through to the network — no caching.
self.addEventListener('fetch', () => {});
