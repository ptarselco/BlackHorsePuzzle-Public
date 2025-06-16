const CACHE_NAME = 'blackhorse-v1';
// 🔽 Tambahkan baris ini di awal
importScripts('cache-assets.js'); // hasil dari generateCacheAssets.js


// Install Service Worker & Cache Files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  // 🔄 Gabungkan semua asset
  const CACHE_ASSETS = [...CORE_ASSETS, ...(self.assetPaths || [])];
  // 🔍 Tambahkan log setelah hitung assets
  console.log(`[ServiceWorker] Total assets to cache: ${CACHE_ASSETS.length}`);
  console.log(`[Splash] ${self.SplashAssets?.length || 0} assets`);
  console.log(`[Level01] ${self.Level01Assets?.length || 0} assets`);
  console.log(`[Level02] ${self.Level02Assets?.length || 0} assets`);
  console.log(`[ServiceWorker] Caching ${CACHE_ASSETS.length} assets...`);
    
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => { 
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activate SW & Cleanup Old Caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch from Cache or Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

