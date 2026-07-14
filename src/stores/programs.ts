import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface Program {
  id: string
  code: string
  title: string
  description: string
  short_description: string
  type: string
  category: string
  thumbnail_url: string
  duration_hours: number
  duration_weeks: number
  max_participants: number
  price: number
  currency: string
  status: string
  level: string
  language: string
  prerequisites: string
  learning_outcomes: string[]
  tags: string[]
  standard_type: string
  standard_issuer: string
  is_online: boolean
  is_offline: boolean
  location: string
  total_jp: number
  slug: string
  created_by: string
  divisi: string
  created_at: string
  updated_at: string
  program_type?: string
  training_mode?: string
  personal_tier?: string
  certificate_type?: string
  competency_standard?: string
  total_sessions?: number
}

export interface ProgramStats {
  total: number
  published: number
  draft: number
  archived: number
}

export const useProgramStore = defineStore('programs', () => {
  const programs = ref<Program[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<ProgramStats>({ total: 0, published: 0, draft: 0, archived: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchPrograms(params?: { status?: string; type?: string; search?: string; training_mode?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.set('status', params.status)
      if (params?.type) queryParams.set('type', params.type)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/programs' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      programs.value = list
    } catch (err: any) {
      console.error('Failed to fetch programs:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/programs/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch program stats:', err?.message || err)
    }
  }

  async function getProgram(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/programs/${id}`)
      return res?.data || null
    } catch (err: any) {
      console.error('Failed to fetch program:', err?.message || err)
      return null
    }
  }

  async function createProgram(data: Partial<Program>) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/programs', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        programs.value.unshift(res.data)
      }
      fetchPrograms()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat program' }
    } finally {
      creating.value = false
    }
  }

  async function updateProgram(id: string, data: Partial<Program>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/programs/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = programs.value.findIndex(p => p.id === id)
      if (idx !== -1 && res?.data) {
        programs.value[idx] = res.data
      }
      fetchPrograms()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate program' }
    } finally {
      creating.value = false
    }
  }

  async function deleteProgram(id: string) {
    try {
      await useStaffApi(`/staff/programs/${id}`, { method: 'DELETE' })
      programs.value = programs.value.filter(p => p.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus program' }
    }
  }

  const programStats = computed(() => stats.value)

  return {
    programs,
    loading,
    creating,
    stats,
    programStats,
    fetchPrograms,
    fetchStats,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
  }
})
