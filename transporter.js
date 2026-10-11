// transporter.js - Capa de red hacia Google Apps Script y respaldo local
import { saveToStore, getFromStore } from './db.js';

// Reemplaza con la URL de tu Web App de Google Apps Script cuando la tengas
const API_URL = 'https://script.google.com/macros/s/AKfycbx0WTI9ZLEC_ArJdkjYHplPSjXy3Xthc289eBaK894tC4ZREbrRaL_1IandKCaSYOZ85w/exec';

export async function sendRequest(payload) {
  const isOnline = navigator.onLine;

  if (isOnline) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error en el servidor');
      const result = await response.json();

      if (payload.action === 'get_view' && result.view) {
        await saveToStore('views_cache', { view: result.view, payload: result });
      }

      return result;
    } catch (error) {
      console.warn('[Transporter] Falló la red, usando respaldo offline...', error);
      return handleOfflineFallback(payload);
    }
  } else {
    return handleOfflineFallback(payload);
  }
}

async function handleOfflineFallback(payload) {
  if (payload.action === 'get_view') {
    const cached = await getFromStore('views_cache', payload.viewId);
    if (cached) return cached.payload;
    return { status: 'offline', error: 'Sin conexión y sin caché disponible para esta vista.' };
  } else {
    await saveToStore('sync_queue', { action: payload.action, data: payload.data, timestamp: Date.now() });
    return { status: 'queued', message: 'Acción guardada en cola offline.' };
  }
}
