// ============================================================
// INIT
// ============================================================
function init_empresa(initData) {
  console.log("[empresa] init_empresa()", initData);
}

// ============================================================
// OBJETO GLOBAL window.empresa
// ============================================================
window.empresa = {

  html: `
    <div class="container mt-4">
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

        <button type="button" class="btn btn-primary w-100"
                data-modulo="empresa"
                data-accion="registrar"
                data-origen="vista_registrarEmpresa">
          Registrar Empresa
        </button>
      </form>

      <div id="resultadoRegistrarEmpresa" class="mt-4"></div>
    </div>
  `,

  // ==========================================================
  // REGISTRAR EMPRESA
  // ==========================================================
  async registrar() {
    const form = document.getElementById("formRegistrarEmpresa");
    if (!form) {
      alert("Error: formulario no encontrado.");
      return;
    }

    const formData = new FormData(form);

    const nombreEmpresa = formData.get("nombreEmpresa");
    const nombreAdmin   = formData.get("nombreAdmin");
    const emailAdmin    = formData.get("emailAdmin");
    const movilAdmin    = formData.get("movilAdmin");
    const password1     = formData.get("password1");
    const password2     = formData.get("password2");
    const logoEmpresa   = formData.get("logoEmpresa");

    // Validaciones
    if (password1 !== password2) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!logoEmpresa || logoEmpresa.size === 0) {
      alert("Debe seleccionar un logo.");
      return;
    }

    // Logo → Base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(logoEmpresa);
    });

    // Payload
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
      }
    };

    console.log("[empresa] payload registro:", payload);

    await controller("empresa", "registrar", payload);
  },

  // ==========================================================
  // RETORNO REGISTRAR EMPRESA
  // ==========================================================
  async registrarRetorno(data) {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      console.log("[empresa] registrarRetorno() DATA:", data);

      if (!data.ok) {
        alert(data.mensaje || data.error || "Ocurrió un error");
        return;
      }

      const token = data?.data?.token;

      Session.clear();

      if (token) {
        Session.setToken(token);
        window.TOKEN = Session.getToken();
      }

      // Redirigir a login
      await router("login");

    } catch (error) {
      console.error("[empresa] Error en registrarRetorno:", error);
      alert("Error al procesar la respuesta: " + error.message);
    }
  }

};
