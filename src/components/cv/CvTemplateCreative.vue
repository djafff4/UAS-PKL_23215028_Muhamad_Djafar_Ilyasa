<template>
  <div ref="cvContent" class="cv-a4-page cv-creative">
    <!-- Top accent block -->
    <div class="cv-top-accent">
      <div class="cv-top-inner">
        <div class="cv-avatar">
          <img
            v-if="cv.avatar_url"
            :src="cv.avatar_url"
            :alt="cv.full_name"
            class="cv-avatar-img"
            @error="onAvatarError"
          />
          <span v-else class="cv-avatar-fallback">{{ initials }}</span>
        </div>
        <div class="cv-top-info">
          <h1 class="cv-name">{{ cv.full_name || 'Nama Lengkap' }}</h1>
          <div class="cv-top-contact">
            <span v-if="cv.phone" class="cv-top-contact-item">
              <Phone :size="11" />
              {{ cv.phone }}
            </span>
            <span v-if="cv.email" class="cv-top-contact-item">
              <Mail :size="11" />
              {{ cv.email }}
            </span>
          </div>
        </div>
      </div>
      <!-- Geometric decoration -->
      <div class="cv-geo-triangle"></div>
    </div>

    <!-- Main body -->
    <div class="cv-body">
      <!-- Left column -->
      <div class="cv-col-left">
        <!-- Summary -->
        <section v-if="cv.summary" class="cv-section">
          <h2 class="cv-section-title">
            <span class="cv-title-icon"></span>
            Tentang Saya
          </h2>
          <p class="cv-summary-text">{{ cv.summary }}</p>
        </section>

        <!-- Experience -->
        <section v-if="cv.experience.length > 0" class="cv-section">
          <h2 class="cv-section-title">
            <span class="cv-title-icon"></span>
            Pengalaman Kerja
          </h2>
          <div v-for="(exp, idx) in cv.experience" :key="exp.id" class="cv-exp-card">
            <div class="cv-exp-marker">
              <div class="cv-exp-dot"></div>
              <div v-if="idx < cv.experience.length - 1" class="cv-exp-line"></div>
            </div>
            <div class="cv-exp-content">
              <div class="cv-exp-header">
                <p class="cv-exp-position">{{ exp.position }}</p>
                <span class="cv-exp-badge">{{ formatDateRange(exp.start_date, exp.end_date, exp.current) }}</span>
              </div>
              <p class="cv-exp-company">{{ exp.company }}{{ exp.location ? ', ' + exp.location : '' }}</p>
              <p v-if="exp.description" class="cv-exp-desc">{{ exp.description }}</p>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section v-if="cv.education.length > 0" class="cv-section">
          <h2 class="cv-section-title">
            <span class="cv-title-icon"></span>
            Pendidikan
          </h2>
          <div v-for="edu in cv.education" :key="edu.id" class="cv-edu-row">
            <div class="cv-edu-year">{{ edu.start_year }} — {{ edu.end_year || 'Sekarang' }}</div>
            <div class="cv-edu-info">
              <p class="cv-edu-institution">
                {{ edu.institution }}
                <span v-if="edu.degree || edu.field_of_study" class="cv-edu-degree-inline">
                  {{ edu.degree }}{{ edu.field_of_study ? ' — ' + edu.field_of_study : '' }}
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right column -->
      <div class="cv-col-right">
        <!-- Skills -->
        <section v-if="cv.skill_details.length > 0" class="cv-section">
          <h2 class="cv-section-title cv-section-title-alt">
            <span class="cv-title-icon cv-title-icon-alt"></span>
            Keahlian
          </h2>
          <div class="cv-skill-badges">
            <span v-for="skill in cv.skill_details" :key="skill.name" class="cv-skill-badge">{{ skill.name }}</span>
          </div>
        </section>

        <!-- Simple skills badges -->
        <section v-if="cv.skills.length > 0 && cv.skill_details.length === 0" class="cv-section">
          <h2 class="cv-section-title cv-section-title-alt">
            <span class="cv-title-icon cv-title-icon-alt"></span>
            Keahlian
          </h2>
          <div class="cv-skill-badges">
            <span v-for="skill in cv.skills" :key="skill" class="cv-skill-badge">{{ skill }}</span>
          </div>
        </section>

        <!-- Certifications -->
        <section v-if="cv.certifications.length > 0" class="cv-section">
          <h2 class="cv-section-title cv-section-title-alt">
            <span class="cv-title-icon cv-title-icon-alt"></span>
            Sertifikasi
          </h2>
          <div class="cv-cert-list">
            <div v-for="cert in cv.certifications" :key="cert.id" class="cv-cert-card">
              <div class="cv-cert-date-badge">{{ cert.date }}</div>
              <div class="cv-cert-info">
                <p class="cv-cert-name">{{ cert.name }}</p>
                <p class="cv-cert-issuer">{{ cert.issuer }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="cv.languages && cv.languages.length > 0" class="cv-section">
          <h2 class="cv-section-title cv-section-title-alt">
            <span class="cv-title-icon cv-title-icon-alt"></span>
            Bahasa
          </h2>
          <div class="cv-languages">
            <div v-for="lang in cv.languages" :key="lang.id" class="cv-lang-item">
              <span class="cv-lang-name">{{ lang.name }}</span>
              <span class="cv-lang-level">{{ lang.level === 'dasar' ? 'Dasar' : lang.level === 'menengah' ? 'Menengah' : 'Lancar' }}</span>
            </div>
          </div>
        </section>

        <!-- Social Media -->
        <section v-if="hasSocialMedia" class="cv-section">
          <h2 class="cv-section-title cv-section-title-alt">
            <span class="cv-title-icon cv-title-icon-alt"></span>
            Media Sosial
          </h2>
          <div class="cv-social-grid">
            <a
              v-if="cv.social_media?.facebook"
              :href="cv.social_media.facebook"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.instagram"
              :href="cv.social_media.instagram"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.tiktok"
              :href="cv.social_media.tiktok"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.youtube"
              :href="cv.social_media.youtube"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.whatsapp"
              :href="'https://wa.me/' + cv.social_media.whatsapp"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.linkedin"
              :href="cv.social_media.linkedin"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.twitter"
              :href="cv.social_media.twitter"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              v-if="cv.social_media?.github"
              :href="cv.social_media.github"
              target="_blank"
              rel="noopener"
              class="cv-social-tile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </section>

        <!-- QR Code -->
        <div class="cv-qr-block">
          <QrcodeVue :value="qrValue" :size="48" level="M" />
          <span class="cv-qr-label">Scan untuk CV online</span>
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

function extractYear(dateStr: string): string {
  if (!dateStr) return ''
  if (/^\d{4}$/.test(dateStr)) return dateStr
  const match = dateStr.match(/(\d{4})/)
  return match ? match[1] : dateStr
}

function formatDateRange(start: string, end?: string, current?: boolean): string {
  const s = extractYear(start)
  if (current) return s ? `${s} — Sekarang` : 'Sekarang'
  const e = extractYear(end || '')
  if (s && e) return `${s} — ${e}`
  if (s) return s
  if (e) return e
  return ''
}

defineExpose({ cvContent })
</script>

<style scoped>
.cv-creative {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background: #ffffff;
  color: #1e293b;
  width: 794px;
  min-height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  line-height: 1.45;
  box-sizing: border-box;
  overflow: hidden;
}

/* ── Top Accent Block ── */
.cv-top-accent {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%);
  color: #ffffff;
  padding: 28px 32px 28px;
  position: relative;
  overflow: hidden;
}

