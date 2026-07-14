import { isNativeApp } from './platform'

/**
 * Setup native app behavior (console suppression, etc.)
 */
export async function setupNativeApp() {
  if (isNativeApp()) {
    // Suppress console in native builds for cleaner production
    console.log = () => {}
    console.warn = () => {}
    console.debug = () => {}
    console.info = () => {}
  }
}

/**
 * Register service worker (if applicable)
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed silently
    })
  }
}
