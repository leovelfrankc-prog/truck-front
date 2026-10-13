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

  /**
   * Dispara el diálogo de instalación de la PWA.
   * Si el usuario acepta e instala la app:
   *  - Obtiene el token de la URL
   *  - Lo guarda en localStorage
   *  - Muestra una alerta con el token
   */
  async #ejecutarInstalar(contexto) {
    // 1. Si todavía no hemos capturado el evento, lo intentamos capturar ahora
    //    (aunque lo ideal es capturarlo lo más temprano posible)
    if (!window.__truckeroDeferredPrompt) {
      // Intentamos escuchar por si aún no se ha disparado
      const capturePrompt = (e) => {
        e.preventDefault();
        window.__truckeroDeferredPrompt = e;
      };
      window.addEventListener('beforeinstallprompt', capturePrompt, { once: true });
    }

    const deferredPrompt = window.__truckeroDeferredPrompt;

    // 2. Si no hay prompt disponible → mostramos instrucciones manuales
    if (!deferredPrompt) {
      this.#mostrarMensajeInstalacionManual();
      return;
    }

    try {
      // 3. Mostramos el diálogo nativo de instalación
      deferredPrompt.prompt();

      // 4. Esperamos la decisión del usuario
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la aplicación');

        // 5. Obtenemos el token de la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          // 6. Guardamos el token usando el motor
          this.motor.setToken(token);

          // 7. Mostramos la alerta con el token
          alert(`Token guardado correctamente:\n\n${token}`);

          // 8. Limpiamos el token de la barra de direcciones
          const nuevaUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, nuevaUrl);
        } else {
          alert('Aplicación instalada, pero no se encontró el token en la URL');
        }
      } else {
        console.log('Usuario rechazó la instalación');
      }
    } catch (error) {
      console.error('Error al intentar instalar la PWA:', error);
      alert('No se pudo mostrar el diálogo de instalación');
    } finally {
      // Limpiamos el prompt para que no se pueda usar de nuevo
      window.__truckeroDeferredPrompt = null;
    }
  }

  /**
   * Mensaje de ayuda cuando no se puede usar el diálogo nativo
   * (iOS, navegadores antiguos, o cuando ya está instalada)
   */
  #mostrarMensajeInstalacionManual() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      alert('La aplicación ya está instalada en este dispositivo.');
      return;
    }

    if (isIOS) {
      alert(
        'Para instalar Truckero en iOS:\n\n' +
          '1. Toca el botón Compartir (□↑)\n' +
          '2. Selecciona "Añadir a pantalla de inicio"'
      );
    } else {
      alert(
        'Tu navegador no permite la instalación automática.\n\n' +
          'Prueba con Chrome en Android o busca la opción "Instalar aplicación" en el menú del navegador.'
      );
    }
  }

  #ejecutarNavegar(contexto) {
    console.log('Acción: navigate', this.config.payload);
  }

  #ejecutarShowToast(contexto) {
    const mensaje = this.config.payload?.message || 'Mensaje';
    const tipo = this.config.payload?.type || 'info';
    console.log(`Toast [${tipo}]: ${mensaje}`);
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
