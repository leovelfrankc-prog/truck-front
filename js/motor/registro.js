/**
 * Punto central de registro de componentes del motor.
 * Aquí se importan y registran todos los componentes disponibles.
 */

import { Motor } from '/truck-front/js/motor/Motor.js';

// Importamos todos los componentes
import { Texto } from '/truck-front/js/componentes/Texto.js';
import { Boton } from '/truck-front/js/componentes/Boton.js';
import { Card } from '/truck-front/js/componentes/Card.js';
import { Contenedor } from '/truck-front/js/componentes/Contenedor.js';
import { Alerta } from '/truck-front/js/componentes/Alerta.js';
import { Input } from '/truck-front/js/componentes/inputs.js';
import { Formulario } from '/truck-front/js/componentes/formulario.js';

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
  motor.registrar('input', Input);
  motor.registrar('formulario', Formulario);

  return motor;
}

// Exportamos también la clase por si se necesita directamente
export { Motor };
