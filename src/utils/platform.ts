import { ref, onMounted } from 'vue'


/**
 * Detect if running inside a native Capacitor app
 */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).Capacitor?.isNativePlatform?.()
}

/**
 * Detect if running as an app shell ( Capacitor or browser)
 */
export function isAppShell(): boolean {
  return isNativeApp()
}

/**
 * Setup mobile viewport adjustments
 */
export function setupMobileViewport() {
  if (typeof document === 'undefined') return

  const meta = document.querySelector('meta[name="viewport"]')
  if (meta && isNativeApp()) {
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no')
  }
}

/**
 * Composable for platform detection
 */
export function usePlatform() {
  const isNative = ref(false)
  const isWeb = ref(true)

  onMounted(() => {
    isNative.value = isNativeApp()
    isWeb.value = !isNative.value
  })

  return { isNative, isWeb }
}
