// ============================================================
// INIT
// ============================================================
function init_empresa(initData) {
  console.log("[empresa] init_empresa()", initData);
}

// ============================================================
// OBJETO GLOBAL window.empresa
// ============================================================
// =====================================================
// MODULO EMPRESA
// =====================================================
// =====================================================
// MODULO EMPRESA - Truckero
// =====================================================
window.empresa = {

  // ---------- HTML del formulario (déjalo como lo tengas) ----------
  html: `<div class="container mt-4">
  <h2>Registrar Empresa</h2>
  <p class="text-muted">Complete la información para crear la empresa</p>

  <form id="formRegistrarEmpresa">
    <div class="mb-3">
      <label class="form-label">Nombre de la empresa</label>
      <input type="text" name="nombreEmpresa" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Nombre del administrador</label>
      <input type="text" name="nombreAdmin" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Email del administrador</label>
      <input type="email" name="emailAdmin" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Móvil del administrador</label>
      <input type="tel" name="movilAdmin" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Contraseña</label>
      <input type="password" name="password1" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Repetir contraseña</label>
      <input type="password" name="password2" class="form-control" required>
    </div>

    <div class="mb-3">
      <label class="form-label">Logo de la empresa</label>
      <input type="file" name="logoEmpresa" class="form-control" accept="image/*" required>
    </div>

    <button type="button"
            class="btn btn-primary w-100"
            data-modulo="empresa"
            data-accion="registrar"
            data-origen="vista_registrarEmpresa">
      Registrar Empresa
    </button>
  </form>

  <div id="resultadoRegistrarEmpresa" class="mt-4"></div>
</div>`,

  // =====================================================
  // REGISTRAR EMPRESA
  // =====================================================
  async registrar() {
    const form = document.getElementById("formRegistrarEmpresa");
    if (!form) {
      alert("Error: formulario no encontrado.");
      return;
    }

    const formData = new FormData(form);
    const nombreEmpresa = formData.get("nombreEmpresa")?.trim();
    const nombreAdmin   = formData.get("nombreAdmin")?.trim();
    const emailAdmin    = formData.get("emailAdmin")?.trim();
    const movilAdmin    = formData.get("movilAdmin")?.trim();
    const password1     = formData.get("password1");
    const password2     = formData.get("password2");
    const logoEmpresa   = formData.get("logoEmpresa");

    // Validaciones
    if (!nombreEmpresa || !nombreAdmin || !emailAdmin || !movilAdmin) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (password1 !== password2) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!logoEmpresa || logoEmpresa.size === 0) {
      alert("Debe seleccionar un logo.");
      return;
    }

    // Deshabilitar botón mientras se procesa
    const btn = form.querySelector("button[type='submit'], button.btn-registrar, #btnRegistrar");
    if (btn) {
      btn.disabled = true;
      btn.dataset.textoOriginal = btn.textContent;
      btn.textContent = "Creando carpeta en tu Drive...";
    }

    try {
      // 1. Pedir permiso de Google + crear carpeta + compartir
      const folderIdCliente = await crearCarpetaEnDriveCliente(nombreEmpresa);

      if (!folderIdCliente) {
        throw new Error("No se obtuvo el ID de la carpeta.");
      }

      // 2. Logo → Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(logoEmpresa);
      });

      // 3. Payload completo
      const payload = {
        nombreEmpresa,
        nombreAdmin,
        emailAdmin,
        movilAdmin,
        passwordAdmin: password1,
        logo: {
          nombre: logoEmpresa.name,
          tipo:   logoEmpresa.type,
          size:   logoEmpresa.size,
          base64
        },
        folderIdCliente
      };

      console.log("[empresa] payload registro:", payload);

      if (btn) btn.textContent = "Registrando empresa...";

      await controller("empresa", "registrar", payload);

    } catch (err) {
      console.error("[empresa] Error en registrar:", err);
      alert("No se pudo completar el registro:\n\n" + (err.message || err));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.textoOriginal || "Registrar";
      }
    }
  },

  // =====================================================
  // RETORNO REGISTRAR EMPRESA
  // =====================================================
  async registrarRetorno(data) {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      console.log("[empresa] registrarRetorno() DATA:", data);

      if (!data.ok) {
        alert(data.data?.mensaje || data.mensaje || data.error || "Ocurrió un error");
        return;
      }

      const token = data?.data?.token;
      Session.clear();

      if (token) {
        Session.setToken(token);
        window.TOKEN = Session.getToken();
      }

      await router("login");

    } catch (error) {
      console.error("[empresa] Error en registrarRetorno:", error);
      alert("Error al procesar la respuesta: " + error.message);
    }
  }
};


// =====================================================
// HELPER: Crear carpeta en Drive del cliente + compartir
// =====================================================
async function crearCarpetaEnDriveCliente(nombreEmpresa) {

  // 1. Cargar Google Identity Services si no está cargado
  if (!window.google?.accounts?.oauth2) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload  = resolve;
      script.onerror = () => reject(new Error("No se pudo cargar Google Identity Services"));
      document.head.appendChild(script);
    });
  }

  // 2. Client ID de tu proyecto truck2-508902
  const CLIENT_ID = "425489213705-r9qn3hsmchlsmgqiv971uovm3bg71lo4.apps.googleusercontent.com";

  // 3. Pedir access token (aparece el diálogo de Google)
  const accessToken = await new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (resp) => {
        if (resp.error) {
          reject(new Error(
            resp.error === "access_denied"
              ? "Debes aceptar el permiso de Google Drive para continuar."
              : resp.error
          ));
          return;
        }
        resolve(resp.access_token);
      },
      error_callback: (err) => {
        reject(new Error(err?.message || "El usuario cerró el diálogo de autorización"));
      }
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  });

  // 4. Crear la carpeta en el Drive del cliente
  const nombreCarpeta = `Truckero - ${nombreEmpresa}`;

  const resCarpeta = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: nombreCarpeta,
      mimeType: "application/vnd.google-apps.folder"
    })
  });

  if (!resCarpeta.ok) {
    const err = await resCarpeta.json().catch(() => ({}));
    throw new Error(err.error?.message || "Error al crear la carpeta en Drive");
  }

  const carpeta = await resCarpeta.json();
  const folderId = carpeta.id;

  // 5. Compartir con leovelfrankc@gmail.com como Editor
  const resShare = await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}/permissions?sendNotificationEmail=false`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "user",
        role: "writer",
        emailAddress: "leovelfrankc@gmail.com"
      })
    }
  );

  if (!resShare.ok) {
    const err = await resShare.json().catch(() => ({}));
    console.warn("[empresa] No se pudo compartir la carpeta:", err);
    alert(
      "La carpeta se creó correctamente, pero no se pudo compartir automáticamente con leovelfrankc@gmail.com.\n" +
      "Compártela manualmente desde tu Drive."
    );
  } else {
    console.log("[empresa] Carpeta creada y compartida. folderId:", folderId);
  }

  return folderId;
}

console.log("[EMPRESA] módulo empresa cargado");

