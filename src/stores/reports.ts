import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface DashboardStats {
  participants: { total: number; active: number }
  programs: { total: number; published: number }
  instructors: { total: number; active: number }
  corporate: { total: number; active: number }
  tasks: { total: number; completed: number }
  meetings: { total: number; upcoming: number }
}

export interface RevenueReport {
  period: string
  income: number
  expense: number
}

export interface EnrollmentReport {
  program_name: string
  enrolled: number
  completed: number
  dropped_out: number
}

export interface CertificationReport {
  standard_type: string
  issuer: string
  count: number
}

export interface PlacementReport {
  country: string
  count: number
}

export const useReportStore = defineStore('reports', () => {
  const dashboardStats = ref<DashboardStats | null>(null)
  const revenueReport = ref<RevenueReport[]>([])
  const enrollmentReport = ref<EnrollmentReport[]>([])
  const certificationReport = ref<CertificationReport[]>([])
  const placementReport = ref<PlacementReport[]>([])
  const loading = ref(false)

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchDashboardStats() {
    loading.value = true
    try {
      const res: any = await useStaffApi('/staff/reports/dashboard')
      if (res?.data) {
        dashboardStats.value = res.data
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRevenueReport(period: string = 'monthly') {
    try {
      const res: any = await useStaffApi(`/staff/reports/revenue?period=${period}`)
      revenueReport.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch revenue report:', err?.message || err)
    }
  }

  async function fetchEnrollmentReport() {
    try {
      const res: any = await useStaffApi('/staff/reports/enrollments')
      enrollmentReport.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch enrollment report:', err?.message || err)
    }
  }

  async function fetchCertificationReport() {
    try {
      const res: any = await useStaffApi('/staff/reports/certifications')
      certificationReport.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch certification report:', err?.message || err)
    }
  }

  async function fetchPlacementReport() {
    try {
      const res: any = await useStaffApi('/staff/reports/placements')
      placementReport.value = extractList(res?.data || res)
    } catch (err: any) {
      console.error('Failed to fetch placement report:', err?.message || err)
    }
  }

  async function fetchAllReports() {
    loading.value = true
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchRevenueReport(),
        fetchEnrollmentReport(),
        fetchCertificationReport(),
        fetchPlacementReport(),
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    dashboardStats,
    revenueReport,
    enrollmentReport,
    certificationReport,
    placementReport,
    loading,
    fetchDashboardStats,
    fetchRevenueReport,
    fetchEnrollmentReport,
    fetchCertificationReport,
    fetchPlacementReport,
    fetchAllReports,
  }
})
