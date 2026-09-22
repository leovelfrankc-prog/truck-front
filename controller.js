// ============================================================
// INIT LOGIN
// ============================================================
function initLogin(initData){
  alert(initData);
}
function init_login(initData) {
  console.log("=====================================");
  console.log("[LOGIN] init_login() ejecutado");
  console.log("[LOGIN] initData:", initData);

  const contenedor = document.getElementById("vista-contenedor");

  // 🔧 MODO DEPURACIÓN: SIEMPRE LOGIN
  console.log("[LOGIN] Insertando vista_login (modo depuración)");
  contenedor.innerHTML = initData.login;
}


// ============================================================
// OBJETO LOGIN
// ============================================================
window.login = {

  datos: {
    usuario: "",
    password: ""
  },

  // ------------------------------------------------------------
  // CAMBIO DE CAMPOS
  // ------------------------------------------------------------
  cambio(payload) {
    console.log("[LOGIN] cambio() campo:", payload.campo);

    const campo = payload.campo;
    const input = document.querySelector(`[data-campo="${campo}"]`);
    if (!input) return;

    this.datos[campo] = input.value;
    console.log("[LOGIN] datos actuales:", this.datos);
  },

  // ------------------------------------------------------------
  // ENVIAR LOGIN
  // ------------------------------------------------------------
  enviar(payload) {
    console.log("[LOGIN] enviar() datos:", this.datos);

    enviarAlBack({
      modulo: "login",
      accion: "validar",
      payload: this.datos,
      token: window.TOKEN
    });
  },
  // ------------------------------------------------------------
  // FUNCIÓN: registrar empresa (front → back)
  // ------------------------------------------------------------
  

  async registrar() {

    // ==================================================
    // FORMULARIO
    // ==================================================
    const form =
      document.getElementById(
        "formRegistrarEmpresa"
      );

    if (!form) {

      alert(
        "Error: formulario no encontrado."
      );

      return;

    }

    const formData =
      new FormData(form);

    // ==================================================
    // CAMPOS
    // ==================================================
    const nombreEmpresa =
      formData.get("nombreEmpresa");

    const nombreAdmin =
      formData.get("nombreAdmin");

    const emailAdmin =
      formData.get("emailAdmin");

    const movilAdmin =
      formData.get("movilAdmin");

    const password1 =
      formData.get("password1");

    const password2 =
      formData.get("password2");

    const logoEmpresa =
      formData.get("logoEmpresa");

    // ==================================================
    // VALIDACIONES
    // ==================================================
    if (password1 !== password2) {

      alert(
        "Las contraseñas no coinciden."
      );

      return;

    }

    if (
      !logoEmpresa ||
      logoEmpresa.size === 0
    ) {

      alert(
        "Debe seleccionar un logo."
      );

      return;

    }

    // ==================================================
    // CONVERTIR IMAGEN A BASE64
    // ==================================================
    const base64 =
      await new Promise(
        (resolve, reject) => {

          const reader =
            new FileReader();

          reader.onload = () => {

            resolve(
              reader.result
                .split(",")[1]
            );

          };

          reader.onerror =
            reject;

          reader.readAsDataURL(
            logoEmpresa
          );

        }
      );

    // ==================================================
    // PAYLOAD
    // ==================================================
    const payload = {

      nombreEmpresa,
      nombreAdmin,
      emailAdmin,
      movilAdmin,

      passwordAdmin:
        password1,

      logo: {

        nombre:
          logoEmpresa.name,

        tipo:
          logoEmpresa.type,

        size:
          logoEmpresa.size,

        base64

      }

    };

    // ==================================================
    // ENVIAR AL CONTROLADOR
    // ==================================================
    await controller(

      "empresa",
      "registrar",
      payload,
      TOKEN

    );

  },

  // ==================================================
  // RETORNO DEL BACKEND
  // ==================================================
  registrarRetorno(data) {

    console.log(
      "Respuesta backend:",
      data
    );

    alert(
      "Empresa registrada correctamente"
    );

  }

},
  // ------------------------------------------------------------
  // RETORNO DE VALIDACIÓN
  // ------------------------------------------------------------
  validar_retorno(res) {
    console.log("=====================================");
    console.log("[LOGIN] validar_retorno() ejecutado");
    console.log("[LOGIN] Respuesta:", res);

    if (!res || typeof res !== "object") {
      alert("Error inesperado en la respuesta del servidor.");
      return;
    }

    if (!res.ok) {
      alert(res.mensaje || "Error desconocido desde el servidor");
      return;
    }

    const payload = res.payload;
    console.log("[LOGIN] Payload:", payload);

    if (!payload || !payload.vista || !payload.tenant) {
      alert("Error interno: falta información esencial en la respuesta.");
      return;
    }

    if (payload.token) {
      window.TOKEN = payload.token;
      console.log("[LOGIN] Nuevo TOKEN:", window.TOKEN);
    }

    window.TENANT = payload.tenant;
    console.log("[LOGIN] TENANT:", window.TENANT);

    cargarVista(payload.vista);

    alert(res.mensaje || "Inicio de sesión exitoso");
  },

  // ------------------------------------------------------------
  // INSTALACIÓN PWA (PASO 1)
  // ------------------------------------------------------------
  instalacion(payload) {
    console.log("[LOGIN] instalacion() ejecutado");

    enviarAlBack({
      modulo: "login",
      accion: "instalar2",
      token: window.TOKEN
    });
  },

  // ------------------------------------------------------------
  // DETECTAR SISTEMA OPERATIVO
  // ------------------------------------------------------------
  detectarSO() {
    const ua = navigator.userAgent.toLowerCase();
    console.log("[LOGIN] detectarSO() UA:", ua);

    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/windows/.test(ua)) return "windows";
    if (/mac os/.test(ua)) return "mac";
    return "otro";
  },

  // ------------------------------------------------------------
  // INSTALACIÓN PWA (PASO 2)
  // ------------------------------------------------------------
  instalacion2(icono192, urlTenant) {

  console.log("=====================================");
  console.log("[LOGIN] instalacion2() ejecutado");
  console.log("[LOGIN] WEBAPP_URL:", window.WEBAPP_URL);
  console.log("[LOGIN] icono192:", icono192);
  console.log("[LOGIN] urlTenant:", urlTenant);

  // ============================================================
  // 1. Crear manifest dinámico
  // ============================================================
  const manifest = {
    name: "Truckero",
    short_name: "Truckero",
    start_url: urlTenant,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: icono192, sizes: "192x192", type: "image/png" },
      { src: icono192, sizes: "512x512", type: "image/png" }
    ]
  };

  const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
  const manifestURL = URL.createObjectURL(blob);

  console.log("[LOGIN] Manifest generado:", manifest);
  console.log("[LOGIN] Manifest URL:", manifestURL);

  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = manifestURL;
  document.head.appendChild(link);

  console.log("[LOGIN] Manifest link añadido:", link.href);

  // ============================================================
  // 2. REGISTRO CORRECTO DEL SERVICE WORKER (URL FORZADA)
  // ============================================================
  if ("serviceWorker" in navigator) {

    // ⭐ FORZAMOS LA URL DEL SW PARA EVITAR googleusercontent.com
    const swURL = window.WEBAPP_URL + "?path=sw";

    console.log("[LOGIN] Registrando SW en (forzado):", swURL);

    navigator.serviceWorker.register(swURL)
      .then(reg => {
        console.log("[LOGIN] ✔ SW registrado correctamente:", reg);
      })
      .catch(err => {
        console.error("[LOGIN] ❌ ERROR registrando SW:", err);
        console.error("[LOGIN] SW URL usada:", swURL);
      });
  }

  console.log("[LOGIN] PWA lista para instalación");
},

  // ------------------------------------------------------------
  // RETORNO DE INSTALACIÓN
  // ------------------------------------------------------------
  instalar2_retorno(res) {
    console.log("=====================================");
    console.log("[LOGIN] instalar2_retorno() ejecutado");
    console.log("[LOGIN] Payload recibido:", res.payload);

    const { urlTenant, iconoLogo, icon192, icon512 } = res.payload;

    const so = window.login.detectarSO();
    console.log("[LOGIN] SO detectado:", so);

    // Preparar instalación
    window.login.instalacion2(icon192, urlTenant);

    // Mostrar instrucciones según plataforma
    window.login.mostrarInstruccionesInstalacion(so);
  }

};
