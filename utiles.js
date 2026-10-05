/**
 * ==========================================
 * TRUCKERO - UTILES.JS
 * ==========================================
 */

// =====================================================
// CONFIGURACIÓN GLOBAL
// =====================================================
const CONFIG = {
  DEBUG: true // ponlo en false en producción para silenciar logs
};

const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec";

if (!window.API_URL) {
  window.API_URL = DEFAULT_API_URL;
}

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

// Exponer inmediatamente
window.Session = Session;

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
  const token = window.TOKEN || Session.getToken();
  const endpoint = window.API_URL || DEFAULT_API_URL;

  log(`[APIFETCH] ${modulo}.${accion}`, { token: !!token, payload, targetUrl: endpoint });

  try {
    const body = {
      requestId: (typeof crypto !== "undefined" && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : 'req-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      modulo,
      accion,
      tokenFirmado: token,
      payload
    };

    const response = await fetch(endpoint, {
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

// Exponer inmediatamente
window.apiFetch = apiFetch;

// =====================================================
// INICIO - RETORNO
// =====================================================
window.inicio = {

  cargarVistaRetorno(res) {
    log("[inicio] cargarVistaRetorno()", res);

    // 1. Validar respuesta del backend
    if (!res || res.ok === false) {
      logError("[inicio] Error:", res?.error || res);

      alert(
        "No se pudo conectar con el servidor:\n" +
        (res?.error || "Error desconocido")
      );

      router("login");
      return;
    }

    // 2. La VISTA la decide exclusivamente el backend
    const vista = res?.data?.vista;
    if (res?.data?.url) {
      window.API_URL = res.data.url;
    }
    
    log("[inicio] Vista recibida del backend:", vista);

    // 3. Si el backend no envió una vista válida
    if (!vista || typeof vista !== "string") {
      logError("[inicio] El backend no envió una vista válida:", res);
      router("login");
      return;
    }

    // 4. Cargar EXACTAMENTE la vista indicada por el backend
    router(vista);
  }
};

// =====================================================
// MENÚ DE ROLES
// =====================================================
function cargarMenuRolesSecundarios(roles) {
  const menu = document.getElementById("menuRolesSecundarios");
  if (!menu) return;

  menu.innerHTML = "";

  const rolPrincipal = roles?.principal ? String(roles.principal).toLowerCase().trim() : null;
  
  const rolesSecundarios = Array.isArray(roles?.secundarios)
    ? roles.secundarios
    : [];

  const secundariosFiltrados = rolesSecundarios
    .map(rol => String(rol).toLowerCase().trim())
    .filter(rol => rol && rol !== rolPrincipal);

  if (secundariosFiltrados.length > 0) {
    const todosLosRoles = [rolPrincipal, ...secundariosFiltrados].filter(Boolean);

    todosLosRoles.forEach(rol => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary w-100";
      
      btn.dataset.modulo = rol;
      btn.dataset.accion = `init-${rol}`;
      btn.textContent = rol;
      
      menu.appendChild(btn);
    });
  }

  if (rolPrincipal && window.rolPrincipal && typeof window.rolPrincipal[`init-${rolPrincipal}`] === "function") {
    window.rolPrincipal[`init-${rolPrincipal}`]();
  }
}

// =====================================================
// ARRANQUE
// =====================================================
bootstrapToken();

// EXPORTACIONES GLOBALES
window.CONFIG = CONFIG;
window.log = log;
window.logError = logError;
window.bootstrapToken = bootstrapToken;
window.cargarMenuRolesSecundarios = cargarMenuRolesSecundarios;
