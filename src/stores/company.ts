import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export interface CompanyProfile {
  id?: string
  name: string
  tagline: string
  logo_url: string
  favicon_url?: string
  address: string
  phone: string
  email: string
  website?: string
  social_media?: {
    facebook?: string
    instagram?: string
    tiktok?: string
    youtube?: string
    whatsapp?: string
  }
  features?: Record<string, boolean>
  footer_text: string
}

const DEFAULT_COMPANY: CompanyProfile = {
  name: 'AKMAN ACADEMY',
  tagline: 'Pusat Pengembangan Sumber Daya Manusia',
  logo_url: '/assets/logo/logo_akman.png',
  address: 'Jl. Contoh No. 123, Jakarta Selatan',
  phone: '(021) 1234-5678',
  email: 'info@akman.id',
  footer_text: '© 2026 AKMAN ACADEMY. Platform Pelatihan Kompetensi & Karir Global.',
}

export const useCompanyStore = defineStore('company', () => {
  const profile = ref<CompanyProfile>({ ...DEFAULT_COMPANY })
  const loading = ref(false)
  const fetched = ref(false)

  async function fetchProfile() {
    if (fetched.value) return
    loading.value = true
    try {
      const res: any = await useApi('/company/profile')
      if (res?.success && res?.data) {
        profile.value = { ...DEFAULT_COMPANY, ...res.data }
        fetched.value = true
      }
    } catch {
      // Keep default — API might not be available yet
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, fetched, fetchProfile }
})
