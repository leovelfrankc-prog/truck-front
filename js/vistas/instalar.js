/**
 * js/app/inicio.js
 * Función de arranque - Versión de prueba
 */

import { Contenedor } from '../componentes/contenedor.js';
import { Boton } from '../componentes/boton.js';
import { Alerta } from '../componentes/alerta.js';

export function vistaInstalar(motor) {
  // 1. Crear el contenedor principal (con tag 'section')
  const contenedor = new Contenedor({}, window.motor(), "section");
  const elementoContenedor = contenedor.render();

  // 2. Crear los componentes hijos con sus configuraciones y tags correctos
  const pruebaAlerta = new Alerta(
    { props: { text: "¡Bienvenido a la versión de prueba de Truckero!" } }, 
    window.motor(), 
    "div"
  );

  const btnInstalar = new Boton(
    { 
      props: { text: "Instalar aplicación" },
      actions: [{ event: "click", action: "instalarApp" }] 
    }, 
    window.motor(), 
    "button" // Corregido: "button" en lugar de "buttom"
  );

  // 3. Añadir los elementos hijos al DOM del contenedor
  elementoContenedor.appendChild(pruebaAlerta.render());
  elementoContenedor.appendChild(btnInstalar.render());

  // 4. Retornar el elemento listo para ser renderizado por el motor
  return elementoContenedor;
}
