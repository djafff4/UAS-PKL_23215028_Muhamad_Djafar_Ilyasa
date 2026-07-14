<template>
  <div ref="cvContent" class="cv-a4-page cv-modern">
    <div class="cv-grid">
      <div class="cv-left">
        <div class="cv-avatar-wrap">
          <div class="cv-avatar">
            <img v-if="cv.avatar_url" :src="cv.avatar_url" :alt="cv.full_name" class="cv-avatar-img" @error="onAvatarError" />
            <span v-else class="cv-avatar-fallback">{{ initials }}</span>
          </div>
        </div>

        <h1 class="cv-name">{{ cv.full_name || 'Nama Lengkap' }}</h1>

        <div class="cv-block">
          <h3 class="cv-block-title">Kontak</h3>
          <div class="cv-contact-list">
            <div v-if="cv.phone" class="cv-contact-row">
              <Phone :size="13" class="cv-contact-icon" />
              <span>{{ cv.phone }}</span>
            </div>
            <div v-if="cv.email" class="cv-contact-row">
              <Mail :size="13" class="cv-contact-icon" />
              <span>{{ cv.email }}</span>
            </div>
          </div>
        </div>

        <div v-if="hasSocialMedia" class="cv-block">
          <h3 class="cv-block-title">Media Sosial</h3>
          <div class="cv-social-row">
            <a v-if="cv.social_media?.facebook" :href="cv.social_media.facebook" target="_blank" rel="noopener" class="cv-social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a v-if="cv.social_media?.instagram" :href="cv.social_media.instagram" target="_blank" rel="noopener" class="cv-social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a v-if="cv.social_media?.tiktok" :href="cv.social_media.tiktok" target="_blank" rel="noopener" class="cv-social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a v-if="cv.social_media?.youtube" :href="cv.social_media.youtube" target="_blank" rel="noopener" class="cv-social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a v-if="cv.social_media?.whatsapp" :href="'https://wa.me/' + cv.social_media.whatsapp" target="_blank" rel="noopener" class="cv-social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        <div v-if="cv.skill_details.length > 0" class="cv-block">
          <h3 class="cv-block-title">Keahlian</h3>
          <div v-for="skill in cv.skill_details" :key="skill.name" class="cv-skill-item">
            <div class="cv-skill-header">
              <span class="cv-skill-name">{{ skill.name }}</span>
              <span class="cv-skill-pct">{{ skill.percentage }}%</span>
            </div>
            <div class="cv-skill-track">
              <div class="cv-skill-fill" :style="{ width: skill.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="cv-right">
        <div class="cv-right-content">
          <div v-if="cv.summary" class="cv-rt-section">
            <h3 class="cv-rt-title">Tentang Saya</h3>
            <p class="cv-summary">{{ cv.summary }}</p>
          </div>

          <div v-if="cv.education.length > 0" class="cv-rt-section">
            <h3 class="cv-rt-title">Pendidikan</h3>
            <div v-for="edu in cv.education" :key="edu.id" class="cv-rt-entry">
              <p class="cv-rt-year">{{ edu.start_year }} — {{ edu.end_year || 'Sekarang' }}</p>
              <p class="cv-rt-head">{{ edu.institution }}</p>
              <p class="cv-rt-sub">{{ edu.degree }}{{ edu.field_of_study ? ' — ' + edu.field_of_study : '' }}</p>
            </div>
          </div>

          <div v-if="cv.experience.length > 0" class="cv-rt-section">
            <h3 class="cv-rt-title">Pengalaman Kerja</h3>
            <div v-for="exp in cv.experience" :key="exp.id" class="cv-rt-entry">
              <p class="cv-rt-year">{{ exp.start_date }} — {{ exp.current ? 'Sekarang' : exp.end_date }}</p>
              <p class="cv-rt-head">{{ exp.position }}</p>
              <p class="cv-rt-sub">{{ exp.company }}{{ exp.location ? ', ' + exp.location : '' }}</p>
              <p v-if="exp.description" class="cv-rt-detail">{{ exp.description }}</p>
            </div>
          </div>

          <div v-if="cv.certifications.length > 0" class="cv-rt-section">
            <h3 class="cv-rt-title">Sertifikasi</h3>
            <div class="cv-cert-grid">
              <div v-for="cert in cv.certifications" :key="cert.id" class="cv-cert-item">
                <p class="cv-cert-year">{{ cert.date }}</p>
                <p class="cv-cert-name">{{ cert.name }}</p>
                <p class="cv-cert-issuer">{{ cert.issuer }}</p>
              </div>
            </div>
          </div>

          <div v-if="cv.languages && cv.languages.length > 0" class="cv-rt-section">
            <h3 class="cv-rt-title">Bahasa</h3>
            <div class="cv-languages">
              <div v-for="lang in cv.languages" :key="lang.id" class="cv-lang-item">
                <span class="cv-lang-name">{{ lang.name }}</span>
                <span class="cv-lang-level">{{ lang.level === 'dasar' ? 'Dasar' : lang.level === 'menengah' ? 'Menengah' : 'Lancar' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cv-right-qr">
          <QrcodeVue :value="qrValue" :size="48" level="M" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Phone, Mail } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { useCompanyStore } from '@/stores/company'
import type { CV } from '@/types'

const props = defineProps<{
  cv: CV
}>()

const company = useCompanyStore()
const cvContent = ref<HTMLElement | null>(null)

onMounted(() => {
  company.fetchProfile()
})

const initials = computed(() => {
  const name = props.cv.full_name || 'Staff'
  const parts = name.split(' ')
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
})

const hasSocialMedia = computed(() => {
  const sm = props.cv.social_media
  return sm && (sm.facebook || sm.instagram || sm.tiktok || sm.youtube || sm.whatsapp || sm.linkedin || sm.twitter || sm.github)
})

const qrValue = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/cv/' + props.cv.id
  }
  return 'https://akman.id/cv/' + props.cv.id
})

