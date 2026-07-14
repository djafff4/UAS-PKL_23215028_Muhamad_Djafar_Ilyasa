import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'
import type { EBook, EBookCategory, EBookBorrowing, EBookPreview, EBookTag, EBookVersion, EBookAccessLog } from '@/types'

function extractList(data: any): any[] {
  if (Array.isArray(data)) return data
  if (data?.items && Array.isArray(data.items)) return data.items
  if (data?.data && Array.isArray(data.data)) return data.data
  return []
}

export const useElibraryStore = defineStore('e-library', () => {
  const books = ref<EBook[]>([])
  const categories = ref<EBookCategory[]>([])
  const borrowings = ref<EBookBorrowing[]>([])
  const currentBook = ref<EBook | null>(null)
  const loading = ref(false)
  const submitting = ref(false)

  function mapBook(b: any): EBook {
    return {
      id: b.id || '',
      tenant_id: b.tenant_id || '',
      brand_id: b.brand_id || '',
      category_id: b.category_id || null,
      title: b.title || '',
      author: b.author || '',
      isbn: b.isbn || '',
      publisher: b.publisher || '',
      published_year: b.published_year || 0,
      description: b.description || '',
      language: b.language || 'id',
      page_count: b.page_count || 0,

      book_type: b.book_type || 'book',

      storage_provider: b.storage_provider || '',
      storage_file_id: b.storage_file_id || '',
      storage_folder_id: b.storage_folder_id || '',
      folder_path: b.folder_path || '',

      original_file_name: b.original_file_name || '',
      file_format: b.file_format || '',
      file_size: b.file_size || 0,

      cover_image_url: b.cover_image_url || '',
      thumbnail_url: b.thumbnail_url || '',

      preview_available: b.preview_available || false,
      preview_page_count: b.preview_page_count || 0,

      ai_summary: b.ai_summary || '',
      keywords: b.keywords || [],

      upload_status: b.upload_status || 'pending',
      preview_status: b.preview_status || 'pending',
      ai_status: b.ai_status || 'pending',

      access_type: b.access_type || 'internal',

      uploaded_by: b.uploaded_by || null,
      department_id: b.department_id || null,

      created_at: b.created_at || '',
      updated_at: b.updated_at || '',
      category: b.category ? mapCategory(b.category) : null,
      previews: b.previews ? b.previews.map(mapPreview) : [],
      tags: b.tags ? b.tags.map(mapTag) : [],
      versions: b.versions ? b.versions.map(mapVersion) : [],
    }
  }

  function mapCategory(c: any): EBookCategory {
    return {
      id: c.id || '',
      tenant_id: c.tenant_id || '',
      brand_id: c.brand_id || '',
      name: c.name || '',
      description: c.description || '',
      created_at: c.created_at || '',
      updated_at: c.updated_at || '',
    }
  }

  function mapPreview(p: any): EBookPreview {
    return {
      id: p.id || '',
      book_id: p.book_id || '',
      page_number: p.page_number || 0,
      image_url: p.image_url || '',
      width: p.width || 0,
      height: p.height || 0,
      created_at: p.created_at || '',
    }
  }

  function mapTag(t: any): EBookTag {
    return {
      id: t.id || '',
      tenant_id: t.tenant_id || '',
      brand_id: t.brand_id || '',
      name: t.name || '',
      created_at: t.created_at || '',
      updated_at: t.updated_at || '',
    }
  }

  function mapBorrowing(b: any): EBookBorrowing {
    return {
      id: b.id || '',
      tenant_id: b.tenant_id || '',
      brand_id: b.brand_id || '',
      book_id: b.book_id || '',
      user_id: b.user_id || '',
      borrowed_at: b.borrowed_at || '',
      due_date: b.due_date || '',
      returned_at: b.returned_at || null,
      status: b.status || 'borrowed',
      notes: b.notes || '',
      created_at: b.created_at || '',
      updated_at: b.updated_at || '',
      book: b.book ? mapBook(b.book) : null,
    }
  }

  function mapVersion(v: any): EBookVersion {
    return {
      id: v.id || '',
      book_id: v.book_id || '',
      version_number: v.version_number || 0,
      storage_file_id: v.storage_file_id || '',
      file_format: v.file_format || '',
      file_size: v.file_size || 0,
      change_notes: v.change_notes || '',
      created_by: v.created_by || '',
      created_at: v.created_at || '',
    }
  }

  function mapAccessLog(l: any): EBookAccessLog {
    return {
      id: l.id || '',
      book_id: l.book_id || '',
      user_id: l.user_id || '',
      action: l.action || '',
      ip_address: l.ip_address || '',
      user_agent: l.user_agent || '',
      created_at: l.created_at || '',
    }
  }

  async function fetchBooks(search = '', category = '', bookType = '', accessType = '', page = 1, size = 20) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (bookType) params.append('book_type', bookType)
      if (accessType) params.append('access_type', accessType)
      params.append('page', page.toString())
      params.append('size', size.toString())

      const res: any = await useStaffApi(`/staff/e-library/books?${params.toString()}`)
      const list = extractList(res?.data || res)
      books.value = list.map(mapBook)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch books:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchBookById(id: string) {
    loading.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${id}`)
      currentBook.value = mapBook(res?.data || res)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch book:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function uploadDocument(formData: FormData) {
    submitting.value = true
    try {
      const res: any = await useStaffApi('/staff/e-library/upload', {
        method: 'POST',
        body: formData,
      })
      if (res?.data) {
        books.value.unshift(mapBook(res.data))
      }
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal mengupload dokumen' }
    } finally {
      submitting.value = false
    }
  }

  async function updateBook(id: string, data: Partial<EBook>) {
    submitting.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${id}`, {
        method: 'PUT',
        body: data,
      })
      if (res?.data) {
        const index = books.value.findIndex(b => b.id === id)
        if (index !== -1) {
          books.value[index] = mapBook(res.data)
        }
        if (currentBook.value?.id === id) {
          currentBook.value = mapBook(res.data)
        }
      }
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal memperbarui buku' }
    } finally {
      submitting.value = false
    }
  }

  async function deleteBook(id: string) {
    submitting.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${id}`, {
        method: 'DELETE',
      })
      books.value = books.value.filter(b => b.id !== id)
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal menghapus buku' }
    } finally {
      submitting.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res: any = await useStaffApi('/staff/e-library/categories')
      const list = extractList(res?.data || res)
      categories.value = list.map(mapCategory)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch categories:', err?.message || err)
    }
  }

  async function createCategory(data: Partial<EBookCategory>) {
    submitting.value = true
    try {
      const res: any = await useStaffApi('/staff/e-library/categories', {
        method: 'POST',
        body: data,
      })
      if (res?.data) {
        categories.value.push(mapCategory(res.data))
      }
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat kategori' }
    } finally {
      submitting.value = false
    }
  }

  async function fetchPreviews(bookId: string) {
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/previews`)
      const list = extractList(res?.data || res)
      return list.map(mapPreview)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch previews:', err?.message || err)
      return []
    }
  }

  async function createPreview(bookId: string, data: Partial<EBookPreview>) {
    submitting.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/previews`, {
        method: 'POST',
        body: data,
      })
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat preview' }
    } finally {
      submitting.value = false
    }
  }

  async function fetchTags() {
    try {
      const res: any = await useStaffApi('/staff/e-library/tags')
      const list = extractList(res?.data || res)
      return list.map(mapTag)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch tags:', err?.message || err)
      return []
    }
  }

  async function createTag(data: Partial<EBookTag>) {
    submitting.value = true
    try {
      const res: any = await useStaffApi('/staff/e-library/tags', {
        method: 'POST',
        body: data,
      })
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat tag' }
    } finally {
      submitting.value = false
    }
  }

  async function syncBookTags(bookId: string, tagIds: string[]) {
    submitting.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/tags`, {
        method: 'PUT',
        body: { tag_ids: tagIds },
      })
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal memperbarui tag buku' }
    } finally {
      submitting.value = false
    }
  }

  async function fetchBorrowings(status = '', page = 1, size = 20) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('page', page.toString())
      params.append('size', size.toString())

      const res: any = await useStaffApi(`/staff/e-library/borrowings?${params.toString()}`)
      const list = extractList(res?.data || res)
      borrowings.value = list.map(mapBorrowing)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch borrowings:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  async function fetchVersions(bookId: string) {
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/versions`)
      const list = extractList(res?.data || res)
      return list.map(mapVersion)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch versions:', err?.message || err)
      return []
    }
  }

  async function createVersion(bookId: string, data: Partial<EBookVersion>) {
    submitting.value = true
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/versions`, {
        method: 'POST',
        body: data,
      })
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat versi' }
    } finally {
      submitting.value = false
    }
  }

  async function fetchAccessLogs(bookId: string, page = 1, size = 20) {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('size', size.toString())

      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/access-logs?${params.toString()}`)
      const list = extractList(res?.data || res)
      return list.map(mapAccessLog)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch access logs:', err?.message || err)
      return []
    }
  }

  async function createAccessLog(bookId: string, data: Partial<EBookAccessLog>) {
    try {
      const res: any = await useStaffApi(`/staff/e-library/books/${bookId}/access-logs`, {
        method: 'POST',
        body: data,
      })
      return res
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal membuat log akses' }
    }
  }

  async function fullTextSearch(query: string, page = 1, size = 20) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      params.append('page', page.toString())
      params.append('size', size.toString())

      const res: any = await useStaffApi(`/staff/e-library/search?${params.toString()}`)
      const list = extractList(res?.data || res)
      books.value = list.map(mapBook)
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to search:', err?.message || err)
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    categories,
    borrowings,
    currentBook,
    loading,
    submitting,
    fetchBooks,
    fetchBookById,
    updateBook,
    deleteBook,
    fetchCategories,
    createCategory,
    fetchPreviews,
    createPreview,
    fetchTags,
    createTag,
    syncBookTags,
    fetchBorrowings,
    fetchVersions,
    createVersion,
    fetchAccessLogs,
    createAccessLog,
    fullTextSearch,
    uploadDocument,
  }
})
