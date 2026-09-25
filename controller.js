async function controller(
  modulo,
  accion,
  payload
) {

  const token = typeof TOKEN !== "undefined" ? TOKEN : Session.getToken();

  console.log("=====================================");
  console.log("[CONTROLLER] INICIO");
  console.log("[CONTROLLER] MODULO:", modulo);
  console.log("[CONTROLLER] ACCION:", accion);
  console.log("[CONTROLLER] TOKEN:", tokenFirmado);
  console.log("[CONTROLLER] PAYLOAD:", payload);

  try {

    const respuesta =
      await apiFetch({

        modulo,
        accion,
        tokenFirmado,
        payload

      });

    console.log("=====================================");
    console.log("[CONTROLLER] RESPUESTA BACKEND:");
    console.log(respuesta);

    console.log(
      "[CONTROLLER] RESPUESTA JSON:"
    );

    console.log(
      JSON.stringify(
        respuesta,
        null,
        2
      )
    );

    const nombreFuncion =
      accion + "Retorno";

    console.log(
      "[CONTROLLER] NOMBRE FUNCION:",
      nombreFuncion
    );

    console.log(
      "[CONTROLLER] BUSCANDO:",
      `window.${modulo}.${nombreFuncion}`
    );

    const funcionRetorno =
      window[modulo]?.[
        nombreFuncion
      ];

    console.log(
      "[CONTROLLER] MODULO ENCONTRADO:",
      window[modulo]
    );

    console.log(
      "[CONTROLLER] FUNCION ENCONTRADA:",
      funcionRetorno
    );

    if (
      typeof funcionRetorno ===
      "function"
    ) {

      console.log(
        "[CONTROLLER] EJECUTANDO RETORNO..."
      );

      funcionRetorno(
        respuesta
      );

    } else {

      console.warn(
        `[CONTROLLER] NO EXISTE ${modulo}.${nombreFuncion}`
      );

      alert(
        `NO EXISTE ${modulo}.${nombreFuncion}`
      );

    }

    return respuesta;

  } catch (error) {

    console.error(
      "[CONTROLLER] EXCEPCION:",
      error
    );

    console.log(
      "[CONTROLLER] STACK:"
    );

    console.log(
      error?.stack
    );

    const nombreFuncion =
      accion + "Retorno";

    console.log(
      "[CONTROLLER] INTENTANDO RETORNO ERROR:"
    );

    console.log(
      `window.${modulo}.${nombreFuncion}`
    );

    const funcionRetorno =
      window[modulo]?.[
        nombreFuncion
      ];

    if (
      typeof funcionRetorno ===
      "function"
    ) {

      console.log(
        "[CONTROLLER] EJECUTANDO RETORNO DE ERROR..."
      );

      funcionRetorno({

        ok: false,

        mensaje:
          "Error de comunicación",

        error:
          error.message,

        stack:
          error.stack

      });

    }

    return {

      ok: false,

      mensaje:
        "Error de comunicación",

      error:
        error.message,

      stack:
        error.stack

    };

  }

}
