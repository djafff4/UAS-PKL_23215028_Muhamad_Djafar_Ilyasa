import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface Participant {
  id: string
  full_name: string
  email: string
  phone: string
  birth_date?: string
  gender: string
  address: string
  city: string
  province: string
  education_level: string
  institution: string
  occupation: string
  nik: string
  emergency_name: string
  emergency_phone: string
  source: string
  notes: string
  status: string
  talent_pool: boolean
  photo_url: string
  divisi: string
  created_at: string
  updated_at: string
}

export interface ParticipantByRole {
  user_id: string
  akman_id: string
  full_name: string
  email: string
  phone: string
  city: string
  province: string
  education_level: string
  addon_roles: string
  addon_role_labels: string
  enrolled_classes: number
  completed_classes: number
  is_active: boolean
}

export interface ParticipantStats {
  total: number
  active: number
  graduated: number
  talent_pool: number
}

export const useParticipantStore = defineStore('participants', () => {
  const participants = ref<Participant[]>([])
  const participantsByRole = ref<ParticipantByRole[]>([])
  const loading = ref(false)
  const creating = ref(false)
  const stats = ref<ParticipantStats>({ total: 0, active: 0, graduated: 0, talent_pool: 0 })

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  async function fetchParticipantsByRole() {
    loading.value = true
    try {
      const res: any = await useStaffApi('/staff/participants/by-role')
      const list = extractList(res?.data || res)
      participantsByRole.value = list
    } catch (err: any) {
      console.error('Failed to fetch participants by role:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  const participantStats = computed(() => stats.value)

  return {
    participants,
    participantsByRole,
    loading,
    creating,
    stats,
    participantStats,
    fetchParticipantsByRole,
  }
})
