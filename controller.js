// ============================================================
// CONTROLLER UNIVERSAL
// ============================================================
async function controller(
  modulo,
  accion,
  payload,
  
) {
const tokenFirmado=Session.getToken();
  try {

    const respuesta =
      await apiFetch({

        modulo,
        accion,
        tokenFirmado,
        payload

      });

    if (!respuesta.ok) {

      throw new Error(
        respuesta.error ||
        "Error de servidor"
      );

    }

    // ==========================================
    // BUSCAR FUNCIÓN DE RETORNO
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
        respuesta.data || {}
      );

    } else {

      console.warn(
        `No existe ${modulo}.${accion}Retorno`
      );

    }

  } catch (error) {

    console.error(
      "[CONTROLLER]",
      error
    );

  }

}
