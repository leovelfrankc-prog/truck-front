// inicio.js - Control de instalación PWA optimizado

// Variable global para almacenar el evento de instalación que dispara el navegador
let deferredPrompt = null;

export async function inicio() {
  console.log('[Motor] Inicializando control de instalación PWA...');

  const installContainer = document.getElementById('install-container');
  const btnInstalar = document.getElementById('btn-instalar-pwa');
  const appContainer = document.getElementById('app-container');

  // 1. Limpiamos el spinner de "Cargando..." inicial y dejamos el contenedor listo
  if (appContainer && installContainer) {
    appContainer.innerHTML = `
      <div class="text-center py-3 mb-3">
        <h4 class="text-secondary">PWA Lista para Instalar</h4>
        <p class="text-muted">El entorno local y el Service Worker operan correctamente.</p>
      </div>
    `;
    // Re-insertamos el contenedor del botón de instalación para asegurar visibilidad
    appContainer.appendChild(installContainer);
  }

  // 2. Capturar el evento cuando el navegador detecta que la PWA es instalable
  window.addEventListener('beforeinstallprompt', (e) => {
    // Evitamos que aparezca el banner automático del navegador
    e.preventDefault();
    // Guardamos el evento para dispararlo con nuestro botón personalizado
    deferredPrompt = e;
    
    console.log('[PWA] ¡La aplicación es instalable! Mostrando botón.');
    
    // Mostramos nuestro botón personalizado en pantalla
    if (installContainer) {
      installContainer.style.display = 'block';
    }
  });

  // 3. Programar la acción al hacer clic en nuestro botón de instalación
  if (btnInstalar) {
    btnInstalar.addEventListener('click', async () => {
      if (!deferredPrompt) {
        alert('El asistente de instalación no está disponible. Es posible que la app ya esté instalada o que el navegador no lo permita en esta sesión.');
        return;
      }

      // Disparamos el prompt nativo de instalación requerido por el navegador
      deferredPrompt.prompt();

      // Esperamos la respuesta del usuario
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Respuesta del usuario a la instalación: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('[PWA] Usuario aceptó la instalación.');
        if (installContainer) {
          installContainer.style.display = 'none';
        }
      } else {
        console.log('[PWA] Usuario canceló la instalación.');
      }

      // El prompt solo se puede usar una vez, lo limpiamos
      deferredPrompt = null;
    });
  }

  // 4. Detectar si la app ya fue instalada previamente
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] La aplicación se instaló exitosamente.');
    if (installContainer) {
      installContainer.style.display = 'none';
    }
    deferredPrompt = null;
  });

  // 5. Registro del Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      console.log('[SW] Service Worker registrado correctamente:', reg.scope);
    } catch (err) {
      console.error('[SW] Error al registrar:', err);
    }
  }
}
