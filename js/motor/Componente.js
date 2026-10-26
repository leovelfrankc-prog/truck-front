/**
 * Clase base de todos los componentes del motor
 */
export class Componente {

  constructor(config, motor, tag = 'div') {
    this.tag = tag;
    this.config = config || {};
    this.motor = motor;
    this.elemento = null;
    this.id = this.config.id || null;
  }

  /**
   * Debe ser implementado por las clases hijas.
   */
  render() {
    throw new Error(
      `El componente "${this.config.type}" debe implementar el método render()`
    );
  }

  /**
   * Crea el elemento HTML asociado al componente.
   */
  crearElemento() {
    return document.createElement(this.tag);
  }

  /**
   * Aplica atributos comunes a todos los componentes.
   */
  aplicarAtributosBase() {

    if (!this.elemento) return;

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    // Clases CSS
    if (this.config.props?.class) {
      this.elemento.className = this.config.props.class;
    }

    // Título
    if (this.config.props?.title) {
      this.elemento.title = this.config.props.title;
    }

    // Visible/Oculto
    if (this.config.props?.hidden) {
      this.elemento.hidden = true;
    }

    // Estilos inline
    if (this.config.props?.style) {
      this.elemento.style.cssText = this.config.props.style;
    }

    // Atributos personalizados
    if (this.config.props?.attributes) {

      Object.entries(this.config.props.attributes)
        .forEach(([nombre, valor]) => {
          this.elemento.setAttribute(nombre, valor);
        });

    }
  }

  /**
   * Vincula eventos definidos en la configuración.
   */
  vincularEventos() {

    if (
      !this.config.actions ||
      !Array.isArray(this.config.actions) ||
      !this.elemento
    ) {
      return;
    }

    this.config.actions.forEach((accionConfig) => {

      const evento = accionConfig.event || 'click';

      this.elemento.addEventListener(evento, (e) => {

        if (accionConfig.preventDefault) {
          e.preventDefault();
        }

        if (
          this.motor &&
          typeof this.motor.ejecutarAccion === 'function'
        ) {
          this.motor.ejecutarAccion(
            accionConfig,
            {
              componente: this,
              evento: e
            }
          );
        }

      });

    });

  }

  /**
   * Devuelve el elemento HTML del componente.
   */
  getElemento() {
    return this.elemento;
  }

  /**
   * Elimina el componente del DOM.
   */
  destruir() {

    if (
      this.elemento &&
      this.elemento.parentNode
    ) {
      this.elemento.remove();
    }

    this.elemento = null;
  }

}
