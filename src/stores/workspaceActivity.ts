import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface StaffActivityItem {
  id: string
  user_id: string
  user_name: string
  user_avatar: string
  action: string
  target: string
  target_type: string
  timestamp: string
}

export const useWorkspaceActivityStore = defineStore('workspaceActivity', () => {
  const activities = ref<StaffActivityItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActivities(dateRange?: string) {
    loading.value = true
    error.value = null
    try {
      const url = dateRange ? `/staff/activities?date_range=${dateRange}` : '/staff/activities'
      const res: any = await useStaffApi(url)
      if (res.success) {
        activities.value = res.data || []
      }
    } catch (err: any) {
      error.value = err?.message || 'Gagal memuat aktivitas'
    } finally {
      loading.value = false
    }
  }

  return { activities, loading, error, fetchActivities }
})
