/**
 * ==========================================
 * TRUCKERO - UTILES.JS
 * ==========================================
 */

// =====================================================
// CONFIGURACIÓN GLOBAL
// =====================================================
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec",
  DEBUG: true // ponlo en false en producción para silenciar logs
};

// =====================================================
// HELPERS DE LOG
// =====================================================
function log(...args) {
  if (CONFIG.DEBUG) console.log(...args);
}

function logError(...args) {
  console.error(...args);
}

// =====================================================
// SESSION
// =====================================================
const Session = {

  setToken(token) {
    if (!token) return;

    try { localStorage.setItem("tokenFirmado", token); } catch (e) {}
    try { sessionStorage.setItem("tokenFirmado", token); } catch (e) {}

    try {
      const d = new Date();
      d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie =
        `tokenFirmado=${encodeURIComponent(token)};expires=${d.toUTCString()};path=/;SameSite=Lax;Secure`;
    } catch (e) {}
  },

  getToken() {
    try {
      const t = localStorage.getItem("tokenFirmado");
      if (t) return t;
    } catch (e) {}

    try {
      const t = sessionStorage.getItem("tokenFirmado");
      if (t) return t;
    } catch (e) {}

    try {
      const match = document.cookie.match(/(?:^|; )tokenFirmado=([^;]*)/);
      if (match) return decodeURIComponent(match[1]);
    } catch (e) {}

    return null;
  },

  clear() {
    try { localStorage.removeItem("tokenFirmado"); } catch (e) {}
    try { sessionStorage.removeItem("tokenFirmado"); } catch (e) {}
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
// BOOTSTRAP TOKEN (desde URL)
// =====================================================
function bootstrapToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) return;

  Session.setToken(token);
  window.TOKEN = token;
  log("[SESSION] Token almacenado desde URL");
}

// =====================================================
// API FETCH
// =====================================================
async function apiFetch({ modulo, accion, payload = {} }) {
  const token = window.TOKEN;

  log(`[APIFETCH] ${modulo}.${accion}`, { token: !!token, payload });

  try {
    const body = {
      requestId: crypto.randomUUID(),
      modulo,
      accion,
      tokenFirmado: token,
      payload
    };

    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    log(`[APIFETCH] Respuesta ${modulo}.${accion}:`, data);
    return data;

  } catch (error) {
    logError("[APIFETCH] Error HTTP:", error);
    return {
      ok: false,
      error: error.message || "Error de comunicación"
    };
  }
}

// =====================================================
// INICIO - RETORNO
// =====================================================
window.inicio = {

  cargarVistaRetorno(res) {
    log("[inicio] cargarVistaRetorno()", res);

    // Error de comunicación o del backend
    if (!res || res.ok === false) {
      logError("[inicio] Error:", res?.error || res);
      alert("No se pudo conectar con el servidor:\n" + (res?.error || "Error desconocido"));
      router("login");
      return;
    }

    // Roles pueden venir en varias formas
    const roles =
      res?.payload?.roles ||
      res?.data?.roles ||
      res?.roles ||
      null;

    // Si roles es un objeto { principal, secundarios }
    if (roles && typeof roles === "object" && !Array.isArray(roles)) {
      cargarMenuRolesSecundarios(roles);
      return;
    }

    // Vista directa
    const vista =
      res?.data?.vista ||
      res?.payload?.vista ||
      res?.vista ||
      (typeof roles === "string" ? roles : null) ||
      null;

    if (vista) {
      router(vista);
      return;
    }

    // Fallback
    router("login");
  }
};

// =====================================================
// MENÚ DE ROLES
// =====================================================
function cargarMenuRolesSecundarios(roles) {
  const menu = document.getElementById("menuRolesSecundarios");
  if (!menu) return;

  menu.innerHTML = "";

  const rolPrincipal = roles?.principal;
  const rolesSecundarios = Array.isArray(roles?.secundarios)
    ? roles.secundarios
    : [];

  // Solo crear botones si hay al menos un rol secundario
  if (rolesSecundarios.length > 0) {

    // Botón del rol principal
    if (typeof rolPrincipal === "string" && rolPrincipal.trim()) {
      const btn = document.createElement("button");
      btn.textContent = rolPrincipal;
      btn.onclick = () => router(rolPrincipal);
      menu.appendChild(btn);
    }

    // Botones secundarios
    rolesSecundarios.forEach(rol => {
      if (typeof rol !== "string" || !rol.trim()) return;
      if (rol === rolPrincipal) return;

      const btn = document.createElement("button");
      btn.textContent = rol;
      btn.onclick = () => router(rol);
      menu.appendChild(btn);
    });
  }

  // SIEMPRE mostrar la vista del rol principal
  if (rolPrincipal) {
    router(rolPrincipal);
  }
}

// =====================================================
// ARRANQUE
// =====================================================
bootstrapToken();

// Exponer globalmente
window.CONFIG = CONFIG;
window.Session = Session;
window.apiFetch = apiFetch;
window.cargarMenuRolesSecundarios = cargarMenuRolesSecundarios;
