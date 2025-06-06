const CACHE_NAME = 'mi-app-cache-v1.1.2'; // <--- Aumenta esto en cada cambio
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './js/app.js',
  './css/estilos.css'
];

// Instalar y cachear
self.addEventListener('install', event => {
  self.skipWaiting(); // ⬅️ Fuerza instalación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activar y limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim()) // ⬅️ Toma control de las páginas abiertas
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
