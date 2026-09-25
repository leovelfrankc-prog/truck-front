/**
 * ==========================================
 * TRUCKERO - UTILES.JS
 * ==========================================
 */

// =====================================================
// CONFIGURACIÓN GLOBAL
// =====================================================
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec"
};

// =====================================================
// SESSION
// =====================================================
const Session = {

  setToken(token) {

    if (!token) return;

    try {
      localStorage.setItem(
        "tokenFirmado",
        token
      );
    } catch (e) {
      console.warn(
        "localStorage no disponible:",
        e
      );
    }

    try {
      sessionStorage.setItem(
        "tokenFirmado",
        token
      );
    } catch (e) {
      console.warn(
        "sessionStorage no disponible:",
        e
      );
    }

    try {

      const d = new Date();

      d.setTime(
        d.getTime() +
        (30 * 24 * 60 * 60 * 1000)
      );

      document.cookie =
        `tokenFirmado=${encodeURIComponent(token)};expires=${d.toUTCString()};path=/;SameSite=Lax;Secure`;

    } catch (e) {

      console.warn(
        "Cookie no disponible:",
        e
      );

    }

  },

  getToken() {

    let token = null;

    try {

      token =
        localStorage.getItem(
          "tokenFirmado"
        );

    } catch (e) {}

    if (!token) {

      try {

        token =
          sessionStorage.getItem(
            "tokenFirmado"
          );

      } catch (e) {}

    }

    if (!token) {

      try {

        const match =
          document.cookie.match(
            /(?:^|; )tokenFirmado=([^;]*)/
          );

        if (match) {

          token =
            decodeURIComponent(
              match[1]
            );

        }

      } catch (e) {}

    }

    return token;

  },

  clear() {

    try {
      localStorage.removeItem(
        "tokenFirmado"
      );
    } catch (e) {}

    try {
      sessionStorage.removeItem(
        "tokenFirmado"
      );
    } catch (e) {}

    try {

      document.cookie =
        "tokenFirmado=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";

    } catch (e) {}

  },

  exists() {

    return !!this.getToken();

  }

};

// =====================================================
// BOOTSTRAP TOKEN
// =====================================================
function bootstrapToken() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const token =
    params.get("token");

  if (!token) return;

  Session.setToken(
    token
  );

  window.TOKEN =
    token;

  console.log(
    "[SESSION] Token almacenado"
  );

}

// =====================================================
// API FETCH
// =====================================================
async function apiFetch({
  modulo,
  accion,
  payload = {}
}) {
  // 1. Diagnóstico de captura de token
  const token = window.TOKEN;

  console.group(`[APIFETCH] Petición -> Módulo: "${modulo}" | Acción: "${accion}"`);
  console.log("--> 1. Estado de window.TOKEN al ejecutar apiFetch:", {
    tokenCapturado: token,
    tipoDato: typeof token,
    longitud: token ? token.length : 0
  });

  try {
    const body = {
      requestId: crypto.randomUUID(),
      modulo,
      accion,
      tokenFirmado: token,
      payload
    };

    // 2. Diagnóstico del JSON final que sale por el red HTTP
    console.log("--> 2. Body que se enviará en el POST a Apps Script:", body);

    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("--> 3. Respuesta cruda del Servidor:", data);

    return data;

  } catch (error) {
    console.error("❌ [APIFETCH] Error en la petición HTTP:", error);

    return {
      ok: false,
      error: error.message || "Error de comunicación"
    };
  } finally {
    console.groupEnd();
  }
}
// =====================================================
// ARRANQUE
// =====================================================
bootstrapToken();

// Exponer objetos globalmente
window.CONFIG = CONFIG;
window.Session = Session;
window.apiFetch = apiFetch;

