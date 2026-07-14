import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  async function fetchNotifications() {
    loading.value = true
    error.value = null
    try {
      const res: any = await useApi('/notifications')
      if (res.success) {
        notifications.value = (res.data || []).map((n: any) => ({
          id: n.id,
          title: n.title || n.message?.substring(0, 50) || 'Notifikasi',
          message: n.message || '',
          type: mapNotifType(n.type || n.category),
          read: n.is_read || n.read || false,
          createdAt: n.created_at || n.createdAt,
        }))
      }
    } catch (err: any) {
      error.value = err?.message || 'Gagal memuat notifikasi'
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id: string) {
    try {
      await useApi(`/notifications/${id}/read`, { method: 'PUT' })
    } catch { /* ignore */ }

    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  async function markAllAsRead() {
    try {
      await useApi('/notifications/read-all', { method: 'PUT' })
    } catch { /* ignore */ }

    notifications.value.forEach(n => { n.read = true })
  }

  function addNotification(notif: Notification) {
    notifications.value.unshift(notif)
  }

  return { notifications, loading, error, unreadCount, fetchNotifications, markAsRead, markAllAsRead, addNotification }
})

function mapNotifType(t: string): Notification['type'] {
  const map: Record<string, Notification['type']> = {
    info: 'info', warning: 'warning', success: 'success', error: 'error',
    task: 'info', system: 'info', reminder: 'warning', achievement: 'success',
  }
  return map[t?.toLowerCase()] || 'info'
}
