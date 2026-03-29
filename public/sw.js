const CACHE_NAME = 'patipetra-v1';
const OFFLINE_URLS = ['/', '/ilanlar', '/veterinerler'];

// Kurulum
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Aktivasyon
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - cache first for static, network first for dynamic
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Push bildirimi al
self.addEventListener('push', e => {
  if (!e.data) return;

  let data = {};
  try { data = e.data.json(); } catch { data = { title: 'Patıpetra', body: e.data.text() }; }

  const options = {
    body:    data.body    || 'Yeni bir bildiriminiz var',
    icon:    data.icon    || '/icons/icon-192.png',
    badge:   '/icons/icon-192.png',
    image:   data.image,
    data:    { url: data.url || '/' },
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    tag:     data.tag || 'patipetra-notification',
    renotify: true,
  };

  e.waitUntil(
    self.registration.showNotification(data.title || 'Patıpetra 🐾', options)
  );
});

// Bildirime tıklanınca
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
