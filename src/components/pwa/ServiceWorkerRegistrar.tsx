'use client';

import { useEffect } from 'react';

/**
 * Registers /sw.js once the page is fully loaded. Skipped in dev (Next dev
 * server hot-reloads conflict with SW caching). Skipped on iOS Safari < 16.4
 * which lacks reliable Cache API in standalone mode.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Auto-update when a new version is detected.
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Reload once to pick up the new SW.
                newWorker.postMessage('SKIP_WAITING');
              }
            });
          });
        })
        .catch(() => {
          // ignore — PWA features will simply be inert
        });
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return null;
}
