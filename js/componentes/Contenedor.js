import { Componente } from '../motor/Componente.js';

export class Contenedor extends Componente {

  constructor(config, motor) {
    super(config, motor, 'div');
  }

  render() {

    this.elemento = this.crearElemento();

    this.aplicarAtributosBase();

    this.renderizarHijos(this.elemento);

    this.vincularEventos();

    return this.elemento;
  }

}
