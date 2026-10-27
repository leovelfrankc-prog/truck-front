/**
 * js/app/inicio.js
 * Función de arranque - Versión de prueba
 */

import { Contenedor } from '../componentes/contenedor.js';
import { Boton } from '../componentes/boton.js';
import { Alerta } from '../componentes/alerta.js';

export function vistaInstalar(motor) {
  // 1. Contenedor configurado para usar la etiqueta 'section' a través de props
  const contenedor = new Contenedor({ props: { tag: 'section' } }, motor);
  const elementoContenedor = contenedor.render();

  // 2. Alerta (su clase ya sabe que por defecto es un div)
  const pruebaAlerta = new Alerta(
    { props: { text: "¡Bienvenido a la versión de prueba de Truckero!" } }, 
    motor
  );

  // 3. Botón (su clase ya sabe que por defecto es un button)
  const btnInstalar = new Boton(
    { 
      props: { text: "Instalar aplicación" },
      actions: [{ event: "click", action: "instalarApp" }] 
    }, 
    motor
  );

  // 4. Añadir los elementos hijos al DOM del contenedor
  elementoContenedor.appendChild(pruebaAlerta.render());
  elementoContenedor.appendChild(btnInstalar.render());

  return elementoContenedor;
}
