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

    setToken(token) {
        if (!token) return;

        // 1. Intentar localStorage
        try {
            localStorage.setItem("tokenFirmado", token);
        } catch (e) {
            console.warn("localStorage no disponible:", e);
        }

        // 2. Intentar sessionStorage
        try {
            sessionStorage.setItem("tokenFirmado", token);
        } catch (e) {
            console.warn("sessionStorage no disponible:", e);
        }

        // 3. Respaldo por Cookie nativa para iOS Safari (expira en 30 días)
        try {
            const d = new Date();
            d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = `tokenFirmado=${encodeURIComponent(token)}; expires=${d.toUTCString()}; path=/; SameSite=Lax; Secure`;
        } catch (e) {
            console.warn("Cookie no disponible:", e);
        }
    },

    getToken() {
        let token = null;

        // 1. Intentar localStorage
        try {
            token = localStorage.getItem("tokenFirmado");
        } catch (e) {}

        // 2. Si falla en iOS, probar sessionStorage
        if (!token) {
            try {
                token = sessionStorage.getItem("tokenFirmado");
            } catch (e) {}
        }

        // 3. Si falla, recuperar desde la Cookie nativa
        if (!token) {
            try {
                const match = document.cookie.match(/(?:^|; )tokenFirmado=([^;]*)/);
                if (match) {
                    token = decodeURIComponent(match[1]);
                }
            } catch (e) {}
        }

        return token;
    },

    clear() {
        // Limpiar en los 3 mecanismos de almacenamiento
        try {
            localStorage.removeItem("tokenFirmado");
        } catch (e) {}

        try {
            sessionStorage.removeItem("tokenFirmado");
        } catch (e) {}

        try {
            document.cookie = "tokenFirmado=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";
        } catch (e) {}
    },

    exists() {
        return !!this.getToken();
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
