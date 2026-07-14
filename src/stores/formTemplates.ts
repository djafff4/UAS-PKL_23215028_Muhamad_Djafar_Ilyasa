import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'

export interface FormTemplate {
  id: string
  name: string
  config: string
  created_at: string
  updated_at: string
}

function mapTemplate(raw: any): FormTemplate {
  if (!raw) return raw
  return {
    id: raw.id || raw.ID || '',
    name: raw.name || raw.Name || '',
    config: raw.config || raw.Config || '',
    created_at: raw.created_at || raw.CreatedAt || '',
    updated_at: raw.updated_at || raw.UpdatedAt || '',
  }
}

export const useFormTemplatesStore = defineStore('formTemplates', () => {
  const templates = ref<FormTemplate[]>([])
  const currentTemplate = ref<FormTemplate | null>(null)
  const loading = ref(false)

  async function fetchTemplates() {
    loading.value = true
    try {
      const res: any = await useStaffApi('/staff/form-templates')
      if (res?.success) templates.value = (res.data || []).map(mapTemplate)
    } finally {
      loading.value = false
    }
  }

  async function fetchTemplate(id: string) {
    const res: any = await useStaffApi(`/staff/form-templates/${id}`)
    if (res?.success) currentTemplate.value = mapTemplate(res.data)
    return currentTemplate.value
  }

  async function createTemplate(data: { name: string; config: string }) {
    const res: any = await useStaffApi('/staff/form-templates', { method: 'POST', body: data })
    if (res?.success) await fetchTemplates()
    return res
  }

  async function updateTemplate(id: string, data: { name?: string; config?: string }) {
    const res: any = await useStaffApi(`/staff/form-templates/${id}`, { method: 'PUT', body: data })
    if (res?.success) currentTemplate.value = mapTemplate(res.data)
    return res
  }

  async function deleteTemplate(id: string) {
    const res: any = await useStaffApi(`/staff/form-templates/${id}`, { method: 'DELETE' })
    if (res?.success) await fetchTemplates()
    return res
  }

  return { templates, currentTemplate, loading, fetchTemplates, fetchTemplate, createTemplate, updateTemplate, deleteTemplate }
})
