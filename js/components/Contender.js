import { Componente } from '../motor/Componente.js';

export class Contenedor extends Componente {
  render() {
    this.elemento = document.createElement('div');

    // Clases
    if (this.config.props?.class) {
      this.elemento.className = this.config.props.class;
    }

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    // Renderizar componentes hijos
    if (Array.isArray(this.config.components)) {
      this.config.components.forEach((hijoConfig) => {
        const hijo = this.motor.crearComponente(hijoConfig);
        if (hijo) {
          const elementoHijo = hijo.render();
          this.elemento.appendChild(elementoHijo);
          hijo.vincularEventos();
          this.motor.instancias.push(hijo);
        }
      });
    }

    return this.elemento;
  }
}
