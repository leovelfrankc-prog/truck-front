/**
 * ==========================================
 * TRUCKERO SERVICE WORKER
 * ==========================================
 */

const VERSION = "1.0.0";

/**
 * INSTALACIÓN
 */

self.addEventListener("install", event => {

    console.log(
        `Truckero SW ${VERSION} instalado`
    );

    self.skipWaiting();

});

/**
 * ACTIVACIÓN
 */

self.addEventListener("activate", event => {

    console.log(
        `Truckero SW ${VERSION} activado`
    );

    event.waitUntil(
        clients.claim()
    );

});

/**
 * FETCH
 *
 * Reservado para futuras versiones
 * offline y caché.
 */

self.addEventListener("fetch", event => {

    return;

});

/**
 * MENSAJES DESDE EL FRONT
 */

self.addEventListener("message", event => {

    const data =
        event.data || {};

    switch (data.accion) {

        case "PING":

            event.source?.postMessage({
                ok: true,
                mensaje: "PONG"
            });

            break;

        case "CLEAR_CACHE":

            console.log(
                "CLEAR_CACHE solicitado"
            );

            break;

        default:

            console.log(
                "Acción SW desconocida:",
                data.accion
            );

    }

});
