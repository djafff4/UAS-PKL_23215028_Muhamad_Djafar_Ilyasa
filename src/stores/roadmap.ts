import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

const LOCAL_KEY = 'staff_akman_roadmaps'

function loadLocal() {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? JSON.parse(raw) : []
    }
  } catch {}
  return []
}

function saveLocal(data: any[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    }
  } catch {}
}

export const useRoadmapStore = defineStore('roadmap', () => {
  const roadmaps = ref<any[]>([])
  const is403 = ref(false)

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  function mapRoadmap(r: any) {
    return {
      id: r.id,
      user_id: r.user_id,
      title: r.title || '',
      description: r.description || '',
      deadline: r.deadline || '',
      status: r.status || 'PENDING',
      progress: r.progress || 0,
      divisi: r.divisi || '',
    }
  }

  function genId() {
    return 'local_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
  }

  async function fetchRoadmaps() {
    try {
      const res: any = await useStaffApi('/staff/roadmaps')
      const list = extractList(res?.data || res)
      if (list.length) {
        is403.value = false
        roadmaps.value = list.map(mapRoadmap)
      }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        is403.value = true
        roadmaps.value = loadLocal()
      }
    }
  }

  async function createRoadmap(data: {
    title: string
    description?: string
    deadline?: string
    status?: string
    progress?: number
    divisi?: string
  }) {
    try {
      const res: any = await useStaffApi('/staff/roadmaps', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        roadmaps.value.unshift(mapRoadmap(res.data))
      }
      fetchRoadmaps()
      return { success: true, data: res?.data }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        const entry = { ...data, id: genId(), user_id: '' }
        const mapped = mapRoadmap(entry)
        roadmaps.value.unshift(mapped)
        saveLocal(roadmaps.value)
        return { success: true, data: entry, local: true }
      }
      return { success: false, message: 'Gagal membuat roadmap' }
    }
  }

  async function updateRoadmap(id: string, data: {
    title?: string
    description?: string
    deadline?: string
    status?: string
    progress?: number
    divisi?: string
  }) {
    try {
      const res: any = await useStaffApi(`/staff/roadmaps/${id}`, {
        method: 'PUT',
        body: data,
      })
      if (res?.data) {
        const idx = roadmaps.value.findIndex((r: any) => r.id === id)
        if (idx !== -1) roadmaps.value[idx] = { ...roadmaps.value[idx], ...mapRoadmap(res.data) }
      }
      fetchRoadmaps()
      return { success: true }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        const idx = roadmaps.value.findIndex((r: any) => r.id === id)
        if (idx !== -1) {
          roadmaps.value[idx] = { ...roadmaps.value[idx], ...data }
          saveLocal(roadmaps.value)
        }
        return { success: true, data, local: true }
      }
      return { success: false, message: 'Gagal mengubah roadmap' }
    }
  }

  async function deleteRoadmap(id: string) {
    try {
      await useStaffApi(`/staff/roadmaps/${id}`, {
        method: 'DELETE',
      })
      roadmaps.value = roadmaps.value.filter((r: any) => r.id !== id)
      fetchRoadmaps()
      return { success: true }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        roadmaps.value = roadmaps.value.filter((r: any) => r.id !== id)
        saveLocal(roadmaps.value)
        return { success: true, data: id, local: true }
      }
      return { success: false, message: 'Gagal menghapus roadmap' }
    }
  }

  return { roadmaps, is403, fetchRoadmaps, createRoadmap, updateRoadmap, deleteRoadmap }
})
