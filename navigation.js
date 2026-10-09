/**
 * CAPA DE NAVEGACIÓN Y ESTADO DE APLICACIÓN
 */
const Navigation = {
  state: {
    currentRoute: null,
    history: [],
    appData: {}
  },

  /**
   * Cambia la ruta o dispara el inicializador del módulo
   */
  navigate(params = {}) {
    const route = typeof params === "string" ? params : params.route;
    if (!route) return;

    this.state.history.push(this.state.currentRoute);
    this.state.currentRoute = route;

    console.log(`[Navigation] Navegando a: ${route}`);

    if (typeof window.router === "function") {
      window.router(route);
    } else if (window[route] && typeof window[route][`init-${route}`] === "function") {
      window[route][`init-${route}`]();
    } else {
      Vistas.renderModule({ moduleName: route });
    }
  },

  /**
   * Redirecciona a enlaces externos
   */
  redirectExternal(params = {}) {
    const url = typeof params === "string" ? params : params.url;
    if (url) {
      window.location.href = url;
    }
  },

  /**
   * Actualiza el estado global en memoria y sincroniza con localStorage
   */
  setAppState(params = {}, data = {}) {
    const newState = params.state || data;
    this.state.appData = { ...this.state.appData, ...newState };

    if (params.saveSession) {
      localStorage.setItem("appState", JSON.stringify(this.state.appData));
    }

    console.log("[Navigation] Estado actualizado:", this.state.appData);
  }
};
