import { Accion } from './Accion.js';

// Definición correcta de las vistas (como objetos literales)
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
          type: 'install' // Esto disparará la acción de instalación en tu clase Accion
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
    // Aquí puedes agregar tus componentes de formulario de login en el futuro
  ]
};

/**
 * Motor genérico que interpreta y renderiza orientaciones JSON
 */
export class Motor {
  constructor(contenedorId = 'view-content') {
    this.contenedor = document.getElementById(contenedorId);
    this.componentesRegistrados = {};
    this.instancias = []; // Componentes actualmente renderizados

    if (!this.contenedor) {
      console.error(`No se encontró el contenedor con id "${contenedorId}"`);
    }
  }

  /**
   * Registra un tipo de componente
   * @param {string} tipo - Nombre del tipo (ej: "button", "text")
   * @param {class} ClaseComponente - Clase que hereda de Componente
   */
  registrar(tipo, ClaseComponente) {
    this.componentesRegistrados[tipo] = ClaseComponente;
  }

  /**
   * Renderiza una orientación completa
   * @param {Object} orientacion - Objeto JSON de orientación
   */
  renderizar(orientacion = {}) {
    this.limpiar();

    // Actualizar título de la página si viene
    if (orientacion.title) {
      document.title = orientacion.title;

      // Opcional: actualizar también el título del header
      const tituloHeader = document.getElementById('app-title');
      if (tituloHeader) {
        tituloHeader.textContent = orientacion.title;
      }
    }

    // Renderizar componentes
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

    // Ejecutar acciones onLoad
    if (orientacion.onLoad && Array.isArray(orientacion.onLoad)) {
      this.ejecutarAcciones(orientacion.onLoad);
    }
  }

  /**
   * Crea una instancia de componente a partir de su configuración
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
   * Ejecuta una lista de acciones
   */
  ejecutarAcciones(acciones = []) {
    acciones.forEach((configAccion) => {
      this.ejecutarAccion(configAccion);
    });
  }

  /**
   * Ejecuta una sola acción
   */
  ejecutarAccion(configAccion, contexto = {}) {
    const accion = new Accion(configAccion, this);
    accion.ejecutar(contexto);
  }

  /**
   * Método principal de inicio de la aplicación
   */
  inicio() {
    const estaInstalada = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    console.log(`Estado PWA - Standalone: ${estaInstalada}`);

    // Bifurcación según el estado de instalación
    if (!estaInstalada) {
      this.renderizar(vistaInstalar);
    } else {
      this.renderizar(vistaLogin);
    }
  }
}
