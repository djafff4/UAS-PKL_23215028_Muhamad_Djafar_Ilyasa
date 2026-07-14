<template>
  <div ref="cvContent" class="cv-a4-page cv-akman">
    <div class="cv-header">
      <div class="cv-header-top">
        <div class="cv-logo">
          <img :src="company.profile.logo_url || '/assets/logo/logo_akman.png'" :alt="company.profile.name" class="cv-logo-img"
            @error="onLogoError" />
        </div>
        <div class="cv-header-text">
          <h1 class="cv-org-name">{{ company.profile.name }}</h1>
          <p class="cv-org-tagline">{{ company.profile.tagline }}</p>
          <p class="cv-org-address">{{ company.profile.address }}</p>
          <p class="cv-org-email">
            {{ company.profile.email }}
            <template v-if="company.profile.phone"> | {{ company.profile.phone }}</template>
          </p>
        </div>
      </div>
      <div class="cv-header-divider">
        <div class="cv-divider-line"></div>
        <div class="cv-divider-dot"></div>
        <div class="cv-divider-line"></div>
      </div>
    </div>

    <div class="cv-title-section">
      <h2 class="cv-title">CURRICULUM VITAE</h2>
      <p v-if="cv.position || cv.department" class="cv-subtitle">
        <template v-if="cv.position">{{ cv.position }}</template>
        <template v-if="cv.position && cv.department"> — </template>
        <template v-if="cv.department">{{ cv.department }}</template>
      </p>
    </div>

    <div class="cv-profile-row">
      <div class="cv-avatar-section">
        <div class="cv-avatar">
          <span>{{ initials }}</span>
        </div>
        <div class="cv-contact">
          <p class="cv-name">{{ cv.full_name || 'Nama Lengkap' }}</p>
          <p class="cv-contact-item">{{ cv.email }}</p>
          <p class="cv-contact-item">{{ cv.phone }}</p>
        </div>
      </div>
      <div v-if="cv.summary" class="cv-summary">
        <h3 class="cv-section-label-small">PROFIL SINGKAT</h3>
        <p class="cv-summary-text">{{ cv.summary }}</p>
      </div>
    </div>

    <div v-if="cv.education.length > 0" class="cv-section">
      <h3 class="cv-section-title">PENDIDIKAN</h3>
      <div v-for="edu in cv.education" :key="edu.id" class="cv-entry">
        <div class="cv-entry-left">
          <p class="cv-entry-year">{{ edu.start_year }} — {{ edu.end_year || 'Sekarang' }}</p>
        </div>
        <div class="cv-entry-right">
          <p class="cv-entry-title">{{ edu.institution }}</p>
          <p class="cv-entry-sub">{{ edu.degree }} — {{ edu.field_of_study }}</p>
        </div>
      </div>
    </div>

    <div v-if="cv.experience.length > 0" class="cv-section">
      <h3 class="cv-section-title">PENGALAMAN KERJA</h3>
      <div v-for="exp in cv.experience" :key="exp.id" class="cv-entry">
        <div class="cv-entry-left">
          <p class="cv-entry-year">{{ exp.start_date }} — {{ exp.current ? 'Sekarang' : exp.end_date }}</p>
        </div>
        <div class="cv-entry-right">
          <p class="cv-entry-title">{{ exp.position }}</p>
          <p class="cv-entry-sub">{{ exp.company }}{{ exp.location ? `, ${exp.location}` : '' }}</p>
          <p v-if="exp.description" class="cv-entry-detail">{{ exp.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="cv.skills.length > 0" class="cv-section">
      <h3 class="cv-section-title">KEAHLIAN</h3>
      <div class="cv-skills">
        <span v-for="skill in cv.skills" :key="skill" class="cv-skill-badge">{{ skill }}</span>
      </div>
    </div>

    <div v-if="cv.certifications.length > 0" class="cv-section">
      <h3 class="cv-section-title">SERTIFIKASI</h3>
      <div class="cv-cert-grid">
        <div v-for="cert in cv.certifications" :key="cert.id" class="cv-cert-item">
          <p class="cv-cert-year">{{ cert.date }}</p>
          <p class="cv-cert-name">{{ cert.name }}</p>
          <p class="cv-cert-issuer">{{ cert.issuer }}</p>
        </div>
      </div>
    </div>

    <div v-if="cv.languages && cv.languages.length > 0" class="cv-section">
      <h3 class="cv-section-title">BAHASA</h3>
      <div class="cv-languages">
        <div v-for="lang in cv.languages" :key="lang.id" class="cv-lang-item">
          <span class="cv-lang-name">{{ lang.name }}</span>
          <span class="cv-lang-level">{{ lang.level === 'dasar' ? 'Dasar' : lang.level === 'menengah' ? 'Menengah' : 'Lancar' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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

function onLogoError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

defineExpose({ cvContent })
</script>

<style scoped>
.cv-akman {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: white;
  color: #1e293b;
  width: 794px;
  min-height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 32px 40px 28px;
  line-height: 1.4;
  box-sizing: border-box;
  overflow: hidden;
}

.cv-header {
  margin-bottom: 16px;
}

.cv-header-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cv-logo {
  flex-shrink: 0;
}

.cv-logo-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 8px;
}

.cv-header-text {
  flex: 1;
}

.cv-org-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.cv-org-tagline {
  font-size: 10px;
  font-weight: 500;
  color: #6366f1;
  margin: 2px 0;
  letter-spacing: 0.5px;
}

.cv-org-address,
.cv-org-email {
  font-size: 9px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.cv-header-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.cv-divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
}

.cv-divider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
}

.cv-title-section {
  text-align: center;
  margin-bottom: 16px;
}

.cv-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 4px;
  color: #1e293b;
  margin: 0;
}

.cv-subtitle {
  font-size: 10px;
  font-weight: 500;
  color: #6366f1;
  margin: 4px 0 0 0;
  letter-spacing: 1px;
}

.cv-profile-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.cv-avatar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.cv-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.cv-contact {
  min-width: 0;
}

.cv-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.cv-contact-item {
  font-size: 10px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.cv-summary {
  flex: 1;
  border-left: 2px solid #6366f1;
  padding-left: 12px;
}

.cv-section-label-small {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #6366f1;
  margin: 0 0 4px 0;
}

.cv-summary-text {
  font-size: 10px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.cv-section {
  margin-bottom: 14px;
}

.cv-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #6366f1;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 4px;
  margin: 0 0 8px 0;
}

.cv-entry {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.cv-entry-left {
  width: 100px;
  flex-shrink: 0;
}

.cv-entry-year {
  font-size: 10px;
  font-weight: 600;
  color: #6366f1;
  margin: 0;
}

.cv-entry-right {
  flex: 1;
}

.cv-entry-title {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.cv-entry-sub {
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 2px 0;
}

.cv-entry-detail {
  font-size: 9px;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}

.cv-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cv-skill-badge {
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 600;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
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
  gap: 8px;
}

.cv-lang-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
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
  padding: 1px 6px;
  background: #eef2ff;
  border-radius: 4px;
}

@media print {
  .cv-akman {
    padding: 20px 32px;
    max-width: 100%;
  }
  .cv-header-top {
    break-inside: avoid;
  }
}
</style>
