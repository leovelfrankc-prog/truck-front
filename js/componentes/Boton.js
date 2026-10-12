import { Componente } from '../motor/Componente.js';

export class Boton extends Componente {
  render() {
    this.elemento = document.createElement('button');
    this.elemento.type = this.config.props?.type || 'button';

    // Clases (Bootstrap por defecto)
    this.elemento.className = this.config.props?.class || 'btn btn-primary';

    // Contenido (soporta HTML para iconos)
    this.elemento.innerHTML = this.config.props?.text || 'Botón';

    // Disabled
    if (this.config.props?.disabled) {
      this.elemento.disabled = true;
    }

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    return this.elemento;
  }
}
