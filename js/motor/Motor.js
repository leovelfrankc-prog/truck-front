import { Accion } from './Accion.js';

export class Motor {
  constructor(contenedorId = 'view-content') {
    this.contenedor = document.getElementById(contenedorId);
    this.instancias = [];

    if (!this.contenedor) {
      console.error(`No se encontró el contenedor con id "${contenedorId}"`);
    }
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

  /**
   * ÚNICO PUNTO DE ENTRADA PARA ACCIONES
   */
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
