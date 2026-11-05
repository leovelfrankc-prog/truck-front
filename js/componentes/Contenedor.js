import { Componente } from '/truck-front/js/componentes/Componente.js';

/**
 * Clase Contenedor: Agrupa componentes ya instanciados previamente,
 * gestiona su renderizado en el DOM y consolida su memoria.
 */
export class Contenedor extends Componente {
  constructor(config, motor) {
    const tag = config.props?.tag || 'div';
    super(config, motor, tag);

    // Array que almacena las referencias directas a las instancias de los hijos
    this.hijosInstanciados = [];
  }

  /**
   * Añade una instancia de componente ya creada al contenedor, 
   * la renderiza y guarda su referencia.
   * @param {Componente} hijo 
   */
  anadirHijo(hijo) {
    if (!hijo) return;

    // Renderizamos el hijo y lo añadimos al DOM del contenedor
    const elementoHijo = hijo.render();
    this.elemento.appendChild(elementoHijo);

    // Registramos la instancia en el motor global (si aplica) y en nuestro array local
    if (this.motor && Array.isArray(this.motor.instancias)) {
      this.motor.instancias.push(hijo);
    }
    this.hijosInstanciados.push(hijo);

    return hijo;
  }

  /**
   * Recorre la memoria de todos sus hijos que tengan un ID asignado
   * y devuelve un objeto consolidado con sus datos.
   */
  obtenerDatosHijos() {
    const datosConsolidados = {};

    this.hijosInstanciados.forEach((hijo) => {
      if (hijo.config && hijo.config.id) {
        datosConsolidados[hijo.config.id] = hijo.obtenerMemoria();
      }
    });

    return datosConsolidados;
  }

  /**
   * Método render obligatorio
   */
  render() {
    this.aplicarAtributosBase();

    // Si la configuración incluye un array de hijos YA INSTANCIADOS, los procesamos
    if (Array.isArray(this.config.components)) {
      this.config.components.forEach((hijoInstancia) => {
        this.anadirHijo(hijoInstancia);
      });
    }

    this.vincularEventos();

    return this.elemento;
  }
}
