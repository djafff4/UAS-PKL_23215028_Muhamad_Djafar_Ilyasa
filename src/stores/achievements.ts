import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export const useAchievementStore = defineStore('achievements', () => {
  const achievements = ref<any[]>([])
  const creating = ref(false)

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  function mapAchievement(a: any) {
    return {
      id: a.id,
      title: a.title || '',
      description: a.description || '',
      category: a.category || 'IMPROVEMENT',
      user: { id: a.user_id, name: a.title },
      date: a.date || '',
      impact: a.impact || '',
    }
  }

  async function fetchAchievements() {
    try {
      const res: any = await useStaffApi('/staff/achievements')
      const list = extractList(res?.data || res)
      if (list.length) {
        achievements.value = list.map(mapAchievement)
      }
    } catch {
      // silent
    }
  }

  async function createAchievement(data: {
    title: string
    description: string
    category: string
    date: string
    impact: string
  }) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/achievements', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        achievements.value.unshift(mapAchievement(res.data))
      }
      fetchAchievements()
      return res
    } catch {
      return { success: false, message: 'Gagal membuat achievement' }
    } finally {
      creating.value = false
    }
  }

  async function updateAchievement(id: string, data: any) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/achievements/${id}`, {
        method: 'PUT',
        body: data,
      })
      fetchAchievements()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: 'Gagal mengupdate achievement' }
    } finally {
      creating.value = false
    }
  }

  async function deleteAchievement(id: string) {
    try {
      await useStaffApi(`/staff/achievements/${id}`, { method: 'DELETE' })
      achievements.value = achievements.value.filter((a: any) => a.id !== id)
      return { success: true }
    } catch {
      return { success: false, message: 'Gagal menghapus achievement' }
    }
  }

  return { achievements, creating, fetchAchievements, createAchievement, updateAchievement, deleteAchievement }
})
