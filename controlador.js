async function controller(
  modulo,
  accion,
  payload,
  tokenFirmado
) {

  try {

    const respuesta = await apiFetch({
      modulo,
      accion,
      tokenFirmado,
      payload
    });

    if (!respuesta.ok) {
      throw new Error(
        respuesta.error || "Error de servidor"
      );
    }

    const nombreFuncion =
      accion + "Retorno";

    const funcionRetorno =
      window[nombreFuncion];

    if (
      typeof funcionRetorno === "function"
    ) {

      funcionRetorno(
        respuesta.data || {}
      );

    } else {

      console.warn(
        `No existe ${nombreFuncion}`
      );

    }

  } catch (error) {

    console.error(
      "Controller:",
      error
    );

  }

}
