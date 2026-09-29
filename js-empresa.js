// ============================================================
// INIT
// ============================================================
function init_empresa(initData) {
  alert("empresa");
}



// ============================================================
// OBJETO GLOBAL window.empresa
// ============================================================
window.empresa = {
html: `
        <div class="container mt-4">
            <div class="row justify-content-center">
                <div class="col-md-4">

                    <div class="card shadow-sm">
                        <div class="card-body">

                            <h4 class="text-center mb-3">
                                Iniciar sesión
                            </h4>

                            <form id="form-login" data-modulo="login">

                                <div class="mb-3">
                                    <label class="form-label">
                                        Usuario
                                    </label>

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
                                    <label class="form-label">
                                        Contraseña
                                    </label>

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

                        </div>
                    </div>

                </div>
            </div>
        </div>
    `,


// ==========================================================
  // REGISTRAR EMPRESA
  // ==========================================================
  async registrar() {

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

    const nombreEmpresa =
      formData.get(
        "nombreEmpresa"
      );

    const nombreAdmin =
      formData.get(
        "nombreAdmin"
      );

    const emailAdmin =
      formData.get(
        "emailAdmin"
      );

    const movilAdmin =
      formData.get(
        "movilAdmin"
      );

    const password1 =
      formData.get(
        "password1"
      );

    const password2 =
      formData.get(
        "password2"
      );

    const logoEmpresa =
      formData.get(
        "logoEmpresa"
      );

    // ======================================================
    // VALIDACIONES
    // ======================================================
    if (
      password1 !== password2
    ) {

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

    // ======================================================
    // LOGO -> BASE64
    // ======================================================
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

    // ======================================================
    // PAYLOAD
    // ======================================================
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

    console.log(
      "[LOGIN] payload registro:",
      payload
    );

    await controller(

      "empresa",

      "registrar",

      payload,

    

    );

  },

// ==========================================================
// RETORNO REGISTRAR EMPRESA
// ==========================================================
async registrarRetorno(data) {
  try {
    // 1. Convertir a objeto si viene como string
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    console.log("[LOGIN] registrarRetorno() DATA:", data);

    alert(JSON.stringify(data, null, 2));

    // 2. Acceso seguro con encadenamiento opcional (?.)
    const token = data?.data?.token;
    alert("[token] " + (token || "Sin token"));

    if (!data.ok) {
      alert(data.mensaje || data.error || "Ocurrió un error");
      return;
    }

    Session.clear();

    if (token) {
      Session.setToken(token);
      window.TOKEN=Session.getToken();
    }

    // 3. Redirección a la vista login
    await router("login", token);

  } catch (error) {
    console.error("[LOGIN] Error en registrarRetorno:", error);
    alert("Error al procesar la respuesta: " + error.message);
  }
}};
