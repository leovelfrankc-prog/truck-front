/**
 * CAPA DE RECURSOS HTML Y CONTROL DEL DOM
 */
const RecursosHTML = {
  selectors: {
    modal: "modalUniversal",
    modalContenido: "modalUniversalContenido",
    notificaciones: "zonaNotificaciones"
  },

  eventoInstalacion: null,

  /**
   * Captura el evento nativo de instalación de la PWA
   */
  inicializarInstaladorPWA() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.eventoInstalacion = e;
      console.log("[PWA] Evento 'beforeinstallprompt' capturado.");

      const btn = document.getElementById("btnInstalarApp");
      if (btn) btn.classList.remove("d-none");
    });

    window.addEventListener("appinstalled", () => {
      console.log("[PWA] Aplicación instalada con éxito.");
      this.eventoInstalacion = null;
      if (typeof Transporter !== "undefined") {
        Transporter.sendRequest("inicio", "cargarVista");
      }
    });
  },

  /**
   * Dispara el prompt nativo de instalación desde el botón
   */
  async ejecutarInstalacion() {
    if (!this.eventoInstalacion) {
      const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (esIOS) {
        alert("En iOS: presiona el botón 'Compartir' en Safari y selecciona 'Agregar a la pantalla de inicio'.");
      } else {
        alert("La aplicación ya está instalada o tu navegador no soporta la instalación directa.");
      }
      return;
    }

    this.eventoInstalacion.prompt();
    const { outcome } = await this.eventoInstalacion.userChoice;
    console.log(`[PWA] Elección del usuario: ${outcome}`);
    this.eventoInstalacion = null;
  },

  /**
   * Actualiza dinámicamente los campos de un formulario
   */
  updateForm(params = {}, data = {}) {
    const form = document.getElementById(params.formId);
    if (!form) return;

    const values = params.data || data;
    Object.keys(values).forEach((key) => {
      const field = form.querySelector(`[name="${key}"], #${key}`);
      if (field) {
        field.value = values[key];
      }
    });
  },

  /**
   * Abre el Modal Universal inyectando contenido
   */
  openModal(params = {}, data = {}) {
    const modalEl = document.getElementById(params.modalId || this.selectors.modal);
    const modalBody = document.getElementById(this.selectors.modalContenido);

    if (modalBody && params.html) {
      modalBody.innerHTML = params.html;
    }

    if (modalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    }
  },

  /**
   * Cierra el Modal Universal
   */
  closeModal(params = {}) {
    const modalEl = document.getElementById(params.modalId || this.selectors.modal);
    if (modalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }
  },

  /**
   * Inyecta notificaciones o Toasts en la zona fija
   */
  showNotification(params = {}) {
    const contenedor = document.getElementById(this.selectors.notificaciones);
    const type = params.type || "info"; // 'success', 'danger', 'warning', 'info'
    const message = params.message || "";

    if (!contenedor) {
      alert(`[${type.toUpperCase()}] ${message}`);
      return;
    }

    const htmlAlert = `
      <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    contenedor.innerHTML = htmlAlert;

    if (params.autoClose !== false) {
      setTimeout(() => {
        const alertEl = contenedor.querySelector(".alert");
        if (alertEl && typeof bootstrap !== "undefined") {
          const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
          bsAlert.close();
        }
      }, params.duration || 4000);
    }
  }
};

RecursosHTML.inicializarInstaladorPWA();
