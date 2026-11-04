import { Componente } from './Componente.js';

/**
 * Clase Input: Componente universal para entradas de texto, números o archivos/imágenes.
 */
export class Input extends Componente {
  constructor(config, motor) {
    super(config, motor, 'input');
  }

  render() {
    // Definimos el tipo de input ('text', 'number', 'file', etc.)
    const tipoInput = this.config.props?.type || 'text';
    this.elemento.type = tipoInput;

    // Si es un input de tipo archivo/imagen, podemos manejar atributos como 'accept' o 'multiple'
    if (tipoInput === 'file') {
      if (this.config.props?.accept) {
        this.elemento.accept = this.config.props.accept; // Ej: 'image/*'
      }
      if (this.config.props?.multiple) {
        this.elemento.multiple = true;
      }
    } else {
      // Para texto o números, manejamos valor inicial y placeholder
      if (this.config.props?.placeholder) {
        this.elemento.placeholder = this.config.props.placeholder;
      }

      const valorInicial = this.config.props?.value || '';
      this.elemento.value = valorInicial;
      this.setMemoria('valor', valorInicial);
    }

    // --- GESTIÓN INTELIGENTE DE EVENTOS Y MEMORIA ---
    // Si es un archivo/imagen escuchamos 'change', si es texto/número escuchamos 'input'
    const eventoAEscuchar = tipoInput === 'file' ? 'change' : 'input';

    this.elemento.addEventListener(eventoAEscuchar, (e) => {
      if (tipoInput === 'file') {
        // Guardamos el listado de archivos y el archivo principal en la memoria
        this.setMemoria('valor', e.target.files);
        this.setMemoria('archivo', e.target.files[0] || null);
      } else {
        // Guardamos el texto o número ingresado
        this.setMemoria('valor', e.target.value);
      }
    });

    // Aplicamos atributos base comunes (clases, estilos, etc.)
    this.aplicarAtributosBase();

    // Vinculamos otros eventos si la config los trae
    this.vincularEventos();

    return this.elemento;
  }
}
