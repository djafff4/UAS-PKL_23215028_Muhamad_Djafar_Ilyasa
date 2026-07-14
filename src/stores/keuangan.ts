import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface FinanceTransaction {
  id: string
  user_id: string
  type: string
  amount: number
  category: string
  description: string
  date: string
  evidence_photo: string | null
  reference_type: string
  reference_id?: string
  notes: string
  divisi: string
  created_at: string
  updated_at: string
}

export interface FinanceStats {
  total_pemasukan: number
  total_pengeluaran: number
  saldo: number
  total_transaksi: number
}

export interface FinanceSummary {
  totalPemasukan: number
  totalPengeluaran: number
  saldo: number
  transaksiBulanIni: number
}

export const useKeuanganStore = defineStore('keuangan', () => {
  const transactions = ref<FinanceTransaction[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<FinanceStats>({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo: 0,
    total_transaksi: 0,
  })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  const summary = computed<FinanceSummary>(() => ({
    totalPemasukan: stats.value.total_pemasukan,
    totalPengeluaran: stats.value.total_pengeluaran,
    saldo: stats.value.saldo,
    transaksiBulanIni: stats.value.total_transaksi,
  }))

  async function fetchTransactions(params?: { type?: string; category?: string; search?: string }) {
    loading.value = true
    try {
      const queryParams = new URLSearchParams()
      if (params?.type) queryParams.set('type', params.type)
      if (params?.category) queryParams.set('category', params.category)
      if (params?.search) queryParams.set('search', params.search)

      const queryString = queryParams.toString()
      const url = '/staff/finance' + (queryString ? '?' + queryString : '')

      const res: any = await useStaffApi(url)
      const list = extractList(res?.data || res)
      transactions.value = list
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const res: any = await useStaffApi('/staff/finance/stats')
      if (res?.data) {
        stats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch finance stats:', err?.message || err)
    }
  }

  async function createTransaction(data: {
    type: string
    amount: number
    category: string
    description: string
    date: string
    evidence_photo?: File | null
  }) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/finance', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        transactions.value.unshift(res.data)
      }
      fetchTransactions()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menyimpan transaksi' }
    } finally {
      creating.value = false
    }
  }

  async function updateTransaction(id: string, data: {
    type: string
    amount: number
    category: string
    description: string
    date: string
  }) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/finance/${id}`, {
        method: 'PUT',
        body: data,
      })
      const idx = transactions.value.findIndex(t => t.id === id)
      if (idx !== -1 && res?.data) {
        transactions.value[idx] = res.data
      }
      fetchTransactions()
      fetchStats()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupdate transaksi' }
    } finally {
      creating.value = false
    }
  }

  async function deleteTransaction(id: string) {
    try {
      await useStaffApi(`/staff/finance/${id}`, { method: 'DELETE' })
      transactions.value = transactions.value.filter(t => t.id !== id)
      fetchStats()
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus transaksi' }
    }
  }

  return {
    transactions,
    loading,
    creating,
    stats,
    summary,
    fetchTransactions,
    fetchStats,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
})
