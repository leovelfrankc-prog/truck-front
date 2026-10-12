import { Componente } from '../motor/Componente.js';

export class Alerta extends Componente {
  render() {
    this.elemento = document.createElement('div');

    const tipo = this.config.props?.type || 'info'; // success | danger | warning | info | primary
    this.elemento.className = `alert alert-${tipo}`;
    
    // Rol para accesibilidad
    this.elemento.setAttribute('role', 'alert');

    // Contenido
    this.elemento.textContent = this.config.props?.text || '';

    // ID
    if (this.id) {
      this.elemento.id = this.id;
    }

    return this.elemento;
  }
}
