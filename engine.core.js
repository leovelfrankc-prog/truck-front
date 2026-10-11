// engine.core.js - Motor genérico de renderizado
import { sendRequest } from './transporter.js';

export async function cargarVistaMotor(payload) {
  const container = document.getElementById('app-container');
  
  try {
    const response = await sendRequest(payload);
    
    if (response.status === 'offline') {
      container.innerHTML = `
        <div class="alert alert-warning">
          <h4>Modo sin conexión</h4>
          <p>${response.error}</p>
        </div>`;
      return;
    }

    // Renderizado dinámico basado en la respuesta del backend
    container.innerHTML = `
      <div class="card shadow-sm p-4">
        <h2 class="text-primary">${response.title || 'Panel Principal'}</h2>
        <p class="text-muted">${response.message || 'Frontend configurado y listo en la raíz.'}</p>
      </div>`;

  } catch (error) {
    console.error('[Motor] Error al renderizar vista:', error);
    container.innerHTML = `<div class="alert alert-danger">Error al cargar el motor.</div>`;
  }
}
