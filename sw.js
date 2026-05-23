const CACHE = 'pumpfinder-v1';
const ASSETS = [
  '/pumpfinder/',
  '/pumpfinder/index.html',
  '/pumpfinder/spots_data.js',
  '/pumpfinder/markercluster.js',
  '/pumpfinder/MarkerCluster.css',
  '/pumpfinder/MarkerCluster.Default.css'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
