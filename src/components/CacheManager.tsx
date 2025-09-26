'use client';

import { useEffect, useState } from 'react';

export default function CacheManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration);
          console.log('Service Worker registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        // Clear service worker cache if available
        if (swRegistration) {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              console.log('Cache cleared successfully');
              window.location.reload();
            }
          };
          
          swRegistration.active?.postMessage(
            { type: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  const forceUpdate = () => {
    if (swRegistration) {
      swRegistration.update();
    }
    window.location.reload();
  };

  // Add cache-busting query parameter to all internal links
  useEffect(() => {
    const addCacheBuster = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
        const url = new URL(target.href);
        url.searchParams.set('_cb', Date.now().toString());
        target.href = url.toString();
      }
    };

    document.addEventListener('click', addCacheBuster);
    return () => document.removeEventListener('click', addCacheBuster);
  }, []);

  // Development mode cache management (only show in development)
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={clearCache}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Cache
        </button>
        <button
          onClick={forceUpdate}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Force Update
        </button>
      </div>
    </div>
  );
}
