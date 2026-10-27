import { Componente } from '../motor/Componente.js';

export class Boton extends Componente {
  constructor(config, motor) {
    super(config, motor, config?.props?.tag || 'button');
  }

  render() {
    this.elemento = this.crearElemento();
    this.elemento.type = this.config.props?.type || 'button';

    // Clases (Bootstrap por defecto)
    this.elemento.className = this.config.props?.class || 'btn btn-primary';

    // Contenido (soporta HTML para iconos)
    this.elemento.innerHTML = this.config.props?.text || 'Botón';

    // Disabled
    if (this.config.props?.disabled) {
      this.elemento.disabled = true;
    }

    // Heredamos los atributos base (ID, estilos, etc.) y los eventos (actions)
    this.aplicarAtributosBase();
    this.vincularEventos();

    return this.elemento;
  }
}
