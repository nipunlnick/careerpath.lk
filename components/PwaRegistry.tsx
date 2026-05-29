'use client';
import { useEffect } from 'react';

export function PwaRegistry() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol !== 'http:') {
      // Don't register over insecure localhost unless testing specifically
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('PWA Service Worker registered'))
        .catch((err) => console.error('PWA Service Worker registration failed', err));
    }
  }, []);
  return null;
}
