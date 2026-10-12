/**
 * Punto central de registro de componentes del motor.
 * Aquí se importan y registran todos los componentes disponibles.
 */

import { Motor } from './Motor.js';

// Más adelante importaremos los componentes desde la carpeta componentes/
// import { Texto } from '../componentes/Texto.js';
// import { Boton } from '../componentes/Boton.js';
// import { Card } from '../componentes/Card.js';
// import { Contenedor } from '../componentes/Contenedor.js';
// import { Alerta } from '../componentes/Alerta.js';

/**
 * Crea una instancia del motor y registra los componentes básicos.
 * Por ahora los componentes todavía no existen, así que dejamos el registro preparado.
 */
export function crearMotor(contenedorId = 'view-content') {
  const motor = new Motor(contenedorId);

  // Cuando creemos los componentes, los registraremos aquí:
  // motor.registrar('text', Texto);
  // motor.registrar('button', Boton);
  // motor.registrar('card', Card);
  // motor.registrar('container', Contenedor);
  // motor.registrar('alert', Alerta);

  return motor;
}

// También exportamos la clase por si se necesita directamente
export { Motor };
