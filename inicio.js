// Variable global para almacenar el evento de instalación
let deferredPrompt = null;

export async function inicio() {
  console.log('[Motor] Inicializando control de instalación PWA...');

  const installContainer = document.getElementById('install-container');
  const btnInstalar = document.getElementById('btn-instalar-pwa');

  // 1. Capturar el evento cuando el navegador detecta que es instalable
  window.addEventListener('beforeinstallprompt', (e) => {
    // Evitamos que aparezca el banner automático feo del navegador
    e.preventDefault();
    // Guardamos el evento para dispararlo con nuestro botón personalizado
    deferredPrompt = e;
    
    console.log('[PWA] ¡La aplicación es instalable! Mostrando botón.');
    // Mostramos nuestro botón personalizado en pantalla
    if (installContainer) {
      installContainer.style.display = 'block';
    }
  });

  // 2. Programar la acción al hacer clic en nuestro botón
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
        // Ocultamos el botón una vez instalada
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

  // 3. Detectar si la app ya fue instalada previamente
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] La aplicación se instaló exitosamente.');
    if (installContainer) {
      installContainer.style.display = 'none';
    }
    deferredPrompt = null;
  });

  // Registro básico del Service Worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.log('[SW] Service Worker registrado correctamente.');
    } catch (err) {
      console.error('[SW] Error al registrar:', err);
    }
  }
}
