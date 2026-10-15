import { Componente } from '../motor/Componente.js';

export class Formulario extends Componente {
  render() {
    this.elemento = document.createElement('form');
    this.elemento.className = this.config.props?.class || '';

    if (this.id) {
      this.elemento.id = this.id;
    }

    // Evitamos el submit por defecto para manejarlo con acciones del motor
    this.elemento.addEventListener('submit', (e) => {
      e.preventDefault();
      // Aquí puedes disparar acciones personalizadas de envío si lo deseas
    });

    // Renderizar componentes hijos (inputs, botones, etc.) dentro del form
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
