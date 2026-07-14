import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'

export const useDepartmentFilterStore = defineStore('departmentFilter', () => {
  const auth = useAuthStore()
  const activeDepartment = ref<string>('')
  const showAll = ref(true)
  const departments = ref<string[]>([])
  const loading = ref(false)

  const effectiveDepartment = computed(() => {
    if (showAll.value) return ''
    return activeDepartment.value
  })

  const departmentLabel = computed(() => {
    if (showAll.value) return 'Semua Divisi'
    if (activeDepartment.value) return activeDepartment.value
    return auth.userDepartment || 'Divisi Saya'
  })

  async function fetchDepartments() {
    try {
      loading.value = true
      const res: any = await useApi('/staff/divisi')
      if (res.success) {
        departments.value = (res.data || []).map((d: any) => d.department)
      }
    } catch {
      // silent
    } finally {
      loading.value = false
    }
  }

  function setDepartment(dept: string) {
    if (!dept) {
      showAll.value = true
      activeDepartment.value = ''
      return
    }
    showAll.value = false
    activeDepartment.value = dept
  }

  function setMyDepartment() {
    showAll.value = false
    activeDepartment.value = auth.userDepartment
  }

  function initFilter() {
    if (!auth.hasGlobalAccess && auth.userDepartment) {
      showAll.value = false
      activeDepartment.value = auth.userDepartment
    }
  }

  return {
    departments, activeDepartment, showAll, loading,
    effectiveDepartment, departmentLabel,
    fetchDepartments, setDepartment, setMyDepartment, initFilter,
  }
})
