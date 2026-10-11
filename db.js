// js/db.js - Wrapper de IndexedDB para almacenamiento offline y cola de sincronización

const DB_NAME = 'PWAEngineDB';
const DB_VERSION = 1;

/**
 * Abre o inicializa la base de datos IndexedDB
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Almacén para la caché de vistas (HATEOAS)
      if (!db.objectStoreNames.contains('views_cache')) {
        db.createObjectStore('views_cache', { keyPath: 'view' });
      }
      
      // Almacén para las peticiones pendientes cuando no hay red (Outbox)
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * Guarda o actualiza un registro en un almacén específico
 */
export async function saveToStore(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene un registro por su clave desde un almacén
 */
export async function getFromStore(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todos los elementos almacenados (útil para la cola de sincronización)
 */
export async function getAllFromStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina un elemento de la cola de sincronización tras ser procesado
 */
export async function deleteFromStore(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
