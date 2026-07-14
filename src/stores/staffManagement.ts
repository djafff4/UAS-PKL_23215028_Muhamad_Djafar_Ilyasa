import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import type { StaffListItem, StaffDetail } from '@/types'

export const useStaffManagementStore = defineStore('staffManagement', () => {
  const staffList = ref<StaffListItem[]>([])
  const staffDetail = ref<StaffDetail | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const size = ref(20)

  async function fetchStaff(params: Record<string, any> = {}) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.set(k, String(v))
      })
      const qs = query.toString()
      const res: any = await useApi(`/staff/users${qs ? `?${qs}` : ''}`)
      if (res.success) {
        staffList.value = res.data || []
        total.value = res.total || 0
        page.value = res.page || 1
        size.value = res.size || 20
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchStaffDetail(id: string) {
    loading.value = true
    try {
      const res: any = await useApi(`/staff/users/${id}`)
      if (res.success) {
        staffDetail.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function updateStaff(id: string, data: {
    position?: string | null
    department?: string | null
    phone?: string | null
    is_active?: boolean | null
    reports_to?: string | null
  }) {
    const body: Record<string, any> = {}
    if (data.position !== undefined) body.position = data.position
    if (data.department !== undefined) body.department = data.department
    if (data.phone !== undefined) body.phone = data.phone
    if (data.is_active !== undefined) body.is_active = data.is_active
    if (data.reports_to !== undefined) body.reports_to = data.reports_to

    const res: any = await useApi(`/staff/users/${id}`, {
      method: 'PUT',
      body,
    })
    return res
  }

  async function assignRole(userId: string, roleName: string) {
    const res: any = await useApi(`/staff/users/${userId}/roles`, {
      method: 'POST',
      body: { role_name: roleName },
    })
    return res
  }

  async function removeRole(userId: string, roleName: string) {
    const res: any = await useApi(`/staff/users/${userId}/roles/${roleName}`, {
      method: 'DELETE',
    })
    return res
  }

  async function fetchDepartments() {
    const res: any = await useApi('/staff/users/departments')
    if (res.success) return res.data
    return []
  }

  async function fetchRoles() {
    const res: any = await useApi('/staff/users/roles')
    if (res.success) return res.data
    return []
  }

  return {
    staffList, staffDetail, loading, total, page, size,
    fetchStaff, fetchStaffDetail, updateStaff,
    assignRole, removeRole, fetchDepartments, fetchRoles,
  }
})
