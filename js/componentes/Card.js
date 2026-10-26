import { Componente } from '../motor/Componente.js';

export class Card extends Componente {

  constructor(config, motor) {
    super(config, motor, 'div');
  }

  render() {

    this.elemento = this.crearElemento();

    this.elemento.className =
      this.config.props?.class || 'card shadow-sm';

    this.aplicarAtributosBase();

    const body = document.createElement('div');

    body.className =
      this.config.props?.bodyClass || 'card-body';

    this.renderizarHijos(body);

    this.elemento.appendChild(body);

    this.vincularEventos();

    return this.elemento;
  }

}
