import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface LPKPartner {
  id: string
  name: string
  legal_name: string
  registration_number: string
  tax_number: string
  address: string
  city: string
  province: string
  website: string
  email: string
  phone: string
  contact_person: string
  contact_position: string
  contact_email: string
  contact_phone: string
  description: string
  logo_url: string
  accreditation: any
  programs_offered: string[]
  revenue_share_percent: number
  total_revenue: number
  total_students: number
  total_programs: number
  rating: number
  contract_start_date?: string
  contract_end_date?: string
  status: string
  notes: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface PartnerProgram {
  id: string
  partner_id: string
  program_id: string
  program_name: string
  price: number
  currency: string
  start_date?: string
  end_date?: string
  status: string
  notes: string
}

export interface PartnerTransaction {
  id: string
  partner_id: string
  transaction_type: string
  amount: number
  currency: string
  description: string
  reference_type: string
  reference_id?: string
  status: string
  payout_date?: string
  notes: string
  created_at: string
}

export interface PartnerStats {
  total: number
  active: number
  pending: number
  total_revenue: number
}

export const usePartnerStore = defineStore('partners', () => {
  const partners = ref<LPKPartner[]>([])
  const programs = ref<PartnerProgram[]>([])
  const transactions = ref<PartnerTransaction[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<PartnerStats>({ total: 0, active: 0, pending: 0, total_revenue: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchPartners(params?: { status?: string; search?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.set('status', params.status)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/partners' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      partners.value = list
    } catch (err: any) {
      console.error('Failed to fetch partners:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/partners/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch partner stats:', err?.message || err)
    }
  }

  async function getPartner(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/partners/${id}`)
      return res?.data || null
    } catch (err: any) {
      console.error('Failed to fetch partner:', err?.message || err)
      return null
    }
  }

  async function createPartner(data: Partial<LPKPartner>) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/partners', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        partners.value.unshift(res.data)
      }
      fetchPartners()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat mitra' }
    } finally {
      creating.value = false
    }
  }

  async function updatePartner(id: string, data: Partial<LPKPartner>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/partners/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = partners.value.findIndex(p => p.id === id)
      if (idx !== -1 && res?.data) {
        partners.value[idx] = res.data
      }
      fetchPartners()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate mitra' }
    } finally {
      creating.value = false
    }
  }

  async function deletePartner(id: string) {
    try {
      await useStaffApi(`/staff/partners/${id}`, { method: 'DELETE' })
      partners.value = partners.value.filter(p => p.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus mitra' }
    }
  }

  async function fetchPrograms(partnerId: string) {
    try {
      const res: any = await useStaffApi(`/staff/partners/${partnerId}/programs`)
      programs.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch programs:', err?.message || err)
    }
  }

  async function createProgram(partnerId: string, data: Partial<PartnerProgram>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/partners/${partnerId}/programs`, {
        method: 'POST',
        body: data,
      })
      fetchPrograms(partnerId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat program' }
    } finally {
      creating.value = false
    }
  }

  async function fetchTransactions(partnerId: string) {
    try {
      const res: any = await useStaffApi(`/staff/partners/${partnerId}/transactions`)
      transactions.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err?.message || err)
    }
  }

  async function createTransaction(partnerId: string, data: Partial<PartnerTransaction>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/partners/${partnerId}/transactions`, {
        method: 'POST',
        body: data,
      })
      fetchTransactions(partnerId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat transaksi' }
    } finally {
      creating.value = false
    }
  }

  const partnerStats = computed(() => stats.value)

  return {
    partners,
    programs,
    transactions,
    loading,
    creating,
    stats,
    partnerStats,
    fetchPartners,
    fetchStats,
    getPartner,
    createPartner,
    updatePartner,
    deletePartner,
    fetchPrograms,
    createProgram,
    fetchTransactions,
    createTransaction,
  }
})
