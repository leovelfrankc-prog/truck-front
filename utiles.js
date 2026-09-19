/**
 * ==========================================
 * TRUCKERO - UTILES.JS
 * ==========================================
 */

/**
 * Configuración global
 */
const CONFIG = {

    API_URL:
        "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec"

};

/**
 * ==========================================
 * SESSION
 * ==========================================
 */

const Session = {

    getToken() {

        return localStorage.getItem(
            "tokenFirmado"
        );

    },

    setToken(token) {

        localStorage.setItem(
            "tokenFirmado",
            token
        );

    },

    clear() {

        localStorage.removeItem(
            "tokenFirmado"
        );

    },

    exists() {

        return !!localStorage.getItem(
            "tokenFirmado"
        );

    }

};

/**
 * ==========================================
 * BOOTSTRAP TOKEN
 * ==========================================
 *
 * Lee el token de la URL y lo guarda
 * localmente para futuras aperturas
 *
 * Ejemplo:
 *
 * ?token=ABC123
 *
 */

function bootstrapToken() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const token =
        params.get("token");

    if (token) {

        Session.setToken(token);

        console.log(
            "Token almacenado en sesión local"
        );

    }

}

/**
 * ==========================================
 * API FETCH
 * ==========================================
 */

async function apiFetch({
    modulo,
    accion,
    tokenFirmado,
    payload = {}
}) {

    try {

        const body = {

            requestId:
                crypto.randomUUID(),

            modulo,
            accion,
            tokenFirmado,
            payload

        };

        const response =
            await fetch(
                CONFIG.API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(
                        body
                    )
                }
            );

        const data =
            await response.json();

        return data;

    } catch (error) {

        console.error(
            "apiFetch:",
            error
        );

        return {

            ok: false,

            error:
                error.message ||

                "Error de comunicación"

        };

    }

}

/**
 * ==========================================
 * ARRANQUE INICIAL
 * ==========================================
 *
 * Guarda token de la URL
 * y deja disponible la sesión
 *
 */

bootstrapToken();
