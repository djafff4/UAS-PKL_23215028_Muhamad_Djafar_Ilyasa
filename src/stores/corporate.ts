import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface CorporateClient {
  id: string
  company_name: string
  industry: string
  company_size: string
  website: string
  address: string
  city: string
  province: string
  contact_person: string
  contact_position: string
  contact_email: string
  contact_phone: string
  tax_number: string
  notes: string
  contract_count: number
  total_revenue: number
  status: string
  created_at: string
  updated_at: string
}

export interface CorporateContract {
  id: string
  client_id: string
  contract_number: string
  program_name: string
  contract_type: string
  start_date: string
  end_date: string
  participant_count: number
  total_amount: number
  paid_amount: number
  currency: string
  status: string
  created_at: string
}

export interface CorporateInvoice {
  id: string
  client_id: string
  contract_id?: string
  invoice_number: string
  invoice_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  paid_amount: number
  currency: string
  description: string
  status: string
  payment_method: string
  payment_date?: string
  created_at: string
}

export interface CorporateStats {
  total: number
  active: number
  leads: number
  total_revenue: number
}

export const useCorporateStore = defineStore('corporate', () => {
  const clients = ref<CorporateClient[]>([])
  const contracts = ref<CorporateContract[]>([])
  const invoices = ref<CorporateInvoice[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<CorporateStats>({ total: 0, active: 0, leads: 0, total_revenue: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchClients(params?: { status?: string; industry?: string; search?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.set('status', params.status)
      if (params?.industry) queryParams.set('industry', params.industry)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/corporate' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      clients.value = list
    } catch (err: any) {
      console.error('Failed to fetch corporate clients:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/corporate/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch corporate stats:', err?.message || err)
    }
  }

  async function getClient(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/corporate/${id}`)
      return res?.data || null
    } catch (err: any) {
      console.error('Failed to fetch client:', err?.message || err)
      return null
    }
  }

  async function createClient(data: Partial<CorporateClient>) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/corporate', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        clients.value.unshift(res.data)
      }
      fetchClients()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat klien' }
    } finally {
      creating.value = false
    }
  }

  async function updateClient(id: string, data: Partial<CorporateClient>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/corporate/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = clients.value.findIndex(c => c.id === id)
      if (idx !== -1 && res?.data) {
        clients.value[idx] = res.data
      }
      fetchClients()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate klien' }
    } finally {
      creating.value = false
    }
  }

  async function deleteClient(id: string) {
    try {
      await useStaffApi(`/staff/corporate/${id}`, { method: 'DELETE' })
      clients.value = clients.value.filter(c => c.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus klien' }
    }
  }

  async function fetchContracts(clientId: string) {
    try {
      const res: any = await useStaffApi(`/staff/corporate/${clientId}/contracts`)
      contracts.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch contracts:', err?.message || err)
    }
  }

  async function createContract(clientId: string, data: Partial<CorporateContract>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/corporate/${clientId}/contracts`, {
        method: 'POST',
        body: data,
      })
      fetchContracts(clientId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat kontrak' }
    } finally {
      creating.value = false
    }
  }

  async function fetchInvoices(clientId: string) {
    try {
      const res: any = await useStaffApi(`/staff/corporate/${clientId}/invoices`)
      invoices.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch invoices:', err?.message || err)
    }
  }

  async function createInvoice(clientId: string, data: Partial<CorporateInvoice>) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/corporate/${clientId}/invoices`, {
        method: 'POST',
        body: data,
      })
      fetchInvoices(clientId)
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat invoice' }
    } finally {
      creating.value = false
    }
  }

  const clientStats = computed(() => stats.value)

  return {
    clients,
    contracts,
    invoices,
    loading,
    creating,
    stats,
    clientStats,
    fetchClients,
    fetchStats,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    fetchContracts,
    createContract,
    fetchInvoices,
    createInvoice,
  }
})
