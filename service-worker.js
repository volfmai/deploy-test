const CACHE_NAME = 'aura-cache';
const OFFLINE_URL = 'offline.html';

const STATIC_FILES = [
    './',
    'index.html',
    'style.css',
    'main.js',
    'manifest.json',
    'icon.svg',
    'icon-180x180.png',
    'icon-512x512.png',
    'offline.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                STATIC_FILES.map(url => cache.add(url).catch(() => {}))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.status === 200) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);
                if (cached) return cached;

                if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
                    return caches.match(OFFLINE_URL);
                }
                return new Response('Offline resource not available', { status: 503 });
            })
    );
});

