async function router(modulo, tokenFirmado) {

  try {

    const respuesta = await apiFetch({
      modulo,
      accion: "cargarVista",
      tokenFirmado,
      payload: {}
    });

    if (!respuesta.ok) {
      throw new Error(
        respuesta.error || "Error al cargar la vista"
      );
    }

    // 1. Insertar HTML

    const contenedor =
      document.getElementById("vistas");

    contenedor.innerHTML =
      respuesta.html || "";

    // 2. Insertar JS

    if (respuesta.js) {

      const script =
        document.createElement("script");

      script.type = "text/javascript";

      script.textContent =
        respuesta.js;

      document.body.appendChild(script);

    }

    // 3. Ejecutar initModulo()

    const nombreFuncion =
      "init" +
      modulo.charAt(0).toUpperCase() +
      modulo.slice(1);

    const initFuncion =
      window[nombreFuncion];

    if (
      typeof initFuncion === "function"
    ) {

      initFuncion(
        respuesta.initData || {}
      );

    } else {

      console.warn(
        `${nombreFuncion} no existe`
      );

    }

  } catch (error) {

    console.error(
      "Router:",
      error
    );

  }

}
