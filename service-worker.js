const CACHE_NAME = "krishna-portfolio-v6";

const urlsToCache = [
  "/Portfolio/",
  "/Portfolio/index.html",
  "/Portfolio/style.css",
  "/Portfolio/script.js"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 instantly activate

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name); // old cache delete
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
