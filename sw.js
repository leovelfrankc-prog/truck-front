/**
 * ==========================================
 * TRUCKERO SERVICE WORKER
 * ==========================================
 */

const VERSION = "1.0.0";
const CACHE_NAME = `truckero-v${VERSION}`;

// Recurso básico para verificar la carga offline en la auditoría PWA
const PRECACHE_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json"
];

/**
 * INSTALACIÓN
 */
self.addEventListener("install", event => {
    console.log(`Truckero SW ${VERSION} instalado`);

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_ASSETS).catch(err => {
                console.warn("Error en precaché inicial:", err);
            });
        })
    );

    self.skipWaiting();
});

/**
 * ACTIVACIÓN
 */
self.addEventListener("activate", event => {
    console.log(`Truckero SW ${VERSION} activado`);

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * FETCH
 * Estrategia: Buscar en la red primero; si falla, intentar responder con la caché.
 */
self.addEventListener("fetch", event => {
    // Solo interceptar peticiones GET dentro del propio dominio (evitar problemas con AppScript u otros origenes)
    if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

/**
 * MENSAJES DESDE EL FRONT
 */
self.addEventListener("message", event => {
    const data = event.data || {};

    switch (data.accion) {
        case "PING":
            event.source?.postMessage({
                ok: true,
                mensaje: "PONG"
            });
            break;

        case "CLEAR_CACHE":
            console.log("CLEAR_CACHE solicitado");
            caches.delete(CACHE_NAME);
            break;

        default:
            console.log("Acción SW desconocida:", data.accion);
    }
});
