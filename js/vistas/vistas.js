import { vistaPrueba } from '/truck-front/js/vistas/vistaPrueba.js'; // Importamos con la clase en Mayúscula

export function crearVista(vista, motor) { // Recibimos el motor por parámetro
  switch (vista) {
    case "vistaPrueba":
      // Evitamos el conflicto de nombres y le pasamos el motor a la vista
      return new VistaPrueba(motor); 
      
    default:
      console.warn(`La vista "${vista}" no existe.`);
      return null;
  }
}
