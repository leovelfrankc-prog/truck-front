import { Accion } from './Accion.js';

// ====================== VISTAS ======================
const vistaInstalar = {
  title: 'Instalar Truckero',
  components: [
    {
      type: 'alert',
      variant: 'info',
      content: 'Para disfrutar de la mejor experiencia y acceso sin conexión, instala Truckero en tu dispositivo.'
    },
    {
      type: 'button',
      id: 'btn-instalar-pwa',
      text: 'Instalar aplicación ahora',
      variant: 'primary',
      actions: [
        {
          type: 'install'
        }
      ]
    }
  ]
};

const vistaLogin = {
  title: 'Iniciar sesión - Truckero',
  components: [
    {
      type: 'text',
      content: 'Bienvenido de nuevo. Por favor, inicia sesión para continuar.'
    }
  ]
};

// ====================== CLASE MOTOR ======================
export class Motor {
  constructor(contenedorId = 'view-content') {
    this.contenedor = document.getElementById(contenedorId);
    this.componentesRegistrados = {};
    this.instancias = [];

    if (!this.contenedor) {
      console.error(`No se encontró el contenedor con id "${contenedorId}"`);
    }
  }

  /**
   * Registra un tipo de componente
   */
  registrar(tipo, ClaseComponente) {
    this.componentesRegistrados[tipo] = ClaseComponente;
  }

  /**
   * Renderiza una orientación completa
   */
  renderizar(orientacion = {}) {
    this.limpiar();

    if (orientacion.title) {
      document.title = orientacion.title;
      const tituloHeader = document.getElementById('app-title');
      if (tituloHeader) {
        tituloHeader.textContent = orientacion.title;
      }
    }

    const componentes = orientacion.components || [];
    componentes.forEach((config) => {
      const instancia = this.crearComponente(config);
      if (instancia) {
        const elemento = instancia.render();
        this.contenedor.appendChild(elemento);
        instancia.vincularEventos();
        this.instancias.push(instancia);
      }
    });

    if (orientacion.onLoad && Array.isArray(orientacion.onLoad)) {
      this.ejecutarAcciones(orientacion.onLoad);
    }
  }

  /**
   * Crea una instancia de componente
   */
  crearComponente(config) {
    if (!config || !config.type) {
      console.warn('Configuración de componente inválida:', config);
      return null;
    }

    const Clase = this.componentesRegistrados[config.type];
    if (!Clase) {
      console.warn(`Componente no registrado: "${config.type}"`);
      return null;
    }

    return new Clase(config, this);
  }

  /**
   * Limpia el contenedor y destruye las instancias actuales
   */
  limpiar() {
    this.instancias.forEach((instancia) => {
      if (typeof instancia.destruir === 'function') {
        instancia.destruir();
      }
    });
    this.instancias = [];

    if (this.contenedor) {
      this.contenedor.innerHTML = '';
    }
  }

  /**
   * Ejecuta una o varias acciones.
   * Acepta tanto un array de acciones como una sola acción.
   */
  ejecutarAcciones(acciones = []) {
    const lista = Array.isArray(acciones) ? acciones : [acciones];

    lista.forEach((configAccion) => {
      if (configAccion && typeof configAccion === 'object') {
        this.ejecutarAccion(configAccion);
      } else {
        console.warn('Acción inválida recibida:', configAccion);
      }
    });
  }

  /**
   * Ejecuta una sola acción
   */
  ejecutarAccion(configAccion, contexto = {}) {
    const accion = new Accion(configAccion, this);
    return accion.ejecutar(contexto); // ← importante: devolvemos la promesa
  }

  /**
   * Método principal de inicio de la aplicación
   */
  async inicio() {
    const estaInstalada =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    console.log(`Estado PWA - Standalone: ${estaInstalada}`);

    // 1. Si NO está instalada → vista local de instalación
    if (!estaInstalada) {
      this.renderizar(vistaInstalar);
      return;
    }

    // 2. Si SÍ está instalada → pedimos la vista al backend
    try {
      
      await this.ejecutarAccion({
        type: 'callApi',
        payload: {
          modulo: 'inicio',
          accion: 'cargarVista',
          payload: null
        }
      });
      console.log("DEBUG - window.TOKEN actual:", window.TOKEN);
    } catch (error) {
      console.error('Error al cargar la vista de inicio:', error);
      // Fallback
      this.renderizar(vistaLogin);
    }
  }
  // ====================== TOKEN ======================

  setToken(token) {
    if (token === null || token === undefined) {
      localStorage.removeItem('truckero_token');
      return;
    }
    localStorage.setItem('truckero_token', token);
  }

  getToken() {
    return localStorage.getItem('truckero_token');
  }

  removeToken() {
    localStorage.removeItem('truckero_token');
  }

  hasToken() {
    return !!this.getToken();
  }
}
