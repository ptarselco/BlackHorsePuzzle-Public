// Import cache assets
importScripts('cache-assets.js');

const CACHE_NAME = 'blackhorse-seri1-v1';
//const urlsToCache = [
// 🎯 ASSETS UNTUK SERI 1 SAJA (10 PUZZLES)
const CORE_ASSETS = [
  '/',
  'index.html',
  'phaser.min.js',
  'site.webmanifest',
  
  // Favicon files yang sudah ada
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'favicon-32x32.png',
  'favicon-16x16.png',
  'favicon.ico'
];

// 🧩 SERI 1 GAME ASSETS (10 PUZZLE PIECES)
const SERI1_ASSETS = [
  // Core game files
  //'/assets/images/black-horse-base.png',
  //'/assets/images/background.png',
  //'/assets/images/grid-background.png',
  
  // 10 puzzle pieces untuk Seri 1
  'assets/images/puzzle-pieces/piece-01.png',
  'assets/images/puzzle-pieces/piece-02.png',
  'assets/images/puzzle-pieces/piece-03.png',
  'assets/images/puzzle-pieces/piece-04.png',
  'assets/images/puzzle-pieces/piece-05.png',
  'assets/images/puzzle-pieces/piece-06.png',
  'assets/images/puzzle-pieces/piece-07.png',
  'assets/images/puzzle-pieces/piece-08.png',
  'assets/images/puzzle-pieces/piece-09.png',
  'assets/images/puzzle-pieces/piece-10.png',
  
  // UI elements
  'assets/images/ui/play-button.png',
  'assets/images/ui/timer-bg.png',
  'assets/images/ui/level01Score-bg.png',
  
  // Audio (optional - hanya jika file ada)
  'assets/audio/background-music.mp3',
  'assets/audio/piece-drop.mp3',
  'assets/audio/success.mp3'
];

// 🎯 GABUNG SEMUA ASSETS - SERI 1 ONLY
const ALL_CACHE_ASSETS = [...CORE_ASSETS, ...SERI1_ASSETS];

// Install Service Worker & Cache Files
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...');
  self.skipWaiting(); // Force immediate activation
  
  console.log('🔧 [ServiceWorker] Installing Black Horse Puzzle Seri 1...');
  console.log(`🧩 [ServiceWorker] Caching ${ALL_CACHE_ASSETS.length} assets for 10-puzzle game`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ [ServiceWorker] Cache opened successfully');
        
        // Cache files one by one to handle missing files gracefully
        return Promise.allSettled(
          ALL_CACHE_ASSETS.map(url => {
            return cache.add(url).catch(error => {
              console.warn(`⚠️ [ServiceWorker] Failed to cache ${url}:`, error.message);
              return null; // Continue with other files
            });
          })
        );
      })
      .then((results) => {
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;
        
        console.log(`✅ [ServiceWorker] Cached ${successful} assets successfully`);
        if (failed > 0) {
          console.warn(`⚠️ [ServiceWorker] Failed to cache ${failed} assets`);
        }
          self.skipWaiting(); // Force activate immediately
      })
      .catch((error) => {
        console.error('❌ [ServiceWorker] Cache installation failed:', error);
      })
  );
});

// Activate SW & Cleanup Old Caches
self.addEventListener('activate', (event) => {
  console.log('✅ [ServiceWorker] Activated - Black Horse Puzzle Seri 1 ready!');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Keep only current cache, delete old ones
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ [ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🎯 [ServiceWorker] Cache cleanup completed');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip API calls (let them go to network)
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
             })
          .catch((error) => {
            console.warn('⚠️ [ServiceWorker] Network fetch failed:', error);
            // Return offline fallback if available
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// ✅ ADD CACHE CLEARING MESSAGE HANDLER
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 [ServiceWorker] Skipping waiting - updating to new version');
    self.skipWaiting();
  }
  
  //if (event.data && event.data.type === 'CLEAR_CACHE') {
   // console.log('🗑️ [ServiceWorker] Clearing cache on request...');
    
   // caches.keys().then((cacheNames) => {
    //  return Promise.all(
       // cacheNames.map((cacheName) => {
        //  return caches.delete(cacheName);
       // })
     // );
    //}).then(() => {
     // console.log('✅ [ServiceWorker] All cache cleared');
     // if (event.ports && event.ports[0]) {
     //   event.ports[0].postMessage({ success: true });
     // }
   // });
 // }

// ENHANCED CACHE CLEAR - PASTE DI F12 CONSOLE:
async function clearAllCaches() {
    console.log('🗑️ Starting comprehensive cache clear...');
    
    let serviceWorkerSuccess = false;
    
    // Try Service Worker first
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
            const channel = new MessageChannel();
            
            const swClearPromise = new Promise((resolve) => {
                channel.port1.onmessage = function(event) {
                    resolve(event.data.success);
                };
                
                setTimeout(() => resolve(false), 3000); // 3 second timeout
            });
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_CACHE' },
                [channel.port2]
            );
            
            serviceWorkerSuccess = await swClearPromise;
            
            if (serviceWorkerSuccess) {
                console.log('✅ Service Worker cache cleared successfully');
            } else {
                console.log('⚠️ Service Worker cache clear timeout or failed');
            }
        } catch (error) {
            console.log('❌ Service Worker cache clear error:', error);
        }
    }
    
    // Fallback or additional direct clear
    if (!serviceWorkerSuccess) {
        console.log('🔄 Executing direct cache clear...');
        
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('🗑️ Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
                console.log('✅ Direct cache clear completed');
            } catch (error) {
                console.log('❌ Direct cache clear error:', error);
            }
        }
    }
    
    // Clear localStorage related to cache
    try {
        //localStorage.removeItem('cacheVersion');
        //localStorage.removeItem('lastCacheUpdate');
        console.log('✅ Cache-related localStorage cleared');
    } catch (error) {
        console.log('❌ localStorage clear error:', error);
    }
    
    console.log('🔄 Cache clear complete - please refresh page');
}

// Execute the comprehensive clear
clearAllCaches();
});

console.log('🐎 Black Horse Puzzle Service Worker - Seri 1 (10 Puzzles) Loaded!');