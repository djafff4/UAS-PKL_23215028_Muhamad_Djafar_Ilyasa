import { useDepartmentFilterStore } from '@/stores/departmentFilter'
import { useApi } from './useApi'

export async function useStaffApi(url: string, options: any = {}) {
  const deptFilter = useDepartmentFilterStore()
  const dept = deptFilter.effectiveDepartment
  if (dept) {
    const separator = url.includes('?') ? '&' : '?'
    url = `${url}${separator}department=${dept}`
  }
  return useApi(url, options)
}
