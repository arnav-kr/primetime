self.skipWaiting(); 
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('slcodepreview').then(function (cache) {
      return cache.addAll([
        './',
        './privacy-policies/',
        'https://cdn.jsdelivr.net/npm/@pwabuilder/pwainstall@latest/dist/pwa-install.min.js',
        'index.html',
        './style.css',
        './script.js',
        './assets/icon.png',
        './assets/icon_maskable.png',
        './assets/level_badges.png',
        './assets/header_image.png',
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