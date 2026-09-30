// ============================================================
// OBJETO LOGIN
// ============================================================
window.login = {

  html: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h4 class="text-center mb-3">Iniciar sesión</h4>

              <form id="form-login" data-modulo="login">
                <div class="mb-3">
                  <label class="form-label">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    class="form-control"
                    placeholder="usuario"
                    data-modulo="login"
                    data-accion="cambio"
                    data-campo="usuario"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    placeholder="••••••••"
                    data-modulo="login"
                    data-accion="cambio"
                    data-campo="password"
                    required
                  >
                </div>

                <button
                  type="button"
                  class="btn btn-primary w-100"
                  data-modulo="login"
                  data-accion="enviar">
                  Entrar
                </button>
              </form>

              <div id="login-mensaje" class="mt-3 text-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  // ==========================================================
  // ENVIAR LOGIN
  // ==========================================================
  async enviar() {
    const form = document.getElementById("form-login");
    if (!form) {
      alert("Error: formulario no encontrado.");
      return;
    }

    const formData = new FormData(form);
    const usuario  = formData.get("usuario");
    const password = formData.get("password");

    if (!usuario || !password) {
      alert("Usuario y contraseña son obligatorios.");
      return;
    }

    const payload = {
      usuario,
      password
    };

    console.log("[LOGIN] Enviando credenciales...");

    // Opcional: mostrar loading
    const btn = form.querySelector("button");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Entrando...";
    }

    try {
      await controller("login", "validar", payload);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Entrar";
      }
    }
  },

  // ==========================================================
  // RETORNO VALIDACIÓN
  // ==========================================================
  async validarRetorno(res) {
    console.log("[LOGIN] validarRetorno()", res);

    if (!res || typeof res !== "object") {
      alert("Error inesperado en la respuesta del servidor.");
      return;
    }

    // Error del servidor
    if (!res.ok) {
      alert(res.mensaje || res.error || "Credenciales incorrectas");
      return;
    }

    // Éxito
    const token = res?.payload?.token || res?.data?.token || res?.token;

    if (!token) {
      alert("El servidor no devolvió un token válido.");
      console.warn("[LOGIN] Respuesta sin token:", res);
      return;
    }

    // Guardar sesión
    
    window.TOKEN = token;

    console.log("[LOGIN] Token guardado correctamente");

    alert(JSON.stringify(res));
    cargarMenuRolesSecundarios(res.payload.roles);
  }

};
