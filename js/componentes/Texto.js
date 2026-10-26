import { Componente } from '../motor/Componente.js';

export class Texto extends Componente {
  constructor(config, motor) {
    // Si viene un tag en props lo usa, si no, por defecto usa 'p' y se lo pasa al padre
    super(config, motor, tag);
  }

  render() {
    this.elemento = this.crearElemento(); // Ya se crea con el tag correcto ('p' o el personalizado)
    this.elemento.textContent = this.config.props?.text || '';
    
    this.aplicarAtributosBase();
    this.vincularEventos();
    this.renderizarHijos(this.elemento);

    return this.elemento;
  }
}
