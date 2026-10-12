import { Componente } from '../motor/Componente.js';

export class Texto extends Componente {
  render() {
    const tag = this.config.props?.tag || 'p';
    this.elemento = document.createElement(tag);

    // Contenido
    this.elemento.textContent = this.config.props?.text || '';

    // Clases
    if (this.config.props?.class) {
      this.elemento.className = this.config.props.class;
    }

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    return this.elemento;
  }
}
