/**
 * Clase base de todos los componentes del motor
 */
export class Componente {
  constructor(config, motor) {
    this.config = config || {};
    this.motor = motor;
    this.elemento = null;
    this.id = this.config.id || null;
  }

  /**
   * Debe ser implementado por las clases hijas.
   * Debe devolver un HTMLElement.
   */
  render() {
    throw new Error(`El componente "${this.config.type}" debe implementar el método render()`);
  }

  /**
   * Vincula los eventos definidos en la orientación
   */
  vincularEventos() {
    if (!this.config.actions || !Array.isArray(this.config.actions) || !this.elemento) {
      return;
    }

    this.config.actions.forEach((accionConfig) => {
      const evento = accionConfig.event || 'click';

      this.elemento.addEventListener(evento, (e) => {
        // Evitar comportamientos por defecto en botones y links
        if (evento === 'click') e.preventDefault();

        this.motor.ejecutarAccion(accionConfig, {
          componente: this,
          evento: e
        });
      });
    });
  }

  /**
   * Limpieza cuando se destruye el componente
   */
  destruir() {
    this.elemento = null;
  }
}
