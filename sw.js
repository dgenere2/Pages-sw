const CACHE_NAME = 'mi-app-cache-v1';
cache.addAll([
  '/index.html',
  '/style.css',
  '/sw.js',
  '/script.js',
  '/manifest.json',
  '/favicon.ico' // ← este probablemente da error
]);

// Instalar y cachear
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar y limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      )
    )
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
