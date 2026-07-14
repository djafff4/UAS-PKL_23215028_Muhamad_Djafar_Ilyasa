import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export const useMeetingStore = defineStore('meetings', () => {
  const meetings = ref<any[]>([])
  const currentMeeting = ref<any>(null)
  const creating = ref(false)
  const loading = ref(false)

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  function mapMeeting(m: any) {
    let participants: any[] = []
    if (m.participants) {
      if (Array.isArray(m.participants)) {
        participants = m.participants
      } else if (typeof m.participants === 'string') {
        try { participants = JSON.parse(m.participants) } catch { participants = [] }
      }
    }
    return {
      id: m.id,
      title: m.title || '',
      date: m.date || '',
      time: m.time || '',
      location: m.location || '',
      notulen: m.notulen || '',
      participants,
      status: m.status || 'SCHEDULED',
    }
  }

  async function fetchMeetings() {
    try {
      const res: any = await useStaffApi('/staff/meetings')
      const list = extractList(res?.data || res)
      if (list.length) {
        meetings.value = list.map(mapMeeting)
      }
    } catch {
      // silent
    }
  }

  async function fetchMeeting(id: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/meetings/${id}`)
      if (res?.data) {
        currentMeeting.value = mapMeeting(res.data)
      } else if (res?.success && res.data) {
        currentMeeting.value = mapMeeting(res.data)
      }
      return currentMeeting.value
    } catch {
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateMeeting(id: string, data: {
    title?: string
    date?: string
    time?: string
    location?: string
    notulen?: string
    status?: string
  }) {
    try {
      const res: any = await useStaffApi(`/staff/meetings/${id}`, {
        method: 'PUT',
        body: data,
      })
      if (res?.success || res?.data) {
        const idx = meetings.value.findIndex(m => m.id === id)
        if (idx !== -1) {
          meetings.value[idx] = { ...meetings.value[idx], ...data }
        }
        if (currentMeeting.value?.id === id) {
          currentMeeting.value = { ...currentMeeting.value, ...data }
        }
      }
      return res
    } catch {
      return { success: false, message: 'Gagal mengupdate meeting' }
    }
  }

  async function deleteMeeting(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/meetings/${id}`, {
        method: 'DELETE',
      })
      if (res?.success || res?.status === 200 || res?.status === 204) {
        meetings.value = meetings.value.filter(m => m.id !== id)
        if (currentMeeting.value?.id === id) {
          currentMeeting.value = null
        }
      }
      return res
    } catch {
      return { success: false, message: 'Gagal menghapus meeting' }
    }
  }

  async function createMeeting(data: {
    title: string
    date: string
    time: string
    location: string
    notulen?: string
    status: string
  }) {
    creating.value = true
    try {
      const res: any = await useStaffApi('/staff/meetings', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        const mapped = mapMeeting(res.data)
        meetings.value.unshift(mapped)
      }
      fetchMeetings()
      return res
    } catch {
      return { success: false, message: 'Gagal membuat meeting' }
    } finally {
      creating.value = false
    }
  }

  return { meetings, currentMeeting, creating, loading, fetchMeetings, fetchMeeting, createMeeting, updateMeeting, deleteMeeting }
})
