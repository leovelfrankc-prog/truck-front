import { Accion } from './Accion.js';
import { crearVista } from '../vistas.js';

export class Motor {
  constructor(contenedorId = 'view-content') {
    this.contenedor = document.getElementById(contenedorId);
    this.instancias = [];
    this.vistas={};
    
    // Diccionario para almacenar los componentes registrados
    this.componentesRegistry = {};

    if (!this.contenedor) {
      console.error(`No se encontró el contenedor con id "${contenedorId}"`);
    }
  }

  /**
   * Registra un componente en el motor asociándolo a una clave (ej: 'text', 'button')
   * @param {string} tipo - Clave identificadora del componente
   * @param {Class} claseComponente - La clase del componente
   */
  registrar(tipo, claseComponente) {
    this.componentesRegistry[tipo] = claseComponente;
  }
  registrarVista(vista) {
    const htmlVista = crearVista(vista);
    this.vistas[vista] = htmlVista;
  }

  /**
   * Crea una instancia de un componente registrado
   * @param {string|Object} tipoOConfig - Puede ser el string del tipo ('text') o un objeto de config ({ type: 'text', props: {} })
   * @param {Object} propsOConfig - Las propiedades o configuración del componente
   */
  crearComponente(tipoOConfig, propsOConfig = {}) {
    let tipo;
    let config;

    // Soporta tanto motor.crearComponente('text', { text: 'Hola' }) 
    // como motor.crearComponente({ type: 'text', props: { text: 'Hola' } })
    if (typeof tipoOConfig === 'string') {
      tipo = tipoOConfig;
      config = { type: tipo, props: propsOConfig };
    } else if (tipoOConfig && typeof tipoOConfig === 'object') {
      tipo = tipoOConfig.type;
      config = tipoOConfig;
    } else {
      console.warn('Parámetro inválido para crearComponente:', tipoOConfig);
      return null;
    }

    const ClaseComponente = this.componentesRegistry[tipo];

    if (!ClaseComponente) {
      console.error(`El componente de tipo "${tipo}" no está registrado en el motor.`);
      return null;
    }

    // Instancia la clase pasándole la configuración y 'this' (el motor)
    return new ClaseComponente(config, this);
  }

  renderizar(componenteRaiz) {
    this.limpiar();
    if (componenteRaiz) {
      componenteRaiz.motor = this;
      const elementoDOM = componenteRaiz.render();
      this.contenedor.appendChild(elementoDOM);

      if (typeof componenteRaiz.vincularEventos === 'function') {
        componenteRaiz.vincularEventos();
      }
      this.instancias.push(componenteRaiz);
    }
  }

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

  async ejecutarAcciones(acciones) {
    if (!acciones) return [];

    const lista = Array.isArray(acciones) ? acciones : [acciones];
    const resultados = [];

    for (const configAccion of lista) {
      if (configAccion && typeof configAccion === 'object') {
        try {
          const resultado = await this._ejecutarUnaAccion(configAccion);
          resultados.push(resultado);
        } catch (error) {
          console.error('Error al ejecutar la acción:', configAccion, error);
          throw error;
        }
      } else {
        console.warn('Acción inválida recibida:', configAccion);
      }
    }

    return resultados;
  }

  _ejecutarUnaAccion(configAccion, contexto = {}) {
    const accion = new Accion(configAccion, this);
    return accion.ejecutar(contexto);
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
