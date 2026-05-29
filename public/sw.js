const CACHE_NAME = 'careerpath-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through fetch to satisfy PWA install requirements.
  // We rely on Next.js standard caching for actual offline support.
  return;
});
