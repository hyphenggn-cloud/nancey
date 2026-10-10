import { registerSW } from 'virtual:pwa-register';

export const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('[Outshipper SW] New content available, auto-updating service worker...');
  },
  onOfflineReady() {
    console.info('[Outshipper SW] Outshipper is fully cached and ready for offline use.');
  },
  onRegistered(r) {
    if (r) {
      console.info('[Outshipper SW] Service Worker registered successfully, scope:', r.scope);
      // Periodically check for service worker updates every hour
      setInterval(() => {
        r.update().catch((err) => console.warn('[Outshipper SW] SW update check failed:', err));
      }, 60 * 60 * 1000);
    }
  },
  onRegisterError(error) {
    console.warn('[Outshipper SW] Service Worker registration error:', error);
  },
});
