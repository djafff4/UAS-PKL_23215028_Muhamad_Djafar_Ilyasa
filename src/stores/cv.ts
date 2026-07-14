import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import type { CV, Education, Experience, Language } from '@/types'


function generateId() {
  return `cv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

export const useCvStore = defineStore('cv', () => {
  const cvs = ref<CV[]>([])
  const currentCv = ref<CV | null>(null)
  const loading = ref(false)
  const apiError = ref<string | null>(null)

  async function fetchCvs() {
    loading.value = true
    apiError.value = null
    try {
      const res: any = await useApi('/staff/cv')
      if (res.success && Array.isArray(res.data)) {
        cvs.value = res.data
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Gagal memuat daftar CV'
      apiError.value = msg
      console.error('[CV] fetchCvs error:', msg)
    } finally {
      loading.value = false
    }
  }

  async function fetchCv(id: string) {
    loading.value = true
    apiError.value = null
    try {
      const res: any = await useApi(`/staff/cv/${id}`)
      if (res.success && res.data) {
        currentCv.value = res.data
        // Sync into cvs list so saveCv recognizes it as existing
        const idx = cvs.value.findIndex(c => c.id === res.data.id)
        if (idx >= 0) cvs.value[idx] = res.data
        else cvs.value.push(res.data)
        return res.data as CV
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Gagal memuat CV'
      apiError.value = msg
      console.error('[CV] fetchCv error:', msg)
    } finally {
      loading.value = false
    }
    return null
  }

  function createBlankCv(): CV {
    const auth = useAuthStore()
    const p = auth.user?.profile
    const s = auth.user?.staff_detail
    const pd = auth.user?.participant_detail  // birth_place/address tersimpan di sini

    return {
      id: generateId(),
      title: 'CV Baru',
      template: 'modern',
      summary: '',
      // Auto-fill dari profil user (sama seperti Navbar)
      full_name: p?.full_name || '',
      email: auth.user?.email || '',
      phone: auth.user?.phone || '',
      avatar_url: p?.avatar_url || '',
      position: s?.position || '',        // opsional — bisa diubah
      department: s?.department || '',    // opsional — bisa diubah
      date_of_birth: p?.date_of_birth || '',
      birth_place: p?.birth_place || pd?.birth_place || '',
      education: [],
      experience: [],
      skills: [],
      skill_details: [],
      certifications: [],
      languages: [],
      social_media: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  async function saveCv(cv: CV): Promise<CV | null> {
    apiError.value = null
    const isUpdate = cvs.value.some(c => c.id === cv.id)
    const updated = { ...cv, updated_at: new Date().toISOString() }

    try {
      const url = isUpdate ? `/staff/cv/${cv.id}` : '/staff/cv'
      const res: any = await useApi(url, {
        method: isUpdate ? 'PUT' : 'POST',
        body: updated,
      })
      if (res.success && res.data) {
        const saved = res.data as CV
        const idx = cvs.value.findIndex(c => c.id === saved.id)
        if (idx >= 0) cvs.value[idx] = saved
        else cvs.value.push(saved)
        currentCv.value = saved
        return saved
      }
      throw new Error(res?.message || 'Server tidak mengembalikan data CV')
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Gagal menyimpan CV ke server'
      apiError.value = msg
      console.error('[CV] saveCv error:', msg)
      return null
    }
  }

  async function deleteCv(id: string) {
    apiError.value = null
    try {
      await useApi(`/staff/cv/${id}`, { method: 'DELETE' })
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Gagal menghapus CV'
      apiError.value = msg
      console.error('[CV] deleteCv error:', msg)
    }
    cvs.value = cvs.value.filter(c => c.id !== id)
    if (currentCv.value?.id === id) currentCv.value = null
  }

  function clearError() {
    apiError.value = null
  }

  function addEducation(cv: CV, edu?: Partial<Education>) {
    const item: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: '',
      end_year: '',
      ...edu,
    }
    cv.education.push(item)
  }

  function removeEducation(cv: CV, id: string) {
    cv.education = cv.education.filter(e => e.id !== id)
  }

  function addExperience(cv: CV, exp?: Partial<Experience>) {
    const item: Experience = {
      id: generateId(),
      company: '',
      position: '',
      start_date: '',
      current: false,
      description: '',
      ...exp,
    }
    cv.experience.push(item)
  }

  function removeExperience(cv: CV, id: string) {
    cv.experience = cv.experience.filter(e => e.id !== id)
  }

  function addLanguage(cv: CV, lang?: Partial<Language>) {
    const item: Language = {
      id: generateId(),
      name: '',
      level: 'menengah',
      ...lang,
    }
    cv.languages.push(item)
  }

  function removeLanguage(cv: CV, id: string) {
    cv.languages = cv.languages.filter(l => l.id !== id)
  }

  return {
    cvs, currentCv, loading, apiError,
    fetchCvs, fetchCv, createBlankCv, saveCv, deleteCv,
    addEducation, removeEducation,
    addExperience, removeExperience,
    addLanguage, removeLanguage,
    clearError,
  }
})
