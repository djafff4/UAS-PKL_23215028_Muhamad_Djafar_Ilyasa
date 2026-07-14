import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types'

export const useToast = () => {
  const store = useNotificationStore()

  const toast = (title: string, message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    store.addNotification({
      id,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    })

    // Auto-mark as read after 5s (only local state, no server call)
    setTimeout(() => {
      const notif = store.notifications.find(n => n.id === id)
      if (notif) notif.read = true
    }, 5000)
  }

  return {
    success: (title: string, message: string = '') => toast(title, message, 'success'),
    error: (title: string, message: string = '') => toast(title, message, 'error'),
    warning: (title: string, message: string = '') => toast(title, message, 'warning'),
    info: (title: string, message: string = '') => toast(title, message, 'info')
  }
}
