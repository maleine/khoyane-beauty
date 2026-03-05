// ============================================================
// KHOYANE BEAUTY — Service Worker
// Gère les notifications push en arrière-plan
// ============================================================

self.addEventListener('push', function(event) {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Nouvelle réservation reçue',
    icon: '/images/nail-01.jpg',
    badge: '/images/nail-01.jpg',
    tag: 'nouvelle-reservation',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/admin/reservations',
    },
    actions: [
      { action: 'voir', title: '👁️ Voir' },
      { action: 'ignorer', title: 'Ignorer' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 Khoyane Beauty', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'voir' || !event.action) {
    const url = event.notification.data?.url || '/admin/reservations';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(windowClients) {
        for (let client of windowClients) {
          if (client.url.includes('/admin') && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  }
});

self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
