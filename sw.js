self.skipWaiting();
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('slcodepreview').then(function (cache) {
      return cache.addAll([
        './',
        'https://cdn.jsdelivr.net/gh/AssassinAguilar/Alertism/dist/V1.0.0/main.js',
        'index.html',
        './style.css',
        './script.js',
        './assets/itsprimetime.png',
        './assets/itsprimetime_maskable.png',
        './assets/level_badges.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});