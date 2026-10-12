import { Componente } from '../motor/Componente.js';

export class Card extends Componente {
  render() {
    this.elemento = document.createElement('div');
    this.elemento.className = this.config.props?.class || 'card shadow-sm';

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    // Body de la card
    const body = document.createElement('div');
    body.className = this.config.props?.bodyClass || 'card-body';

    // Renderizar componentes hijos
    if (Array.isArray(this.config.components)) {
      this.config.components.forEach((hijoConfig) => {
        const hijo = this.motor.crearComponente(hijoConfig);
        if (hijo) {
          const elementoHijo = hijo.render();
          body.appendChild(elementoHijo);
          hijo.vincularEventos();
          this.motor.instancias.push(hijo); // para que se limpien después
        }
      });
    }

    this.elemento.appendChild(body);
    return this.elemento;
  }
}
