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
    console.group("🚀 [DEBUG ACCIÓN] Ejecutando Navegar");
    console.log("1. Configuración completa de la acción:", this.config);
    console.log("2. Payload recibido (lo que va a renderizar el motor):", this.config.payload);
    
    // Verificación de seguridad para evitar que colapse si llega vacío
    if (!this.config.payload) {
      console.warn("⚠️ ALERTA: El payload de navigate está vacío o es undefined.");
    } else {
      console.log("3. Título de la vista:", this.config.payload.title);
      console.log("4. Componentes a renderizar:", this.config.payload.components);
    }
    console.groupEnd();

    // Ejecutamos el renderizado del motor
     this.motor.renderizar(this.config.payload);
    this.ejecutar({
      type:"callApi",
      payload:{
        modulo:"inicio",
        accion:"cargarVista",
        payload:"True"}})
  }

  #ejecutarShowToast(contexto) {
    const mensaje = this.config.payload?.message || 'Mensaje';
    const tipo = this.config.payload?.type || 'info';
    console.log(`Toast [${tipo}]: ${mensaje}`);
    alert(`Toast [${tipo}]: ${mensaje}`);
  }

  #ejecutarShowModal(contexto) {
    console.log('Acción: showModal', this.config.payload);
  }

/**
 * Ejecuta una llamada al backend (Google Apps Script)
 * Basada en la función apiFetch que ya funcionaba correctamente.
 */
async #ejecutarCallApi(contexto) {
  const config = this.config || {};
  const payloadConfig = config.payload || {};

  const url = "https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec";

  try {
    // Body exactamente igual al que usabas en apiFetch
    const body = {
      requestId: (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'req-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      modulo: payloadConfig.modulo || config.modulo || '',
      accion: payloadConfig.accion || config.accion || '',
      tokenFirmado: window.TOKEN || null,
      payload: payloadConfig.payload ?? payloadConfig.data ?? {}
    };

    console.log('Enviando al backend:', body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Respuesta del backend:', data);

    // -------------------------------------------------------
    // El backend puede responder de varias formas:
    // 1. Array de acciones → [ {...}, {...} ]
    // 2. Objeto con "acciones" → { acciones: [...] }
    // 3. Una sola acción → { type: '...' }
    // -------------------------------------------------------
    let acciones = [];

    if (Array.isArray(data)) {
      acciones = data;
    } else if (data && Array.isArray(data.acciones)) {
      acciones = data.acciones;
    } else if (data && data.type) {
      acciones = [data];
    } else if (data && data.ok === false) {
      // Error de negocio del backend
      console.warn('Backend respondió con error:', data);
      acciones = [{
        type: 'showToast',
        payload: {
          message: data.mensaje || data.error || 'Error en la operación',
          type: 'error'
        }
      }];
    } else {
      console.warn('Respuesta del backend no contiene acciones reconocibles:', data);
      return;
    }

    // Ejecutamos las acciones recibidas
    this.motor.ejecutarAcciones(acciones);

  } catch (error) {
    console.error('Error en callApi:', error);

    this.motor.ejecutarAcciones([
      {
        type: 'showToast',
        payload: {
          message: 'No se pudo comunicar con el servidor',
          type: 'error'
        }
      }
    ]);
  }
}
  #ejecutarSetState(contexto) {
    console.log('Acción: setState', this.config.payload);
  }
}