function onAvatarError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const fallback = img.nextElementSibling as HTMLElement | null
  if (fallback) fallback.style.display = 'flex'
}

defineExpose({ cvContent })
</script>

<style scoped>
.cv-modern {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: white;
  color: #1e293b;
  width: 794px;
  min-height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  line-height: 1.4;
  box-sizing: border-box;
  overflow: hidden;
}

.cv-grid {
  display: flex;
  min-height: 1123px;
}

.cv-left {
  width: 35%;
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
  color: #e0e7ff;
  padding: 28px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

.cv-avatar-wrap {
  display: flex;
  justify-content: center;
}

.cv-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cv-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cv-avatar-fallback {
  font-size: 28px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.cv-name {
  font-size: 18px;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0;
  line-height: 1.2;
}

.cv-role {
  font-size: 11px;
  font-weight: 500;
  color: #a5b4fc;
  text-align: center;
  margin: -6px 0 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cv-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cv-block-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #a5b4fc;
  margin: 0;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(165, 180, 252, 0.2);
  padding-bottom: 5px;
}

.cv-contact-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cv-contact-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #c7d2fe;
  word-break: break-all;
}

.cv-contact-icon {
  flex-shrink: 0;
  color: #818cf8;
}

.cv-social-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cv-social-link {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7d2fe;
  transition: all 0.15s;
  text-decoration: none;
}

.cv-social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.cv-skill-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cv-skill-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}

.cv-skill-name {
  font-weight: 600;
  color: #e0e7ff;
}

.cv-skill-pct {
  font-weight: 700;
  color: #a5b4fc;
}

.cv-skill-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.cv-skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #818cf8, #a78bfa);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.cv-right {
  width: 65%;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.cv-right-content {
  flex: 1;
  padding: 24px 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cv-right-qr {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 6px 24px 12px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  margin-top: auto;
}

.cv-right-qr > * {
  background: white;
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  line-height: 0;
}

.cv-rt-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cv-rt-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #312e81;
  margin: 0;
  text-transform: uppercase;
  padding-bottom: 4px;
  border-bottom: 2px solid #312e81;
}

.cv-summary {
  font-size: 11px;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}

.cv-rt-entry {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 4px 0;
  border-bottom: 1px solid #f1f5f9;
}

.cv-rt-entry:last-child {
  border-bottom: none;
}

.cv-rt-year {
  font-size: 9px;
  font-weight: 600;
  color: #6366f1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cv-rt-head {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.cv-rt-sub {
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  margin: 0;
}

.cv-rt-detail {
  font-size: 10px;
  color: #475569;
  margin: 2px 0 0;
  line-height: 1.4;
}

.cv-cert-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.cv-cert-item {
  padding: 6px 8px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.cv-cert-year {
  font-size: 9px;
  font-weight: 600;
  color: #6366f1;
  margin: 0;
}

.cv-cert-name {
  font-size: 10px;
  font-weight: 600;
  color: #1e293b;
  margin: 2px 0 0;
  line-height: 1.3;
}

.cv-cert-issuer {
  font-size: 9px;
  color: #64748b;
  margin: 1px 0 0;
}

.cv-languages {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cv-lang-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.cv-lang-name {
  font-size: 10px;
  font-weight: 600;
  color: #1e293b;
}

.cv-lang-level {
  font-size: 9px;
  font-weight: 500;
  color: #6366f1;
  padding: 1px 5px;
  background: #eef2ff;
  border-radius: 4px;
}

@media print {
  .cv-modern {
    max-width: 100%;
  }
  .cv-left {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cv-skill-fill {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cv-right-qr {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
