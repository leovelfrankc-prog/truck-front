import { Componente } from '../motor/Componente.js';

export class Alerta extends Componente {

  constructor(config, motor) {
    super(config, motor, 'div');
  }

  render() {

    this.elemento = this.crearElemento();

    const tipo = this.config.props?.type || 'info';

    this.elemento.className = `alert alert-${tipo}`;

    this.elemento.setAttribute('role', 'alert');

    this.elemento.textContent =
      this.config.props?.text || '';

    this.aplicarAtributosBase();

    this.vincularEventos();

    return this.elemento;
  }

}
