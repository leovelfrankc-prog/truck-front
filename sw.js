// sw.js - Service Worker minimalista
const CACHE_NAME = 'desarrollando-3';

// Solo cacheamos la vista estática base para offline básico
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json'
];

// Instalación
self.addEventListener('install', (event) => {
  console.log('[SW Minimal] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('[SW Minimal] Activado y tomando el control.');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptación de red (Estrategia Network-First para evitar bloqueos de JS)
self.addEventListener('fetch', (event) => {
  // Dejamos pasar las peticiones a Google Apps Script sin intervenir
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Si no hay red, intentamos buscar en la caché el index.html
        return caches.match('./index.html');
      })
  );
});
