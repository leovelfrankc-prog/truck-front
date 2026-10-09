/**
 * CAPA TRANSPORTER DE RED Y EJECUCIÓN
 */
const Transporter = {
  // REEMPLAZAR CON TU SCRIPT ID DESPLEGADO COMO APLICACIÓN WEB
  url: "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec",

  async sendRequest(modulo, accion, payload = {}, options = {}) {
    const bodyData = {
      modulo,
      accion,
      payload,
      token: window.TOKEN || localStorage.getItem("token") || null,
      version: window.APP_VERSION || "20260929"
    };

    console.log(`[Transporter] Enviando -> ${modulo}.${accion}`, payload);

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`Error de red HTTP ${response.status}`);
      }

      const res = await response.json();
      return this.processResponse(res);

    } catch (error) {
      console.error("[Transporter] Error en la petición:", error);
      if (typeof ActionEngine !== "undefined") {
        ActionEngine.handleError(error, { modulo, accion });
      }
    }
  },

  /**
   * Interpreta la respuesta y ejecuta las capas correspondientes
   */
  processResponse(res) {
    if (!res || res.ok === false) {
      throw new Error(res?.error || "Respuesta inválida del servidor.");
    }

    const { codigo, data, uiInstructions, navigation, nextAction } = res;

    // 1. Evaluación de código ejecutable enviado desde Apps Script (HATEOAS)
    if (codigo) {
      console.log("[Transporter] Compilando código dinámico...");
      const dynamicFn = new Function("data", "Engine", "UI", "Nav", "Vistas", codigo);
      dynamicFn(data, ActionEngine, RecursosHTML, Navigation, Vistas);
    }

    // 2. Ejecución de instrucciones directas de UI
    if (uiInstructions) {
      if (uiInstructions.render) Vistas.renderModule(uiInstructions.render, data);
      if (uiInstructions.form) RecursosHTML.updateForm(uiInstructions.form, data);
      if (uiInstructions.modal) RecursosHTML.openModal(uiInstructions.modal, data);
      if (uiInstructions.notification) RecursosHTML.showNotification(uiInstructions.notification);
    }

    // 3. Instrucciones de Navegación
    if (navigation) {
      Navigation.navigate(navigation);
    }

    // 4. Encadenamiento de siguiente acción
    if (nextAction) {
      ActionEngine.dispatchAction(nextAction, data);
    }

    return res;
  }
};
