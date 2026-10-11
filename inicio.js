// inicio.js - Prueba dedicada del flujo de instalación PWA
import { openDB } from './db.js';

let deferredPrompt = null;

export async function inicio() {
  console.log('[Motor] Inicializando PWA (Modo Prueba de Instalación)...');

  // 1. Escuchar el evento que permite la instalación nativa
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Evento beforeinstallprompt capturado con éxito.');
    
    // Mostramos el botón de instalación en la interfaz
    mostrarBotonInstalacion();
  });

  // 2. Registrar Service Worker minimalista
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      console.log('[SW] Service Worker registrado:', reg.scope);
    } catch (err) {
      console.error('[SW] Error al registrar Service Worker:', err);
    }
  }

  // 3. Inicializar IndexedDB
  try {
    await openDB();
    console.log('[DB] IndexedDB inicializada.');
  } catch (err) {
    console.error('[DB] Error al inicializar IndexedDB:', err);
  }

  // 4. Control de red visual
  window.addEventListener('online', actualizarEstadoRed);
  window.addEventListener('offline', actualizarEstadoRed);
  actualizarEstadoRed();

  // Quitamos cualquier llamada de fetch/red inicial para evitar errores 404
  const container = document.getElementById('app-container');
  container.innerHTML = `
    <div class="card shadow-sm p-4 border-info">
      <h3 class="text-info">Modo de Prueba: Instalación PWA</h3>
      <p class="text-muted mb-0">Si tu navegador cumple con los requisitos (HTTPS, manifest, service worker), aparecerá el botón de instalación arriba o puedes verificar la compatibilidad.</p>
    </div>
  `;
}

// Renderiza el botón de instalación en la UI
function mostrarBotonInstalacion() {
  const container = document.getElementById('app-container');
  
  if (document.getElementById('install-card')) return;

  const installHTML = `
    <div id="install-card" class="card shadow-sm p-4 mb-4 border-primary bg-light">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4 class="text-primary mb-1">🚀 ¡Instalar Aplicación!</h4>
          <p class="text-muted mb-0">Haz clic en el botón para agregar esta PWA a tu dispositivo.</p>
        </div>
        <button id="btn-instalar" class="btn btn-primary btn-lg px-4 shadow">Instalar</button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('afterbegin', installHTML);

  document.getElementById('btn-instalar').addEventListener('click', async () => {
    if (!deferredPrompt) {
      alert('El prompt de instalación no está disponible en este momento.');
      return;
    }

    // Disparamos el prompt nativo del navegador
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Elección del usuario: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('[PWA] Instalación aceptada con éxito.');
      document.getElementById('install-card').remove();
    }

    deferredPrompt = null;
  });
}

function actualizarEstadoRed() {
  const indicador = document.getElementById('offline-indicator');
  indicador.style.display = navigator.onLine ? 'none' : 'block';
}
