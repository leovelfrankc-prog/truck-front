/**
 * js/app/inicio.js
 * Función de arranque - Versión de prueba
 */

import { crearMotor } from '../motor/registro.js';

/**
 * Punto de entrada de la aplicación
 */
export async function inicio() {
  console.log('Iniciando aplicación (modo prueba)...');

  // 1. Crear el motor
  const motor = crearMotor('view-content');

  // 2. Orientación de prueba
  const orientacionPrueba = {
    title: 'Prueba del Motor',
    components: [
      {
        type: 'container',
        props: {
          class: 'row justify-content-center mt-4'
        },
        components: [
          {
            type: 'card',
            props: {
              class: 'card shadow-sm col-md-6'
            },
            components: [
              {
                type: 'text',
                props: {
                  tag: 'h3',
                  text: 'Motor funcionando',
                  class: 'text-center mb-3'
                }
              },
              {
                type: 'text',
                props: {
                  text: 'Si puedes ver este mensaje, el motor de orientaciones está renderizando correctamente.',
                  class: 'text-muted text-center mb-4'
                }
              },
              {
                type: 'alert',
                props: {
                  type: 'success',
                  text: 'Componentes cargados: text, button, card, container, alert'
                }
              },
              {
                type: 'button',
                props: {
                  text: '<i class="bi bi-check-circle me-2"></i> Botón de prueba',
                  class: 'btn btn-primary w-100 mt-3'
                },
                actions: [
                  {
                    event: 'click',
                    type: 'showToast',
                    payload: {
                      message: '¡El botón funciona!',
                      type: 'success'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  // 3. Renderizar la orientación de prueba
  motor.renderizar(orientacionPrueba);

  console.log('Orientación de prueba renderizada');
}
