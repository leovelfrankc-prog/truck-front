/**
 * CAPA DE REGISTRO Y RENDIMIENTO DE VISTAS
 */
const Vistas = {
  templates: new Map(),

  /**
   * Registra una plantilla HTML por nombre de módulo
   */
  register(nombreModulo, htmlContent) {
    this.templates.set(nombreModulo, htmlContent);
    console.log(`[Vistas] Módulo '${nombreModulo}' registrado.`);
  },

  /**
   * Recupera una plantilla registrada
   */
  get(nombreModulo) {
    return this.templates.get(nombreModulo) || window[nombreModulo]?.html || null;
  },

  /**
   * Inyecta el HTML en el contenedor principal (#contenidoDinamico)
   */
  renderModule(params = {}, data = {}) {
    const targetId = params.targetId || "contenidoDinamico";
    const container = document.getElementById(targetId);

    if (!container) {
      console.error(`[Vistas] Contenedor #${targetId} no encontrado.`);
      return;
    }

    const modulo = typeof params === "string" ? params : params.moduleName;
    let html = params.html || this.get(modulo);

    if (!html) {
      console.warn(`[Vistas] No se encontró HTML para el módulo: ${modulo}`);
      return;
    }

    container.innerHTML = html;
    console.log(`[Vistas] Renderizado '${modulo}' en #${targetId}`);

    document.dispatchEvent(new CustomEvent("vistaRenderizada", { detail: { modulo, data } }));
  }
};

// Registro de la vista predeterminada para usuarios no instalados
Vistas.register("inicioNoInstalada", `
  <div class="card shadow-sm border-0 text-center py-4 px-3 my-3">
    <div class="card-body">
      <div class="mb-3">
        <span class="display-1 text-primary">🚛</span>
      </div>
      <h2 class="card-title fw-bold mb-2">Bienvenido a Truckero</h2>
      <p class="card-text text-muted mb-4">
        Instala la aplicación en tu dispositivo para trabajar sin conexión, recibir notificaciones en tiempo real y acceder rápidamente.
      </p>

      <div class="d-grid gap-2 col-12 col-md-8 mx-auto">
        <button id="btnInstalarApp" class="btn btn-primary btn-lg fw-bold" onclick="RecursosHTML.ejecutarInstalacion()">
          📲 Instalar Truckero
        </button>
      </div>

      <div class="mt-4 pt-3 border-top">
        <p class="small text-muted mb-0">¿Ya la instalaste o deseas continuar por la Web?</p>
        <button class="btn btn-link btn-sm text-decoration-none mt-1" onclick="Transporter.sendRequest('inicio', 'cargarVista')">
          Continuar versión Web &rarr;
        </button>
      </div>
    </div>
  </div>
`);
