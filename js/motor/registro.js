/**
 * Punto central de registro de componentes del motor.
 * Aquí se importan y registran todos los componentes disponibles.
 */

import { Motor } from './Motor.js';

// Importamos todos los componentes
import { Texto } from '../componentes/Texto.js';
import { Boton } from '../componentes/Boton.js';
import { Card } from '../componentes/Card.js';
import { Contenedor } from '../componentes/Contenedor.js';
import { Alerta } from '../componentes/Alerta.js';

/**
 * Crea una instancia del motor y registra los componentes disponibles.
 * @param {string} contenedorId - ID del contenedor donde se renderizará
 * @returns {Motor}
 */
export function crearMotor(contenedorId = 'view-content') {
  const motor = new Motor(contenedorId);

  // Registro de componentes
  motor.registrar('text', Texto);
  motor.registrar('button', Boton);
  motor.registrar('card', Card);
  motor.registrar('container', Contenedor);
  motor.registrar('alert', Alerta);

  return motor;
}

// Exportamos también la clase por si se necesita directamente
export { Motor };
