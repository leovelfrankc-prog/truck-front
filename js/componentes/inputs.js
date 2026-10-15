import { Componente } from '../motor/Componente.js';

export class Input extends Componente {
  render() {
    this.elemento = document.createElement('div');
    this.elemento.className = this.config.props?.wrapperClass || 'mb-3';

    // Label opcional
    if (this.config.props?.label) {
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = this.config.props.label;
      if (this.config.props?.id) label.htmlFor = this.config.props.id;
      this.elemento.appendChild(label);
    }

    // Input real
    const input = document.createElement('input');
    input.type = this.config.props?.type || 'text';
    input.className = this.config.props?.class || 'form-control';
    input.placeholder = this.config.props?.placeholder || '';
    input.name = this.config.props?.name || '';
    input.value = this.config.props?.value || '';

    if (this.id) {
      input.id = this.id;
    }

    // Guardamos referencia al input interno para poder leer su valor luego
    this.inputElement = input;
    this.elemento.appendChild(input);

    return this.elemento;
  }
}
