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

      async enviar() {

    const form =
      document.getElementById(
        "form-login"
      );

    if (!form) {

      alert(
        "Error: formulario no encontrado."
      );

      return;
    }

    const formData =
      new FormData(form);

    const usuario =
      formData.get(
        "usuario"
      );

    const password =
      formData.get(
        "password"
      );

    const payload = {
      usuario,
      password
    };
   const mensaje = {
  usuario,
  password,
  token: window.TOKEN
};

alert(
  JSON.stringify(
    mensaje,
    null,
    2
  )
);
    await controller(
      "login",
      "validar",
      payload
    );

  },

  // ==========================================================
  // RETORNO VALIDACIÓN
  // ==========================================================
  validarRetorno(res) {
   alert(JSON.stringify(res));
    console.log(
      "====================================="
    );

    console.log(
      "[LOGIN] validarRetorno()"
    );

    console.log(
      "[LOGIN] respuesta:",
      res
    );

    if (
      !res ||
      typeof res !== "object"
    ) {

      alert(
        "Error inesperado en la respuesta del servidor."
      );

      return;
    }

    if (!res.ok) {

      alert(
        JSON.stringify(res)
      );

      return;
    }

    const payload =
      res.payload;

    console.log(
      "[LOGIN] payload:",
      payload
    );

    alert(
      res.mensaje ||
      "Inicio de sesión exitoso"
    );

  }

};

///hasta aqui
