API_URL:
    "https://script.google.com/macros/s/...``` {

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
        `tokenFirmado=${encodeURIComponent(token)}; expires=${d.toUTCString()}; path=/; SameSite=Lax; Secure`;

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

  if (token) {

    Session.setToken(
      token
    );

    console.log(
      "[SESSION] Token almacenado"
    );

  }

}

// =====================================================
// API FETCH
// =====================================================
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

          body:
            JSON.stringify(
              body
            )

        }

      );

    const data =
      await response.json();

    return data;

  } catch (error) {

    console.error(
      "[APIFETCH]",
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

// =====================================================
// CONTROLLER UNIVERSAL
// =====================================================
async function controller(

  modulo,
  accion,
  payload,
  tokenFirmado

) {

  try {

    const respuesta =
      await apiFetch({

        modulo,
        accion,
        tokenFirmado,
        payload

      });

    if (!respuesta.ok) {

      throw new Error(
        respuesta.error ||
        "Error de servidor"
      );

    }

    const funcionRetorno =
      window[modulo]?.[
        accion + "Retorno"
      ];

    if (
      typeof funcionRetorno ===
      "function"
    ) {

      funcionRetorno(
        respuesta.data || {}
      );

    } else {

      console.warn(
        `No existe ${modulo}.${accion}Retorno`
      );

    }

    return respuesta;

  } catch (error) {

    console.error(
      "[CONTROLLER]",
      error
    );

    return {

      ok: false,

      error:
        error.message

    };

  }

}

// =====================================================
// ARRANQUE
// =====================================================
bootstrapToken();