.cv-top-inner {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
}

.cv-avatar {
  width: 76px;
  height: 76px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: #115e59;
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
  font-size: 24px;
  font-weight: 800;
  color: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.cv-top-info {
  flex: 1;
}

.cv-name {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.3px;
}

.cv-position {
  font-size: 11px;
  font-weight: 600;
  color: #f97316;
  margin: 3px 0 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cv-top-contact {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.cv-top-contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
}

.cv-geo-triangle {
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 140px;
  height: 140px;
  background: rgba(249, 115, 22, 0.15);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* ── Body ── */
.cv-body {
  display: flex;
  min-height: calc(1123px - 160px);
}

.cv-col-left {
  flex: 1;
  padding: 22px 24px 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cv-col-right {
  width: 260px;
  background: #f8fafc;
  padding: 22px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-left: 3px solid #0d9488;
  flex-shrink: 0;
}

/* ── Sections ── */
.cv-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cv-section-title {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
  color: #0d9488;
  margin: 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 7px;
  padding-bottom: 5px;
  border-bottom: 2px solid #0d9488;
}

.cv-section-title-alt {
  color: #0d9488;
  border-bottom-color: #99f6e4;
}

.cv-title-icon {
  width: 6px;
  height: 6px;
  background: #f97316;
  border-radius: 2px;
  flex-shrink: 0;
}

.cv-title-icon-alt {
  background: #f97316;
}

/* ── Summary ── */
.cv-summary-text {
  font-size: 10.5px;
  color: #475569;
  margin: 0;
  line-height: 1.65;
}

/* ── Experience ── */
.cv-exp-card {
  display: flex;
  gap: 12px;
}

.cv-exp-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
}

.cv-exp-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: #0d9488;
  flex-shrink: 0;
}

.cv-exp-line {
  width: 2px;
  flex: 1;
  background: #ccfbf1;
  margin-top: 4px;
}

.cv-exp-content {
  flex: 1;
  padding-bottom: 10px;
}

.cv-exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.cv-exp-position {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.cv-exp-badge {
  font-size: 8px;
  font-weight: 700;
  color: #ffffff;
  background: #0d9488;
  padding: 2px 7px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.cv-exp-company {
  font-size: 10px;
  font-weight: 600;
  color: #f97316;
  margin: 2px 0 0;
}

.cv-exp-desc {
  font-size: 10px;
  color: #475569;
  margin: 4px 0 0;
  line-height: 1.5;
}

/* ── Education ── */
.cv-edu-row {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}

.cv-edu-row:last-child {
  border-bottom: none;
}

.cv-edu-year {
  font-size: 9px;
  font-weight: 700;
  color: #0d9488;
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 1px;
  min-width: 80px;
}

.cv-edu-info {
  flex: 1;
}

.cv-edu-institution {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.cv-edu-degree-inline {
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  margin-left: 4px;
}

.cv-edu-degree {
  font-size: 10px;
  color: #64748b;
  margin: 1px 0 0;
}

/* ── Skills ── */
.cv-skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  color: #334155;
}

.cv-skill-pct {
  font-weight: 700;
  color: #0d9488;
}

.cv-skill-track {
  height: 5px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.cv-skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d9488, #f97316);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.cv-skill-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.cv-skill-badge {
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  background: #ffffff;
  color: #0d9488;
  border: 1px solid #99f6e4;
}

/* ── Certifications ── */
.cv-cert-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cv-cert-card {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 6px 8px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.cv-cert-date-badge {
  font-size: 8px;
  font-weight: 700;
  color: #ffffff;
  background: #f97316;
  padding: 2px 6px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.cv-cert-info {
  flex: 1;
  min-width: 0;
}

.cv-cert-name {
  font-size: 10px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.cv-cert-issuer {
  font-size: 9px;
  color: #64748b;
  margin: 1px 0 0;
}

/* ── Social ── */
.cv-social-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cv-social-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: #475569;
  transition: all 0.15s;
}

.cv-social-tile:hover {
  border-color: #0d9488;
  color: #0d9488;
  background: #f0fdfa;
}

/* ── QR Block ── */
.cv-qr-block {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.cv-qr-block :deep(canvas) {
  border-radius: 4px;
}

.cv-qr-label {
  font-size: 8px;
  color: #94a3b8;
  line-height: 1.3;
}

/* ── Languages ── */
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
  background: #fef3c7;
  border-radius: 6px;
  border: 1px solid #fcd34d;
}

.cv-lang-name {
  font-size: 10px;
  font-weight: 600;
  color: #1e293b;
}

.cv-lang-level {
  font-size: 9px;
  font-weight: 500;
  color: #92400e;
  padding: 1px 5px;
  background: #fffbeb;
  border-radius: 4px;
}

/* ── Print ── */
@media print {
  .cv-creative {
    max-width: 100%;
  }

  .cv-top-accent {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-col-right {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-skill-fill {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-exp-badge {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-cert-date-badge {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-exp-dot {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-title-icon {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
