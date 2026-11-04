import { Componente } from './Componente.js';

/**
 * Clase Boton: Componente hoja para acciones e interacciones del usuario.
 */
export class Boton extends Componente {
  constructor(config, motor) {
    // Hereda de Componente y define el tag HTML como 'button'
    super(config, motor, 'button');
  }

  render() {
    // 1. Tipo de botón ('button', 'submit', 'reset') por defecto 'button'
    const tipoBoton = this.config.props?.type || 'button';
    this.elemento.type = tipoBoton;

    // 2. Texto o etiqueta interna del botón
    const textoBoton = this.config.props?.text || 'Botón';
    this.elemento.textContent = textoBoton;

    // 3. Estado deshabilitado si viene configurado
    if (this.config.props?.disabled) {
      this.elemento.disabled = true;
    }

    // 4. Aplicamos atributos base comunes (clases CSS, estilos, ID, etc.)
    this.aplicarAtributosBase();

    // 5. Vinculamos los eventos (el click que dispara la acción en el motor)
    this.vincularEventos();

    // 6. Retornamos el elemento DOM listo
    return this.elemento;
  }
}
