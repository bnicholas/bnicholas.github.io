self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        'keypad.html',
        'style.css',
        'index.js',
        'images/splash/360x640.png',
        'images/splash/640x960.png',
        'images/splash/640x1136.png',
        'images/splash/750x1334.png',
        'images/splash/768x1024.png',
        'images/splash/828x1792.png',
        'images/splash/1024x768.png',
        'images/splash/1125x2436.png',
        'images/splash/1242x2208.png',
        'images/splash/1242x2688.png',
        'images/splash/1536x2048.png',
        'images/splash/1792x828.png',
        'images/splash/2048x1536.png',
        'images/splash/2208x1242.png',
        'images/splash/2436x1125.png',
        'images/splash/2688x1242.png',
        'images/splash/4096x4096.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once we need to save clone to put one copy in cache and serve second one
        let responseClone = response.clone();
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('images/app-icon/32.png');
      });
    }
  }));
});
