/**
 * ==========================================
 * TRUCKERO SERVICE WORKER
 * ==========================================
 */

const VERSION = "2.0.0";
const CACHE_NAME = `truckero-v${VERSION}`;

/**
 * Solo dejamos en caché lo mínimo necesario
 * para poder arrancar la aplicación offline.
 */
const PRECACHE_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json"
];


/**
 * ==========================================
 * INSTALACIÓN
 * ==========================================
 */

self.addEventListener("install", event => {

    console.log(
        `[TRUCKERO SW] Instalando versión ${VERSION}`
    );

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    PRECACHE_ASSETS
                );

            })
            .catch(error => {

                console.warn(
                    "[TRUCKERO SW] Error precache:",
                    error
                );

            })

    );

    // Activar inmediatamente
    self.skipWaiting();

});


/**
 * ==========================================
 * ACTIVACIÓN
 * ==========================================
 */

self.addEventListener("activate", event => {

    console.log(
        `[TRUCKERO SW] Activando versión ${VERSION}`
    );

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            console.log(
                                "[TRUCKERO SW] Eliminando caché antigua:",
                                key
                            );

                            return caches.delete(key);
                        }

                    })

                );

            })
            .then(() => {

                return self.clients.claim();

            })
            .then(() => {

                console.log(
                    `[TRUCKERO SW] Versión ${VERSION} activa`
                );

            })

    );

});


/**
 * ==========================================
 * FETCH
 *
 * Para archivos de la aplicación:
 *
 *       RED
 *        ↓
 *   si funciona
 *        ↓
 *   versión actual
 *
 *   si falla
 *        ↓
 *      CACHE
 * ==========================================
 */

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Solo nuestro propio dominio
    if (url.origin !== self.location.origin) {
        return;
    }


    /**
     * Archivos de aplicación
     *
     * Siempre intentamos primero
     * obtener la versión actual.
     */
    const esArchivoAplicacion =
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".html") ||
        url.pathname.endsWith("/") ||
        url.pathname.endsWith("manifest.json");


    if (esArchivoAplicacion) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })

                .then(response => {

                    if (!response || !response.ok) {
                        throw new Error(
                            `HTTP ${response?.status}`
                        );
                    }

                    return response;

                })

                .catch(error => {

                    console.warn(
                        "[TRUCKERO SW] Red no disponible:",
                        request.url,
                        error
                    );

                    return caches.match(request)
                        .then(cached => {

                            if (cached) {
                                return cached;
                            }

                            if (
                                request.mode === "navigate"
                            ) {

                                return caches.match(
                                    "./index.html"
                                );

                            }

                            return Response.error();

                        });

                })

        );

        return;
    }


    /**
     * Para otros recursos:
     * red primero y caché como respaldo.
     */

    event.respondWith(

        fetch(request)

            .catch(() => {

                return caches.match(request);

            })

    );

});


/**
 * ==========================================
 * MENSAJES DESDE EL FRONTEND
 * ==========================================
 */

self.addEventListener("message", event => {

    const data = event.data || {};


    switch (data.accion) {


        /**
         * PING
         */

        case "PING":

            event.source?.postMessage({

                ok: true,

                version: VERSION,

                mensaje: "PONG"

            });

            break;


        /**
         * FORZAR ACTIVACIÓN
         */

        case "SKIP_WAITING":

            console.log(
                "[TRUCKERO SW] SKIP_WAITING solicitado"
            );

            self.skipWaiting();

            break;


        /**
         * LIMPIAR TODAS LAS CACHÉS
         */

        case "CLEAR_CACHE":

            console.log(
                "[TRUCKERO SW] CLEAR_CACHE solicitado"
            );

            event.waitUntil(

                caches.keys()
                    .then(keys => {

                        return Promise.all(
                            keys.map(key =>
                                caches.delete(key)
                            )
                        );

                    })

            );

            break;


        default:

            console.log(
                "[TRUCKERO SW] Acción desconocida:",
                data.accion
            );

    }

});
