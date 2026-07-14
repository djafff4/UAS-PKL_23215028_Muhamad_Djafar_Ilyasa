<template>
  <div class="letter-container" ref="letterRef">
    <!-- Watermark -->
    <div class="watermark">AKMAN ACADEMY CONFIDENTIAL</div>

    <!-- PAGE 1 -->
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
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- Document Title -->
      <h2 class="doc-title">SURAT KETERANGAN KERJA</h2>
      <p class="doc-subtitle">(Paklaring / Surat Pengalaman Kerja)</p>
      <p class="doc-number">Nomor: {{ data.letter_number }}</p>

      <!-- Body -->
      <div class="letter-body">
        <p>Yang bertanda tangan di bawah ini:</p>

        <div class="identity-block">
          <table class="identity-table">
            <tbody>
              <tr><td class="id-label">Nama Perusahaan</td><td>: PT Agsya Karya Manca</td></tr>
              <tr><td class="id-label">Alamat</td><td>: {{ company.profile.address }}</td></tr>
              <tr><td class="id-label">Diwakili oleh</td><td>: NURSALIM</td></tr>
            </tbody>
          </table>
        </div>

        <p>Dengan ini menerangkan bahwa:</p>

        <div class="identity-block">
          <table class="identity-table">
            <tbody>
              <tr><td class="id-label">Nama</td><td>: {{ data.staff_name }}</td></tr>
              <tr><td class="id-label">Jabatan Terakhir</td><td>: {{ data.position }}</td></tr>
              <tr><td class="id-label">Departemen</td><td>: {{ data.department }}</td></tr>
              <tr><td class="id-label">Masa Kerja</td><td>: {{ formatDateIndonesian(data.start_date) }} s/d {{ formatDateIndonesian(data.end_date) }}</td></tr>
            </tbody>
          </table>
        </div>

        <p class="declaration">
          Yang bersangkutan adalah benar <strong>mantan karyawan</strong> di PT Agsya Karya Manca dengan masa kerja seperti tersebut di atas.
        </p>

        <!-- Summary Box -->
        <div class="summary-box">
          <h3 class="summary-title">RIWAYAT KERJA</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Tanggal Mulai</span>
              <span class="summary-value">{{ formatDateIndonesian(data.start_date) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Tanggal Berakhir</span>
              <span class="summary-value">{{ formatDateIndonesian(data.end_date) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Jabatan Terakhir</span>
              <span class="summary-value">{{ data.position }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Departemen</span>
              <span class="summary-value">{{ data.department }}</span>
            </div>
          </div>
        </div>

        <!-- Reason -->
        <div v-if="terminationReasonText" class="reason-box">
          <p class="reason-label">Alasan Berakhirnya Masa Kerja:</p>
          <p class="reason-value">{{ terminationReasonText }}</p>
        </div>

        <!-- HR Appreciation -->
        <div class="appreciation-box">
          <p class="appreciation-title">APRESIASI</p>
          <p class="appreciation-text">
            Terima kasih atas dedikasi dan kontribusi yang diberikan selama ini. Semoga pengalaman kerja yang telah diperoleh dapat menjadi bekal yang bermanfaat bagi yang bersangkutan di masa mendatang.
          </p>
        </div>

        <p>Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.</p>
      </div>

      <!-- Signature -->
      <div class="signature-section">
        <div class="sig-content">
          <!-- Signature Tradisional -->
          <template v-if="!data.signature_type || data.signature_type === 'traditional'">
            <div class="sig-left">
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.end_date) }}</p>
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
                  <p class="sig-party">MANTAN KARYAWAN</p>
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
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.end_date) }}</p>
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
        <span>Halaman 1 dari 1</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { StaffTerminationLetter } from '@/types'
import { useCompanyStore } from '@/stores/company'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{ data: StaffTerminationLetter }>()
const company = useCompanyStore()

const verifyUrl = computed(() => {
  const base = 'staff.akman.id/verify'
  return `${base}/${props.data.letter_number}`
})

const terminationReasonText = computed(() => {
  const reasons: Record<string, string> = {
    'KONTRAK_BERAKHIR': 'Berakhirnya masa kontrak (PKWT)',
    'PENGUNDURAN_DIRI': 'Pengunduran diri secara baik-baik',
    'PHK': 'Pemutusan Hubungan Kerja',
    'LAINNYA': props.data.reason || 'Lainnya',
  }
  return reasons[props.data.termination_type] || props.data.reason || ''
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

.page:not(:last-child) {
  page-break-after: always;
  break-after: page;
}

.page:last-child {
  page-break-after: auto;
  break-after: auto;
  margin-bottom: 0;
}

.last-page {
  display: flex;
  flex-direction: column;
}

.last-page .signature-section {
  margin-top: auto;
  padding-top: 0;
  margin-bottom: 80px;
}

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

.doc-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.doc-subtitle {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 8px;
  font-style: italic;
}

.doc-number {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 28px;
  letter-spacing: 0.5px;
}

.letter-body {
  font-size: 12px;
  line-height: 1.8;
  color: #334155;
}

.letter-body p {
  margin: 0 0 12px;
}

.identity-block {
  margin: 16px 0;
}

.identity-table {
  width: 100%;
  border-collapse: collapse;
}

.identity-table td {
  font-size: 12px;
  padding: 3px 0;
  vertical-align: top;
}

.id-label {
  width: 180px;
  font-weight: 600;
}

.declaration {
  margin: 16px 0 12px;
  text-align: justify;
}

.summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
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

.reason-box {
  margin: 16px 0;
  padding: 12px 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
}

.reason-label {
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.reason-value {
  font-size: 12px;
  color: #78350f;
  margin: 0;
}

.appreciation-box {
  margin: 16px 0;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.appreciation-title {
  font-size: 11px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.appreciation-text {
  font-size: 12px;
  color: #334155;
  margin: 0;
  line-height: 1.8;
  text-align: justify;
}

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
}
</style>
