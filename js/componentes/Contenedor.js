import { Componente } from '../motor/Componente.js';

export class Contenedor extends Componente {
  constructor(config, motor, tag = 'div') {
    // Si viene un tag en props o se pasa por parámetro, lo usa; si no, por defecto 'div'
    super(config, motor, config?.props?.tag || tag);
  }

  render() {
    this.elemento = this.crearElemento();

    this.aplicarAtributosBase();
    this.renderizarHijos(this.elemento);
    this.vincularEventos();

    return this.elemento;
  }
}
