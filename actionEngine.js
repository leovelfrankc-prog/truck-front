/**
 * CAPA MOTOR DE ACCIONES
 */
const ActionEngine = {
  actions: new Map(),

  /**
   * Registra una acción por su identificador
   */
  registerAction(actionName, handler) {
    if (typeof handler !== "function") {
      throw new Error(`[ActionEngine] El handler de '${actionName}' debe ser una función.`);
    }
    this.actions.set(actionName, handler);
    console.log(`[ActionEngine] Acción registrada: ${actionName}`);
  },

  /**
   * Despacha una acción registrada o la envía vía Transporter
   */
  async dispatchAction(nextAction, data = {}, options = {}) {
    console.log(`[ActionEngine] Despachando acción: ${nextAction}`);
    try {
      if (this.actions.has(nextAction)) {
        const handler = this.actions.get(nextAction);
        return await handler(data, options);
      } else {
        // Si no está localmente, se envía al backend vía Transporter
        const [modulo, accion] = nextAction.split(".");
        return await Transporter.sendRequest(modulo || "inicio", accion || nextAction, data, options);
      }
    } catch (error) {
      this.handleError(error, { nextAction, data, options });
    }
  },

  /**
   * Manejador central de excepciones
   */
  handleError(error, context = {}) {
    console.error("[ActionEngine Error] Contexto:", context, "\nDetalle:", error);

    RecursosHTML.showNotification({
      type: "danger",
      message: error.message || "Ocurrió un error inesperado al procesar la solicitud."
    });
  }
};

// Capturador delegado de eventos click en el DOM (data-action)
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (target) {
    e.preventDefault();
    const actionName = target.getAttribute("data-action");
    const payloadRaw = target.getAttribute("data-payload");
    let payload = {};

    if (payloadRaw) {
      try { payload = JSON.parse(payloadRaw); } catch (err) { payload = {}; }
    }

    ActionEngine.dispatchAction(actionName, payload);
  }
});
