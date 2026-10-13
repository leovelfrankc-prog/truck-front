/**
 * Clase que ejecuta las acciones definidas en las orientaciones
 */
export class Accion {
  constructor(config, motor) {
    this.config = config || {};
    this.motor = motor;
  }

  /**
   * Ejecuta la acción según su tipo
   * @param {Object} contexto - Información adicional (componente, evento, etc.)
   */
  ejecutar(contexto = {}) {
    const tipo = this.config.type;

    switch (tipo) {
      case 'install':
        this.#ejecutarInstalar(contexto);
        break;

      case 'navigate':
        this.#ejecutarNavegar(contexto);
        break;

      case 'showToast':
        this.#ejecutarShowToast(contexto);
        break;

      case 'showModal':
        this.#ejecutarShowModal(contexto);
        break;

      case 'callApi':
        this.#ejecutarCallApi(contexto);
        break;

      case 'setState':
        this.#ejecutarSetState(contexto);
        break;

      default:
        console.warn(`Tipo de acción no soportado: "${tipo}"`);
    }
  }

  // ==================== ACCIONES PRIVADAS ====================

  #ejecutarInstalar(contexto) {
    // Esta lógica se completará cuando implementemos la instalación PWA
    // Por ahora solo dejamos el punto de extensión
    console.log('Acción: install', contexto);
    alert("pincha instalar");

    // Ejemplo de cómo se llamará más adelante:
    // import { manejarInstalacion } from '../utilidades/instalacion.js';
    // manejarInstalacion();
  }

  #ejecutarNavegar(contexto) {
    const vista = this.config.payload?.view;
    if (!vista) {
      console.warn('Acción navigate sin vista definida');
      return;
    }
    console.log(`Navegar a: ${vista}`);
    // Más adelante: this.motor.cargarVista(vista);
  }

  #ejecutarShowToast(contexto) {
    const mensaje = this.config.payload?.message || 'Mensaje';
    const tipo = this.config.payload?.type || 'info'; // success, danger, warning, info
    console.log(`Toast [${tipo}]: ${mensaje}`);
    // Más adelante conectaremos con el sistema de toasts del index
  }

  #ejecutarShowModal(contexto) {
    console.log('Acción: showModal', this.config.payload);
  }

  #ejecutarCallApi(contexto) {
    console.log('Acción: callApi', this.config.payload);
  }

  #ejecutarSetState(contexto) {
    console.log('Acción: setState', this.config.payload);
  }
}
