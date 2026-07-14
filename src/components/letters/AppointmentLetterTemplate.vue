<template>
  <div class="letter-container" ref="letterRef">
    <!-- Watermark -->
    <div class="watermark">AKMAN ACADEMY CONFIDENTIAL</div>

    <!-- PAGE 1: COVER -->
    <div class="page cover-page">
      <div class="cover-logo">
        <img src="/assets/logo/logo_akman.png" alt="Logo" class="cover-logo-img" @error="onLogoError" />
      </div>
      
      <h1 class="cover-company">PT AGSYA KARYA MANCA</h1>
      <p class="cover-brand">AKMAN ACADEMY</p>
      <p class="cover-tagline">Pusat Pengembangan SDM dan Teknologi Pendidikan</p>
      
      <div class="cover-divider"></div>
      
      <h2 class="cover-title">SURAT PENUNJUKAN</h2>
      <p class="cover-type">({{ data.appointment_type }})</p>
      
      <div class="cover-divider"></div>
      
      <div class="cover-meta">
        <div class="meta-row">
          <span class="meta-label">Nomor Dokumen</span>
          <span class="meta-value">: {{ data.letter_number }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Versi</span>
          <span class="meta-value">: 1.0</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Status</span>
          <span class="meta-value">: {{ data.status || 'DRAFT' }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Tahun</span>
          <span class="meta-value">: {{ new Date().getFullYear() }}</span>
        </div>
      </div>
      
      <div class="cover-footer">
        <p>Dokumen Bersifat Internal</p>
        <p>Tidak Untuk Diperbanyak Tanpa Izin</p>
      </div>
    </div>

    <!-- PAGE 2: CONTENT -->
    <div class="page content-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <img src="/assets/logo/logo_akman.png" alt="Logo" class="header-logo" @error="onLogoError" />
          <div class="header-info">
            <p class="header-company">PT AGSYA KARYA MANCA</p>
            <p class="header-brand">AKMAN ACADEMY</p>
            <p class="header-tagline">Pusat Pengembangan SDM dan Teknologi Pendidikan</p>
            <p class="header-address">{{ company.profile.address }}</p>
            <p class="header-contact">Telp: {{ company.profile.phone }} | Email: {{ company.profile.email }} | {{ company.profile.website || 'www.akman.id' }}</p>
          </div>
        </div>
        <div class="header-right">
          <table class="doc-info">
            <tbody>
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.letter_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- Document Title -->
      <h2 class="doc-title">SURAT PENUNJUKAN</h2>
      <p class="doc-number">Nomor: {{ data.letter_number }}</p>

      <!-- Identity Table -->
      <table class="identity-table">
        <tbody>
          <tr><td class="id-label">PIHAK PERTAMA</td><td></td></tr>
          <tr><td class="id-label">Nama Perusahaan</td><td>: PT Agsya Karya Manca</td></tr>
          <tr><td class="id-label">Alamat</td><td>: {{ company.profile.address }}</td></tr>
          <tr><td class="id-label">Diwakili oleh</td><td>: NURSALIM</td></tr>
          <tr><td colspan="2" class="id-separator"></td></tr>
          <tr><td class="id-label">PIHAK KEDUA</td><td></td></tr>
          <tr><td class="id-label">Nama</td><td>: {{ data.staff_name }}</td></tr>
          <tr><td class="id-label">Jabatan</td><td>: {{ data.position }}</td></tr>
          <tr><td class="id-label">Departemen</td><td>: {{ data.department }}</td></tr>
        </tbody>
      </table>

      <!-- Summary Box -->
      <div class="summary-box">
        <h3 class="summary-title">INFORMASI PENUNJUKAN</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Jenis Penunjukan</span>
            <span class="summary-value">{{ data.appointment_type }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Jabatan</span>
            <span class="summary-value">{{ data.position }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Departemen</span>
            <span class="summary-value">{{ data.department }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Berlaku Sejak</span>
            <span class="summary-value">{{ formatDateIndonesian(data.effective_date) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Berlaku Hingga</span>
            <span class="summary-value">{{ data.end_date ? formatDateIndonesian(data.end_date) : 'Ditentukan lebih lanjut' }}</span>
          </div>
          <div v-if="data.reports_to" class="summary-item">
            <span class="summary-label">Atasan Langsung</span>
            <span class="summary-value">{{ data.reports_to }}</span>
          </div>
        </div>
      </div>

      <!-- Articles 1-3 -->
      <div class="article">
        <h3 class="article-title">PASAL 1<br />DASAR PENUNJUKAN</h3>
        <div class="article-content">
          <p>1.1 Pihak Pertama dengan ini menunjuk Pihak Kedua untuk menjalankan tugas sebagai {{ data.appointment_type }}.</p>
          <p>1.2 Penunjukan ini didasarkan pada kebutuhan perusahaan dan kompetensi Pihak Kedua.</p>
        </div>
      </div>

      <div class="article">
        <h3 class="article-title">PASAL 2<br />MASA BERLAKU</h3>
        <div class="article-content">
          <p>2.1 Surat penunjukan ini berlaku mulai tanggal {{ formatDateIndonesian(data.effective_date) }}.</p>
          <p v-if="data.end_date">2.2 Surat penunjukan ini berakhir pada tanggal {{ formatDateIndonesian(data.end_date) }}.</p>
          <p v-else>2.2 Surat penunjukan ini berlaku untuk jangka waktu yang tidak ditentukan.</p>
          <p>2.3 Penunjukan ini dapat dicabut atau diubah sewaktu-waktu oleh perusahaan.</p>
        </div>
      </div>

      <div class="article">
        <h3 class="article-title">PASAL 3<br />TUGAS DAN TANGGUNG JAWAB</h3>
        <div class="article-content">
          <p>3.1 Pihak Kedua bertanggung jawab untuk melaksanakan tugas sebagai {{ data.position }} di Departemen {{ data.department }}.</p>
          <p v-if="data.reports_to">3.2 Pihak Kedua melapor langsung kepada {{ data.reports_to }}.</p>
          <p v-else>3.2 Pihak Kedua melapor langsung kepada atasan yang ditunjuk oleh perusahaan.</p>
          <p>3.3 Pihak Kedua wajib menjalankan tugas dengan penuh tanggung jawab dan sesuai dengan kebijakan perusahaan.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer">
        <span>Dokumen Internal AKMAN Academy</span>
        <span>{{ data.letter_number }}</span>
        <span>Halaman 2 dari 3</span>
      </div>
    </div>

    <!-- PAGE 3: CONTINUATION -->
    <div class="page content-page last-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <img src="/assets/logo/logo_akman.png" alt="Logo" class="header-logo" @error="onLogoError" />
          <div class="header-info">
            <p class="header-company">PT AGSYA KARYA MANCA</p>
            <p class="header-brand">AKMAN ACADEMY</p>
            <p class="header-tagline">Pusat Pengembangan SDM dan Teknologi Pendidikan</p>
            <p class="header-address">{{ company.profile.address }}</p>
            <p class="header-contact">Telp: {{ company.profile.phone }} | Email: {{ company.profile.email }} | {{ company.profile.website || 'www.akman.id' }}</p>
          </div>
        </div>
        <div class="header-right">
          <table class="doc-info">
            <tbody>
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.letter_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- Articles 4-5 -->
      <div class="article">
        <h3 class="article-title">PASAL 4<br />HAK DAN KEWAJIBAN</h3>
        <div class="article-content">
          <p>4.1 Pihak Kedua berkewajiban untuk:</p>
          <p class="sub-item">a. Melaksanakan tugas dengan penuh tanggung jawab</p>
          <p class="sub-item">b. Mematuhi peraturan perusahaan</p>
          <p class="sub-item">c. Menjaga kerahasiaan informasi perusahaan</p>
          <p>4.2 Pihak Pertama berkewajiban untuk:</p>
          <p class="sub-item">a. Memberikan hak-hak karyawan sesuai ketentuan</p>
          <p class="sub-item">b. Menyediakan lingkungan kerja yang aman</p>
        </div>
      </div>

      <div v-if="data.notes" class="article">
        <h3 class="article-title">PASAL 5<br />CATATAN TAMBAHAN</h3>
        <div class="article-content">
          <p>{{ data.notes }}</p>
        </div>
      </div>

      <div class="article">
        <h3 class="article-title">PASAL {{ data.notes ? '6' : '5' }}<br />PENUTUP</h3>
        <div class="article-content">
          <p>{{ data.notes ? '6.1' : '5.1' }} Surat penunjukan ini dibuat dalam 2 (dua) rangkap, masing-masing untuk Pihak Pertama dan Pihak Kedua.</p>
          <p>{{ data.notes ? '6.2' : '5.2' }} Hal-hal yang belum diatur dalam surat penunjukan ini akan diatur kemudian berdasarkan kesepakatan bersama.</p>
        </div>
      </div>

      <!-- Signature (pushed to bottom) -->
      <div class="signature-section">
        <div class="sig-content">
          <!-- Signature Tradisional -->
          <template v-if="!data.signature_type || data.signature_type === 'traditional'">
            <div class="sig-left">
              <p class="sig-place">Dibuat dan ditandatangani di:</p>
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.effective_date) }}</p>
              <div class="sig-columns">
                <div class="sig-col">
                  <p class="sig-party">PIHAK PERTAMA</p>
                  <p class="sig-materai">&nbsp;</p>
                  <div class="sig-space"></div>
                  <div class="sig-line"></div>
                  <p class="sig-name">NURSALIM</p>
                  <p class="sig-company">Direktur Utama</p>
                  <p class="sig-company">PT Agsya Karya Manca</p>
                </div>
                <div class="sig-col">
                  <p class="sig-party">PIHAK KEDUA</p>
                  <p class="sig-materai">&nbsp;</p>
                  <div class="sig-space"></div>
                  <div class="sig-line"></div>
                  <p class="sig-name">{{ data.staff_name }}</p>
                  <p class="sig-company">{{ data.position }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- QR Code Verifikasi -->
          <template v-else-if="data.signature_type === 'qrcode'">
            <div class="sig-qr-only">
              <p class="sig-place">Dibuat dan ditandatangani secara digital</p>
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.effective_date) }}</p>
              <div class="qr-code">
                <QrcodeVue :value="verifyUrl" :size="120" level="M" />
              </div>
              <p class="qr-url">{{ verifyUrl }}</p>
              <p class="qr-text">Scan untuk verifikasi dokumen</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer">
        <span>Dokumen Internal AKMAN Academy</span>
        <span>{{ data.letter_number }}</span>
        <span>Halaman 3 dari 3</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { StaffAppointmentLetter } from '@/types'
import { useCompanyStore } from '@/stores/company'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{ data: StaffAppointmentLetter }>()
const company = useCompanyStore()

const verifyUrl = computed(() => {
  const base = 'staff.akman.id/verify'
  return `${base}/${props.data.letter_number}`
})

onMounted(() => {
  company.fetchProfile()
})

function formatDateIndonesian(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function onLogoError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
/* ===== PAGE SYSTEM ===== */
.letter-container {
  width: 794px;
  margin: 0 auto;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: #1e293b;
  line-height: 1.6;
}

.page {
  width: 794px;
  min-height: 1123px;
  max-height: 1123px;
  padding: 48px 56px;
  box-sizing: border-box;
  position: relative;
  background: white;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

/* Only break after non-last pages */
.page:not(:last-child) {
  page-break-after: always;
  break-after: page;
}

.page:last-child {
  page-break-after: auto;
  break-after: auto;
  margin-bottom: 0;
}

/* ===== LAST PAGE (flexbox for signature) ===== */
.last-page {
  display: flex;
  flex-direction: column;
}

.last-page .signature-section {
  margin-top: auto;
  padding-top: 0;
  margin-bottom: 80px;
}

/* ===== WATERMARK ===== */
.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 72px;
  font-weight: 900;
  color: rgba(30, 64, 175, 0.03);
  letter-spacing: 20px;
  text-transform: uppercase;
  pointer-events: none;
  white-space: nowrap;
  z-index: 1;
}

/* ===== COVER PAGE ===== */
.cover-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 60px;
}

.cover-logo {
  margin-bottom: 32px;
}

.cover-logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.cover-company {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 3px;
  color: #1e293b;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.cover-brand {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 4px;
  letter-spacing: 2px;
}

.cover-tagline {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin: 4px 0 0;
  text-align: center;
}

.cover-divider {
  width: 200px;
  height: 2px;
  background: #3b82f6;
  margin: 16px 0;
}

.cover-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin: 16px 0 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cover-type {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 24px;
}

.cover-meta {
  margin: 24px 0;
  text-align: left;
  width: 300px;
}

.meta-row {
  display: flex;
  gap: 8px;
  margin: 6px 0;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  width: 120px;
}

.meta-value {
  font-size: 12px;
  color: #1e293b;
}

.cover-footer {
  position: absolute;
  bottom: 80px;
  text-align: center;
}

.cover-footer p {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  margin: 4px 0;
  letter-spacing: 0.5px;
  text-align: center;
}

/* ===== PAGE HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.header-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-company {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.header-brand {
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
  margin: 2px 0;
}

.header-tagline {
  font-size: 9px;
  font-weight: 500;
  color: #64748b;
  margin: 2px 0 0;
  letter-spacing: 0.3px;
}

.header-address {
  font-size: 9px;
  color: #64748b;
  margin: 1px 0 0;
  line-height: 1.3;
}

.header-contact {
  font-size: 8px;
  color: #94a3b8;
  margin: 1px 0 0;
  line-height: 1.3;
}

.header-right {
  text-align: right;
}

.doc-info {
  border-collapse: collapse;
}

.doc-info td {
  font-size: 10px;
  color: #64748b;
  padding: 1px 0;
}

.doc-label {
  font-weight: 600;
  color: #1e293b;
  padding-right: 8px;
}

.header-divider {
  height: 2px;
  background: #3b82f6;
  margin: 12px 0 28px;
}

/* ===== PAGE FOOTER ===== */
.page-footer {
  position: absolute;
  bottom: 24px;
  left: 72px;
  right: 72px;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
}

/* ===== DOCUMENT TITLE ===== */
.doc-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.doc-number {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 28px;
  letter-spacing: 0.5px;
}

/* ===== IDENTITY TABLE ===== */
.identity-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.identity-table td {
  font-size: 12px;
  padding: 4px 0;
  vertical-align: top;
}

.id-label {
  width: 140px;
  font-weight: 600;
}

.id-separator {
  height: 16px;
}

/* ===== SUMMARY BOX ===== */
.summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0 16px;
}

.summary-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-label {
  font-size: 9px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

/* ===== ARTICLES ===== */
.article {
  margin-bottom: 16px;
}

.article-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e40af;
  margin: 24px 0 12px;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  line-height: 1.6;
  padding-bottom: 8px;
  border-bottom: 1px solid #dbeafe;
}

.article-content {
  font-size: 12px;
  color: #334155;
  line-height: 1.7;
}

.article-content p {
  margin: 0 0 6px;
}

.sub-item {
  padding-left: 24px;
  margin: 2px 0 !important;
}

/* ===== SIGNATURE SECTION ===== */
.signature-section {
  margin-top: 32px;
  page-break-inside: avoid;
}

.sig-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.sig-left {
  flex: 1;
}

.sig-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sig-qr-only {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.qr-code {
  width: 100px;
  height: 100px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 4px;
}

.qr-url {
  font-size: 9px;
  font-weight: 600;
  color: #3b82f6;
  margin: 4px 0 0;
  text-align: center;
}

.qr-text {
  font-size: 8px;
  color: #94a3b8;
  margin: 2px 0 0;
  text-align: center;
}

.sig-place {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 4px;
}

.sig-location {
  font-size: 12px;
  margin: 0 0 24px;
}

.sig-columns {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.sig-col {
  flex: 1;
  text-align: center;
}

.sig-party {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.sig-materai {
  font-size: 10px;
  color: #64748b;
  margin: 0 0 8px;
}

.sig-space {
  height: 64px;
}

.sig-line {
  width: 160px;
  height: 1px;
  background: #1e293b;
  margin: 0 auto;
}

.sig-name {
  font-size: 12px;
  font-weight: 600;
  margin: 8px 0 0;
}

.sig-company {
  font-size: 11px;
  color: #64748b;
  margin: 2px 0 0;
}

/* ===== PRINT STYLES ===== */
@media print {
  .page {
    margin-bottom: 0;
    box-shadow: none;
    border-radius: 0;
    min-height: 100vh;
  }

  .page:not(:last-child) {
    page-break-after: always;
    break-after: page;
  }

  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .watermark {
    display: none;
  }

  .page-footer {
    position: fixed;
    bottom: 0;
  }

  .signature-section {
    break-inside: avoid;
  }

  .article {
    break-inside: avoid;
  }

  .summary-box {
    break-inside: avoid;
  }
}
</style>
