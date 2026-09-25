const CACHE = 'beatriz-v1';
const ASSETS = ['/', '/index.html', '/install.html', '/style.css', '/app.js', '/manifest.webmanifest', '/assets/beatriz-avatar.png', '/assets/beatriz-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
