import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface CompetencyStandard {
  id: string
  code: string
  name: string
  description: string
  type: string
  issuer: string
  country: string
  level: string
  validity_months: number
  renewal_required: boolean
  international_recognition: string[]
  website_url: string
  logo_url: string
  status: string
  total_units: number
  created_at: string
  updated_at: string
}

export interface CompetencyUnit {
  id: string
  standard_id: string
  code: string
  name: string
  description: string
  elements: string
  assessment_criteria: string
  credit_points: number
  hours: number
  level: string
  sort_order: number
  status: string
}

export interface HRRecognition {
  id: string
  standard_id: string
  company_name: string
  industry: string
  company_size: string
  recognition_level: string
  position_level: string
  notes: string
  contact_person: string
  contact_email: string
  status: string
}

export interface StandardStats {
  total: number
  skkni: number
  skki: number
  international: number
}

export const useStandardStore = defineStore('standards', () => {
  const standards = ref<CompetencyStandard[]>([])
  const units = ref<CompetencyUnit[]>([])
  const recognitions = ref<HRRecognition[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<StandardStats>({ total: 0, skkni: 0, skki: 0, international: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchStandards(params?: { type?: string; issuer?: string; search?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.type) queryParams.set('type', params.type)
      if (params?.issuer) queryParams.set('issuer', params.issuer)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/standards' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      standards.value = list
    } catch (err: any) {
      console.error('Failed to fetch standards:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/standards/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch standard stats:', err?.message || err)
    }
  }

  async function getStandard(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/standards/${id}`)
      return res?.data || null
    } catch (err: any) {
      console.error('Failed to fetch standard:', err?.message || err)
      return null
    }
  }

  async function createStandard(data: Partial<CompetencyStandard>) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/standards', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        standards.value.unshift(res.data)
      }
      fetchStandards()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat standar' }
    } finally {
      creating.value = false
    }
  }

  async function updateStandard(id: string, data: Partial<CompetencyStandard>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/standards/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = standards.value.findIndex(s => s.id === id)
      if (idx !== -1 && res?.data) {
        standards.value[idx] = res.data
      }
      fetchStandards()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate standar' }
    } finally {
      creating.value = false
    }
  }

  async function deleteStandard(id: string) {
    try {
      await useStaffApi(`/staff/standards/${id}`, { method: 'DELETE' })
      standards.value = standards.value.filter(s => s.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus standar' }
    }
  }

  async function fetchUnits(standardId: string) {
    try {
      const res: any = await useStaffApi(`/staff/standards/${standardId}/units`)
      units.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch units:', err?.message || err)
    }
  }

  async function createUnit(standardId: string, data: Partial<CompetencyUnit>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/standards/${standardId}/units`, {
        method: 'POST',
        body: data,
      })
      fetchUnits(standardId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat unit' }
    } finally {
      creating.value = false
    }
  }

  async function fetchRecognitions(standardId: string) {
    try {
      const res: any = await useStaffApi(`/staff/standards/${standardId}/recognitions`)
      recognitions.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch recognitions:', err?.message || err)
    }
  }

  async function createRecognition(standardId: string, data: Partial<HRRecognition>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/standards/${standardId}/recognitions`, {
        method: 'POST',
        body: data,
      })
      fetchRecognitions(standardId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat pengakuan HR' }
    } finally {
      creating.value = false
    }
  }

  const standardStats = computed(() => stats.value)

  return {
    standards,
    units,
    recognitions,
    loading,
    creating,
    stats,
    standardStats,
    fetchStandards,
    fetchStats,
    getStandard,
    createStandard,
    updateStandard,
    deleteStandard,
    fetchUnits,
    createUnit,
    fetchRecognitions,
    createRecognition,
  }
})
