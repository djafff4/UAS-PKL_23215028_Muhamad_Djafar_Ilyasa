import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'
import type { Note } from '@/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const categoryFilter = ref<string>('')
  const searchQuery = ref<string>('')

  function mapNote(n: any): Note {
    return {
      id: n.id,
      title: n.title || '',
      content: n.content || '',
      category: n.category || 'Umum',
      is_personal: n.is_personal ?? true,
      pinned: n.pinned ?? false,
      tags: Array.isArray(n.tags) ? n.tags : (typeof n.tags === 'string' ? n.tags.split(',').map((t: string) => t.trim()) : []),
      created_by: n.created_by || '',
      created_at: n.created_at || '',
      updated_at: n.updated_at || '',
    }
  }

  const categories = ref<string[]>([
    'Umum',
    'Rapat',
    'Ide',
    'To-Do',
    'Technical',
    'Lainnya',
  ])

  const filteredNotes = ref<Note[]>([])

  function applyFilters() {
    let result = notes.value
    if (categoryFilter.value) {
      result = result.filter(n => n.category === categoryFilter.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    filteredNotes.value = result
  }

  async function fetchNotes() {
    loading.value = true
    try {
      const res: any = await useStaffApi('/staff/notes')
      let list: any[] = []
      if (Array.isArray(res)) list = res
      else if (res?.data && Array.isArray(res.data)) list = res.data
      else if (res?.items && Array.isArray(res.items)) list = res.items
      notes.value = list.map(mapNote)
      applyFilters()
    } catch {
      // silent
    } finally {
      loading.value = false
    }
  }

  async function fetchNote(id: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/notes/${id}`)
      const data = res?.data || res
      if (data) {
        currentNote.value = mapNote(data)
      }
      return currentNote.value
    } catch {
      return null
    } finally {
      loading.value = false
    }
  }

  async function createNote(data: {
    title: string
    content: string
    category: string
    is_personal: boolean
    tags: string[]
  }) {
    saving.value = true
    try {
      const res: any = await useStaffApi('/staff/notes', {
        method: 'POST',
        body: data,
      })
      if (res?.data || res?.success) {
        const mapped = mapNote(res.data || res)
        notes.value.unshift(mapped)
        applyFilters()
      }
      fetchNotes()
      return res
    } catch {
      return { success: false, message: 'Gagal membuat catatan' }
    } finally {
      saving.value = false
    }
  }

  async function updateNote(id: string, data: Partial<Note>) {
    try {
      const res: any = await useStaffApi(`/staff/notes/${id}`, {
        method: 'PUT',
        body: data,
      })
      if (res?.success || res?.data) {
        const idx = notes.value.findIndex(n => n.id === id)
        if (idx !== -1) {
          notes.value[idx] = { ...notes.value[idx], ...data }
        }
        if (currentNote.value?.id === id) {
          currentNote.value = { ...currentNote.value, ...data }
        }
        applyFilters()
      }
      return res
    } catch {
      return { success: false, message: 'Gagal mengupdate catatan' }
    }
  }

  async function deleteNote(id: string) {
    try {
      const res: any = await useStaffApi(`/staff/notes/${id}`, {
        method: 'DELETE',
      })
      if (res?.success || res?.status === 200 || res?.status === 204) {
        notes.value = notes.value.filter(n => n.id !== id)
        if (currentNote.value?.id === id) {
          currentNote.value = null
        }
        applyFilters()
      }
      return res
    } catch {
      return { success: false, message: 'Gagal menghapus catatan' }
    }
  }

  async function togglePin(id: string) {
    const note = notes.value.find(n => n.id === id)
    if (!note) return
    const newPinned = !note.pinned
    await updateNote(id, { pinned: newPinned })
    if (currentNote.value?.id === id) {
      currentNote.value.pinned = newPinned
    }
    applyFilters()
  }

  return {
    notes, currentNote, loading, saving, categories,
    categoryFilter, searchQuery, filteredNotes,
    fetchNotes, fetchNote, createNote, updateNote, deleteNote, togglePin,
    applyFilters,
  }
})
