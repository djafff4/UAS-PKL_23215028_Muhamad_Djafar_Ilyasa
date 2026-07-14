import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export interface DivisiItem {
  department: string
  member_count: number
  head_name: string
  head_position: string
}

export const useDivisiStore = defineStore('divisi', () => {
  const divisiList = ref<DivisiItem[]>([])

  async function fetchDivisi() {
    try {
      const res: any = await useApi('/staff/divisi')
      if (res.success) {
        divisiList.value = res.data || []
      }
    } catch {
      // silent
    }
  }

  return { divisiList, fetchDivisi }
})
