import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface Question {
  id: string
  type: string
  title: string
  description?: string
  required: boolean
  options?: string[]
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string }
  maxFileSize?: number
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string | null
  location: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'private' | 'staff' | 'division' | 'public'
  short_code: string
  google_form_url: string
  google_form_id: string
  google_form_created: boolean
  google_sheet_id: string
  scan_count: number
  attendee_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export const useEventsStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const total = ref(0)
  const currentEvent = ref<Event | null>(null)
  const stats = ref<any>(null)
  const attendees = ref<any[]>([])
  const attendeesTotal = ref(0)
  const syncLogs = ref<any[]>([])
  const loading = ref(false)
  const scopeFilter = ref<string>('mine')

  async function fetchEvents(params?: { page?: number; search?: string; status?: string; scope?: string; has_form?: string }) {
    loading.value = true
    const currentScope = params?.scope || scopeFilter.value
    try {
      let url = '/staff/events'
      const query = new URLSearchParams()
      if (params?.page) query.set('page', String(params.page))
      query.set('limit', '20')
      if (params?.search) query.set('search', params.search)
      if (params?.status) query.set('status', params.status)
      if (currentScope) query.set('scope', currentScope)
      if (params?.has_form) query.set('has_form', params.has_form)
      const qs = query.toString()
      if (qs) url += '?' + qs
      if (import.meta.env.DEV) console.log('[Events Fetch] GET', url, 'scope:', currentScope)
      const res: any = await useStaffApi(url)
      if (import.meta.env.DEV) console.log('[Events Fetch] Response:', JSON.stringify(res))
      if (res?.success) {
        events.value = res.data || []
        total.value = res.total || 0
        if (import.meta.env.DEV) console.log('[Events Fetch] Loaded', events.value.length, 'events, total:', total.value)
      } else {
        if (import.meta.env.DEV) console.warn('[Events Fetch] !success:', res)
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Events Fetch] Error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchEvent(id: string) {
    if (import.meta.env.DEV) console.log('[Event Fetch] GET /staff/events/' + id)
    const res: any = await useStaffApi(`/staff/events/${id}`)
    if (import.meta.env.DEV) console.log('[Event Fetch] Response:', JSON.stringify(res))
    if (res?.success) currentEvent.value = res.data
    return currentEvent.value
  }

  async function createEvent(data: any) {
    if (import.meta.env.DEV) console.log('[Create Event] Sending POST /staff/events with payload:', JSON.stringify(data))
    const res: any = await useStaffApi('/staff/events', { method: 'POST', body: data })
    if (import.meta.env.DEV) console.log('[Create Event] Backend response:', JSON.stringify(res))
    if (res?.success) {
      if (import.meta.env.DEV) console.log('[Create Event] Success! Event ID:', res.data?.id, 'Refetching list...')
      await fetchEvents()
      if (import.meta.env.DEV) console.log('[Create Event] List refreshed')
    } else {
      if (import.meta.env.DEV) console.warn('[Create Event] !success:', res)
    }
    return res
  }

  async function updateEvent(id: string, data: any) {
    const res: any = await useStaffApi(`/staff/events/${id}`, { method: 'PUT', body: data })
    if (res?.success) currentEvent.value = res.data
    return res
  }

  async function deleteEvent(id: string) {
    const res: any = await useStaffApi(`/staff/events/${id}`, { method: 'DELETE' })
    if (res?.success) await fetchEvents()
    return res
  }

  async function fetchStats(id: string) {
    const res: any = await useStaffApi(`/staff/events/${id}/stats`)
    if (res?.success) stats.value = res.data
    return stats.value
  }

  async function fetchAttendees(id: string, page = 1) {
    const res: any = await useStaffApi(`/staff/events/${id}/attendees?page=${page}&limit=20`)
    if (res?.success) {
      attendees.value = res.data || []
      attendeesTotal.value = res.total || 0
    }
    return res
  }

  async function fetchSyncLogs(id: string) {
    const res: any = await useStaffApi(`/staff/events/${id}/sync-logs`)
    if (res?.success) syncLogs.value = res.data || []
    return syncLogs.value
  }

  async function triggerSync(id: string) {
    return useStaffApi(`/staff/events/${id}/sync`, { method: 'POST' })
  }

  async function regenerateCode(id: string) {
    const res: any = await useStaffApi(`/staff/events/${id}/regenerate-code`, { method: 'POST' })
    if (res?.success) currentEvent.value = res.data
    return res
  }

  function getQRUrl(id: string) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1'
    return `${baseURL}/staff/events/${id}/qr`
  }

  function getExportUrl(id: string) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1'
    return `${baseURL}/staff/events/${id}/export`
  }

  async function generateForm(eventId: string, data: { template_id?: string; questions: Question[] }) {
    return useStaffApi(`/staff/events/${eventId}/generate-form`, { method: 'POST', body: data })
  }

  async function pushQuestions(eventId: string, questions: Question[]) {
    return useStaffApi(`/staff/events/${eventId}/form-questions`, { method: 'PUT', body: { questions } })
  }

  async function syncFromGoogle(eventId: string) {
    const res: any = await useStaffApi(`/staff/events/${eventId}/sync-from-google`, { method: 'POST' })
    if (res?.success) return res.data
    return null
  }

  async function getFormConfig(eventId: string) {
    const res: any = await useStaffApi(`/staff/events/${eventId}/form-config`)
    if (res?.success) return res.data
    return null
  }

  return {
    events, total, currentEvent, stats, attendees, attendeesTotal, syncLogs, loading, scopeFilter,
    fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent,
    fetchStats, fetchAttendees, fetchSyncLogs, triggerSync, regenerateCode,
    getQRUrl, getExportUrl, generateForm, pushQuestions, syncFromGoogle, getFormConfig
  }
})
