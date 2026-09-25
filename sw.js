// Service Worker - Maikon Caldeira Advocacia
// Versão: 1790294515367
// Gerado automaticamente em: 24/09/2026, 21:01:55
// Total de apps: 19

const CACHE_NAME = 'mc-advocacia-v1790294515367';
const RUNTIME_CACHE = 'mc-runtime';

// Arquivos para cache inicial
const PRECACHE_URLS = [
  './',
  './index.html',
  './1.codigo.html',
  './2.codigo.html',
  './3.codigo.html',
  './4.codigo.html',
  './5.html',
  './6.html',
  './7.html',
  './8.html',
  './9.html',
  './10.html',
  './11.html',
  './12.html',
  './13.html',
  './14.html',
  './15.html',
  './16.html',
  './17.html',
  './18.html',
  './19.html',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Instalação - cachear arquivos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando versão 1790294515367...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando 19 arquivos...');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Erro ao cachear:', err))
  );
});

// Ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - estratégia Cache First com fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições externas
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Servindo do cache:', request.url);
          return cachedResponse;
        }

        console.log('[SW] Buscando da rede:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Cachear resposta válida
            if (networkResponse && networkResponse.status === 200) {
              return caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback para página offline
            if (request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker carregado - Versão 1790294515367 com 19 apps');