const CACHE = 'pumpfinder-v4';
const ASSETS = [
  '/pumpfinder/',
  '/pumpfinder/index.html',
  '/pumpfinder/spots_data.js',
  '/pumpfinder/markercluster.js',
  '/pumpfinder/MarkerCluster.css',
  '/pumpfinder/MarkerCluster.Default.css',
  '/pumpfinder/manifest.json',
  '/pumpfinder/icon-192.png',
  '/pumpfinder/icon-512.png'
];

// Installation — mise en cache des assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Active immédiatement sans attendre
});

// Activation — purge les anciens caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim(); // Prend le contrôle immédiatement
});

// Fetch — network first pour index.html, cache first pour le reste
self.addEventListener('fetch', function(e) {
  // Toujours réseau en premier pour la page principale
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/pumpfinder/')) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
          return response;
        })
        .catch(function() { return caches.match(e.request); })
    );
    return;
  }
  // Cache first pour les autres assets
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).then(function(r) {
        var clone = r.clone();
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        return r;
      });
    })
  );
});
