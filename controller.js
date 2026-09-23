async function controller(
  modulo,
  accion,
  payload
) {

  const tokenFirmado =
    Session.getToken();

  try {

    const respuesta =
      await apiFetch({

        modulo,
        accion,
        tokenFirmado,
        payload

      });

    // ==========================================
    // EJECUTAR SIEMPRE EL RETORNO
    // ==========================================
    const funcionRetorno =
      window[modulo]?.[
        accion + "Retorno"
      ];

    if (
      typeof funcionRetorno ===
      "function"
    ) {

      funcionRetorno(
        respuesta
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

    const funcionRetorno =
      window[modulo]?.[
        accion + "Retorno"
      ];

    if (
      typeof funcionRetorno ===
      "function"
    ) {

      funcionRetorno({

        ok: false,

        mensaje:
          "Error de comunicación",

        error:
          error.message

      });

    }

    return {

      ok: false,

      mensaje:
        "Error de comunicación",

      error:
        error.message

    };

  }

}
