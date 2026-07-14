import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface Instructor {
  id: string
  full_name: string
  email: string
  phone: string
  photo_url: string
  gender: string
  bio: string
  specialization: string[]
  expertise: string[]
  education_level: string
  institution: string
  years_experience: number
  bnsp_certified: boolean
  bnsp_certificate_no: string
  languages: string[]
  rating: number
  total_students: number
  total_classes: number
  hourly_rate: number
  availability: string
  status: string
  contract_type: string
  join_date?: string
  notes: string
  divisi: string
  active_classes: number
  average_score: number
  created_at: string
  updated_at: string
}

export interface InstructorByRole {
  user_id: string
  akman_id: string
  full_name: string
  email: string
  phone: string
  department: string
  position: string
  total_classes: number
  active_classes: number
  total_students: number
  average_score: number
  is_active: boolean
}

export interface InstructorStats {
  total: number
  active: number
  bnsp_certified: number
  available: number
}

export const useInstructorStore = defineStore('instructors', () => {
  const instructors = ref<Instructor[]>([])
  const instructorsByRole = ref<InstructorByRole[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<InstructorStats>({ total: 0, active: 0, bnsp_certified: 0, available: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchInstructorsByRole() {
    loading.value = true
    try {
      const res: any = await useStaffApi('/staff/instructors/by-role')
      const list = extractList(res?.data || res)
      instructorsByRole.value = list
    } catch (err: any) {
      console.error('Failed to fetch instructors by role:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchInstructors(params?: { status?: string; availability?: string; search?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.set('status', params.status)
      if (params?.availability) queryParams.set('availability', params.availability)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/instructors' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      instructors.value = list
    } catch (err: any) {
      console.error('Failed to fetch instructors:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/instructors/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch instructor stats:', err?.message || err)
    }
  }

  async function getInstructor(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/instructors/${id}`)
      return res?.data || null
    } catch (err: any) {
      console.error('Failed to fetch instructor:', err?.message || err)
      return null
    }
  }

  async function createInstructor(data: Partial<Instructor>) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/instructors', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        instructors.value.unshift(res.data)
      }
      fetchInstructors()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat instruktur' }
    } finally {
      creating.value = false
    }
  }

  async function updateInstructor(id: string, data: Partial<Instructor>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/instructors/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = instructors.value.findIndex(i => i.id === id)
      if (idx !== -1 && res?.data) {
        instructors.value[idx] = res.data
      }
      fetchInstructors()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate instruktur' }
    } finally {
      creating.value = false
    }
  }

  async function deleteInstructor(id: string) {
    try {
      await useStaffApi(`/staff/instructors/${id}`, { method: 'DELETE' })
      instructors.value = instructors.value.filter(i => i.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus instruktur' }
    }
  }

  const instructorStats = computed(() => stats.value)

  return {
    instructors,
    instructorsByRole,
    loading,
    creating,
    stats,
    instructorStats,
    fetchInstructors,
    fetchInstructorsByRole,
    fetchStats,
    getInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
  }
})
