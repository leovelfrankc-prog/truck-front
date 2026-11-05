import { Accion } from '/truck-front/js/motor/Accion.js';
import { crearVista } from '/truck-front/js/vistas/vistas.js';

export class Motor {
  constructor(contenedorId = 'view-content') {
    this.contenedor = document.getElementById(contenedorId);
    
    // Almacena las instancias de componentes activos en la vista actual
    this.instancias = [];
    
    // Diccionario para almacenar las VISTAS instanciadas por rol/nombre
    this.vistas = {};
    
    // Diccionario para almacenar los componentes registrados ('input', 'button', etc.)
    this.componentesRegistry = {};

    if (!this.contenedor) {
      console.error(`No se encontró el contenedor con id "${contenedorId}"`);
    }
  }

  /**
   * Registra un componente en el motor asociándolo a una clave (ej: 'input', 'button')
   */
  registrar(tipo, claseComponente) {
    this.componentesRegistry[tipo] = claseComponente;
  }

  /**
   * Pre-instancia y registra una vista en la memoria del motor (Ideal para RBAC)
   */
  registrarVista(nombreVista) {
    // Le pasamos 'this' (el motor) para que la vista nazca conectada
    const instanciaVista = crearVista(nombreVista, this);
    if (instanciaVista) {
      this.vistas[nombreVista] = instanciaVista;
    }
  }

  /**
   * Cambia la vista activa en pantalla utilizando las vistas ya instanciadas en memoria
   */
  cambiarVista(nombreVista) {
    const vista = this.vistas[nombreVista];
    
    if (!vista) {
      console.error(`La vista "${nombreVista}" no está registrada o no tienes permisos.`);
      return;
    }

    // 1. Limpiamos el contenedor DOM principal (pero SIN destruir las vistas en memoria)
    if (this.contenedor) {
      this.contenedor.innerHTML = '';
    }

    // 2. Renderizamos la vista y la insertamos en el DOM
    const elementoDOM = vista.render();
    this.contenedor.appendChild(elementoDOM);

    // Guardamos la referencia de la vista actual si lo necesitas
    this.vistaActual = vista;
  }

  /**
   * Crea una instancia de un componente registrado (mantiene tu lógica original excelente)
   */
  crearComponente(tipoOConfig, propsOConfig = {}) {
    let tipo;
    let config;

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

    return new ClaseComponente(config, this);
  }

  /**
   * Limpia la aplicación al cerrar sesión
   */
  destruirTodo() {
    this.vistas = {};
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
