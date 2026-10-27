import { vistaInstalar } from './instalar.js';

export function crearVista(vista) {
  switch (vista) {
    case "instalar":
      return vistaInstalar();
      
    default:
      console.warn(`La vista "${vista}" no existe.`);
      return null;
  }
}
