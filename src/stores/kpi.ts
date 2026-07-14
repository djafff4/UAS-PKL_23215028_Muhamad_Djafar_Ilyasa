import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

const LOCAL_KEY = 'staff_akman_kpis'

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

export const useKpiStore = defineStore('kpi', () => {
  const kpis = ref<any[]>([])
  const creating = ref(false)

  const kpiStats = computed(() => ({
    total: kpis.value.length,
    onTrack: kpis.value.filter((k: any) => k.status === 'ON_TRACK').length,
    needAttention: kpis.value.filter((k: any) => k.status === 'NEED_ATTENTION').length,
    behind: kpis.value.filter((k: any) => k.status === 'BEHIND').length,
  }))

  const kpiByDivisi = computed(() => {
    const grouped: Record<string, any[]> = {}
    for (const kpi of kpis.value) {
      if (!grouped[kpi.divisi]) grouped[kpi.divisi] = []
      grouped[kpi.divisi].push(kpi)
    }
    return grouped
  })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  function mapKpi(k: any) {
    return {
      id: k.id,
      divisi: k.divisi || '',
      user: { id: k.user_id, name: k.indikator },
      indikator: k.indikator,
      target: Number(k.target) || 0,
      pencapaian: Number(k.pencapaian) || 0,
      periode: k.periode || '',
      status: k.status || 'ON_TRACK',
    }
  }

  function genId() {
    return 'local_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
  }

  async function fetchKpis() {
    try {
      const res: any = await useStaffApi('/staff/kpis')
      const list = extractList(res?.data || res)
      if (list.length) {
        kpis.value = list.map(mapKpi)
      }
    } catch {
      const local = loadLocal()
      if (local.length) kpis.value = local
    }
  }

  async function createKpi(data: {
    indikator: string
    target: number
    pencapaian: number
    periode: string
    status: string
    divisi: string
  }) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/kpis', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        kpis.value.unshift(mapKpi(res.data))
      }
      fetchKpis()
      return { success: true, data: res?.data }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        const entry = { ...data, id: genId() }
        const mapped = mapKpi(entry)
        kpis.value.unshift(mapped)
        saveLocal(kpis.value)
        return { success: true, data: entry, local: true }
      }
      return { success: false, message: 'Gagal membuat KPI' }
    } finally {
      creating.value = false
    }
  }

  async function updateKpi(id: string, data: any) {
    creating.value = true
    try {
      const res: any = await useStaffApi(`/staff/kpis/${id}`, {
        method: 'PUT',
        body: data,
      })
      fetchKpis()
      return { success: true, data: res?.data }
    } catch (err: any) {
      return { success: false, message: 'Gagal mengupdate KPI' }
    } finally {
      creating.value = false
    }
  }

  async function deleteKpi(id: string) {
    try {
      await useStaffApi(`/staff/kpis/${id}`, { method: 'DELETE' })
      kpis.value = kpis.value.filter((k: any) => k.id !== id)
      return { success: true }
    } catch {
      return { success: false, message: 'Gagal menghapus KPI' }
    }
  }

  return { kpis, creating, kpiStats, kpiByDivisi, fetchKpis, createKpi, updateKpi, deleteKpi }
})
