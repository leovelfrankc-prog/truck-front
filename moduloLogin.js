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
                    required
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    placeholder="password"
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

  async enviar() {
    const form = document.getElementById("form-login");
    if (!form) {
      alert("Error: formulario no encontrado.");
      return;
    }

    const formData = new FormData(form);
    const usuario = formData.get("usuario");
    const password = formData.get("password");

    if (!usuario || !password) {
      alert("Usuario y contraseña son obligatorios.");
      return;
    }

    console.log("[LOGIN] Enviando credenciales...");

    const btn = form.querySelector("button");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Entrando...";
    }

    try {
      await controller("login", "validar", { usuario, password });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Entrar";
      }
    }
  },

  async validarRetorno(res) {
    console.log("[LOGIN] validarRetorno()", res);

    if (!res || typeof res !== "object") {
      alert("Error inesperado en la respuesta del servidor.");
      return;
    }

    if (!res.ok) {
      const mensaje =
        res?.payload?.mensaje ||
        res?.mensaje ||
        res?.error ||
        "Credenciales incorrectas";
      alert(mensaje);
      return;
    }

    const token = res?.payload?.token || res?.data?.token || res?.token;
    const roles = res?.payload?.roles || res?.data?.roles || res?.roles;

    if (!token) {
      alert("El servidor no devolvió un token válido.");
      return;
    }

    
    window.TOKEN = token;
    console.log("[LOGIN] Token guardado correctamente");
    console.log("[LOGIN] Roles recibidos:", roles);

    if (roles) {
      cargarMenuRolesSecundarios(roles);
    } else {
      console.warn("[LOGIN] No vinieron roles, yendo a admin");
      router("admin");
    }
  }
};

console.log("[LOGIN] módulo login cargado");


