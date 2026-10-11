// inicio.js - Arranque y gestión del flujo de instalación PWA
import { openDB } from './db.js';
import { cargarVistaMotor } from './engine.core.js';

// Variable global para almacenar el evento de instalación
let deferredPrompt = null;

export async function inicio() {
  console.log('[Motor] Inicializando PWA desde la raíz...');

  // 1. Escuchar el evento que permite la instalación de la PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    // Evitamos que el navegador muestre su barra nativa automática
    e.preventDefault();
    // Guardamos el evento para dispararlo cuando el usuario haga clic en nuestro botón
    deferredPrompt = e;
    console.log('[PWA] Evento beforeinstallprompt capturado con éxito.');

    // Opcional: Si detectamos que no está instalada, podemos mostrar una opción en la UI
    mostrarBotonInstalacion();
  });

  // 2. Registrar Service Worker
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

  // 4. Control de red
  window.addEventListener('online', actualizarEstadoRed);
  window.addEventListener('offline', actualizarEstadoRed);
  actualizarEstadoRed();

  // 5. Cargar vista inicial
  await cargarVistaMotor({ action: 'get_view', viewId: 'home' });
}

// Renderiza una vista de instalación o un banner si la PWA es instalable
function mostrarBotonInstalacion() {
  const container = document.getElementById('app-container');
  
  // Verificamos si ya existe el contenedor de instalación para no duplicarlo
  if (document.getElementById('install-card')) return;

  const installHTML = `
    <div id="install-card" class="card shadow-sm p-4 mb-4 border-primary">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4 class="text-primary mb-1">¡Instala nuestra PWA!</h4>
          <p class="text-muted mb-0">Disfruta de una experiencia más rápida y acceso sin conexión directa desde tu pantalla de inicio.</p>
        </div>
        <button id="btn-instalar" class="btn btn-primary btn-lg px-4">Instalar</button>
      </div>
    </div>
  `;

  // Insertamos el banner al inicio del contenedor principal
  container.insertAdjacentHTML('afterbegin', installHTML);

  // Asociamos el evento de clic al botón de instalación
  document.getElementById('btn-instalar').addEventListener('click', async () => {
    if (!deferredPrompt) {
      alert('La aplicación ya está instalada o el navegador no permite la instalación automática.');
      return;
    }

    // Mostramos el banner nativo de instalación
    deferredPrompt.prompt();

    // Esperamos la respuesta del usuario (si aceptó o rechazó)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Resultado de la instalación: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('[PWA] El usuario aceptó instalar la aplicación.');
      document.getElementById('install-card').remove();
    }

    // Limpiamos la variable porque el prompt solo se puede usar una vez
    deferredPrompt = null;
  });
}

function actualizarEstadoRed() {
  const indicador = document.getElementById('offline-indicator');
  indicador.style.display = navigator.onLine ? 'none' : 'block';
}
