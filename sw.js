/**
 * SERVICE WORKER - TRUCKERO PWA
 * Estrategia: Cache First para App Shell / Network Only para Google Apps Script
 */

const CACHE_NAME = 'truckero-app-shell-v20260929';

// Recursos locales indispensables que componen el App Shell estático
const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './estilos.css',
  './recursosHTML.js',
  './vistas.js',
  './transporter.js',
  './navigation.js',
  './actionEngine.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

// 1. INSTALACIÓN: Pre-cachear el App Shell
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando recursos del App Shell estático');
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN: Limpieza de cachés antiguas al actualizar la versión
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. INTERCEPCIÓN DE PETICIONES (FETCH)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // REGLA CRÍTICA: Las peticiones a Google Apps Script SIEMPRE van directas a la red
  // No deben pasar por la caché del SW para evitar respuestas obsoletas de Transporter
  if (url.includes('script.google.com')) {
    return; // Permite que el navegador haga el fetch normal a Apps Script
  }

  // Estrategia "Cache First, falling back to Network" para el App Shell (archivos locales y CDN)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está en caché, va a la red y guarda una copia si la respuesta es válida
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        console.error('[SW] Error en fetch y recurso no encontrado en caché:', error);
      });
    })
  );
});
