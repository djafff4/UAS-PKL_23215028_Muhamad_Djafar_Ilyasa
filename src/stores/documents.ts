import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'
import { useApi } from '@/composables/useApi'

export const useDocumentStore = defineStore('documents', () => {
  const documents = ref<any[]>([])
  const uploading = ref(false)

  function extractList(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data?.items && Array.isArray(data.items)) return data.items
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  function mapDocument(d: any) {
    return {
      id: d.id,
      title: d.title || '',
      type: d.doc_type || 'PDF',
      divisi: d.divisi || '',
      uploadedBy: { id: d.user_id, name: d.title },
      uploadedAt: d.uploaded_at || d.uploadedAt || d.created_at,
      fileSize: d.file_size || '-',
      category: d.category || '',
    }
  }

  async function fetchDocuments() {
    try {
      const res: any = await useStaffApi('/staff/documents')
      const list = extractList(res?.data || res)
      if (list.length) {
        documents.value = list.map(mapDocument)
      }
    } catch (err: any) {
      console.error('Failed to fetch documents:', err?.message || err)
    }
  }

  async function uploadDocument(file: File, title: string, category: string) {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('doc_type', category)

      const res: any = await useApi('/staff/documents', {
        method: 'POST',
        body: formData,
      })
      if (res?.data) {
        documents.value.unshift(mapDocument(res.data))
      }
      fetchDocuments()
      return res
    } catch {
      return { success: false, message: 'Upload gagal' }
    } finally {
      uploading.value = false
    }
  }

  async function deleteDocument(id: string) {
    try {
      await useStaffApi(`/staff/documents/${id}`, { method: 'DELETE' })
      documents.value = documents.value.filter((d: any) => d.id !== id)
      return { success: true }
    } catch {
      return { success: false, message: 'Gagal menghapus dokumen' }
    }
  }

  return { documents, uploading, fetchDocuments, uploadDocument, deleteDocument }
})
