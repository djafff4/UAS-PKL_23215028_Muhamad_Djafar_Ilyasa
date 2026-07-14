import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'

export function useCapacitor() {
  const isNative = ref(false)
  const platform = ref<string>('web')

  onMounted(() => {
    isNative.value = Capacitor.isNativePlatform()
    platform.value = Capacitor.getPlatform()
  })

  function isAndroid() {
    return platform.value === 'android'
  }

  function isIOS() {
    return platform.value === 'ios'
  }

  function isWeb() {
    return platform.value === 'web'
  }

  return {
    isNative,
    platform,
    isAndroid,
    isIOS,
    isWeb,
  }
}

export async function useCapacitorCamera() {
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')

    async function takePhoto() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      })
      return image
    }

    async function pickPhoto() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      })
      return image
    }

    return { takePhoto, pickPhoto }
  } catch {
    return {
      takePhoto: () => null,
      pickPhoto: () => null,
    }
  }
}

export async function useCapacitorNotifications() {
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications')

    async function requestPermission() {
      const permission = await PushNotifications.requestPermissions()
      return permission.receive === 'granted'
    }

    async function register() {
      await PushNotifications.register()
    }

    return { requestPermission, register }
  } catch {
    return {
      requestPermission: () => Promise.resolve(false),
      register: () => Promise.resolve(),
    }
  }
}

export async function useCapacitorHaptics() {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')

    function impact(style: 'light' | 'medium' | 'heavy' = 'medium') {
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      }
      Haptics.impact({ style: styleMap[style] })
    }

    function notification(type: 'success' | 'warning' | 'error' = 'success') {
      Haptics.notification({ type: type as any })
    }

    return { impact, notification }
  } catch {
    return {
      impact: () => {},
      notification: () => {},
    }
  }
}

export async function useCapacitorStatusBar() {
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')

    async function setDark() {
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: '#0f172a' })
    }

    async function setLight() {
      await StatusBar.setStyle({ style: Style.Light })
      await StatusBar.setBackgroundColor({ color: '#ffffff' })
    }

    return { setDark, setLight }
  } catch {
    return {
      setDark: () => Promise.resolve(),
      setLight: () => Promise.resolve(),
    }
  }
}

export async function useCapacitorNetwork() {
  try {
    const { Network } = await import('@capacitor/network')

    async function getStatus() {
      const status = await Network.getStatus()
      return status.connected
    }

    function onStatusChange(callback: (connected: boolean) => void) {
      Network.addListener('networkStatusChange', (status) => {
        callback(status.connected)
      })
    }

    return { getStatus, onStatusChange }
  } catch {
    return {
      getStatus: () => Promise.resolve(true),
      onStatusChange: () => {},
    }
  }
}

export async function useCapacitorFilesystem() {
  try {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')

    async function writeFile(path: string, data: string) {
      await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
    }

    async function readFile(path: string) {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
      return result.data
    }

    return { writeFile, readFile }
  } catch {
    return {
      writeFile: () => Promise.resolve(),
      readFile: () => Promise.resolve(''),
    }
  }
}
