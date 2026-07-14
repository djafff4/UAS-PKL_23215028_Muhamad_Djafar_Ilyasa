<template>
  <div class="a4-page" ref="letterRef">
    <!-- ═══ KOP SURAT / LETTERHEAD ═══ -->
    <header class="letterhead">
      <div class="letterhead-left">
        <img
          src="/assets/logo/logo_akman.png"
          alt="Logo"
          class="letterhead-logo"
          @error="onLogoError"
        />
      </div>
      <div class="letterhead-center">
        <h1 class="company-name">PT AGSYA KARYA MANCA</h1>
        <p class="company-brand">AKMAN ACADEMY</p>
        <p class="company-tagline">Pusat Pengembangan SDM dan Teknologi Pendidikan</p>
        <div class="company-address">
          <p>{{ company.profile.address }}</p>
          <p>Telp: {{ company.profile.phone }} | Email: {{ company.profile.email }}</p>
          <p>{{ company.profile.website || "www.akman.id" }}</p>
        </div>
      </div>
      <div class="letterhead-right">
        <div class="doc-badge">
          <span class="doc-badge-label">Nomor</span>
          <span class="doc-badge-value">{{ data.letter_number }}</span>
        </div>
      </div>
    </header>

    <!-- ═══ GARIS PEMISAH KOP SURAT ═══ -->
    <div class="letterhead-line"></div>

    <!-- ═══ JUDUL SURAT ═══ -->
    <div class="letter-title">
      <h2>SURAT KETERANGAN KERJA</h2>
      <p class="letter-number">Nomor: {{ data.letter_number }}</p>
    </div>

    <!-- ═══ ISI SURAT ═══ -->
    <div class="letter-body">
      <p class="opening">Yang bertanda tangan di bawah ini,</p>

      <div class="signatory">
        <table>
        <tbody>
          <tr>
            <td class="label">Nama</td>
            <td class="colon">:</td>
            <td>NURSALIM</td>
          </tr>
          <tr>
            <td class="label">Jabatan</td>
            <td class="colon">:</td>
            <td>Direktur Utama PT Agsya Karya Manca</td>
          </tr>
          </tbody>
        </table>
      </div>

      <p class="declaration">Dengan ini menerangkan bahwa:</p>

      <div class="employee-info">
        <table>
          <tbody>
            <tr>
              <td class="label">Nama</td>
              <td class="colon">:</td>
              <td class="value">{{ data.staff_name }}</td>
            </tr>
            <tr>
              <td class="label">Jabatan</td>
              <td class="colon">:</td>
              <td class="value">{{ data.position }}</td>
            </tr>
            <tr>
              <td class="label">Departemen</td>
              <td class="colon">:</td>
              <td class="value">{{ data.department }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="statement">
        Adalah benar <strong>karyawan aktif</strong> di PT Agsya Karya Manca (AKMAN
        Academy) sejak tanggal
        <strong>{{ formatDateIndonesian(data.start_date) }}</strong> sampai dengan saat
        ini.
      </p>

      <p class="conduct">
        Selama bekerja, yang bersangkutan telah menjalankan tugas dan tanggung jawabnya
        dengan baik dan berdisiplin sesuai ketentuan yang berlaku di perusahaan.
      </p>

      <p class="purpose">
        Surat keterangan ini dibuat untuk keperluan
        <strong>{{ data.purpose || "umum" }}</strong>
        dan tidak dapat dipergunakan untuk keperluan lain.
      </p>

      <p class="closing">
        Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan
        sebagaimana mestinya.
      </p>
    </div>

    <!-- ═══ TANDA TANGAN ═══ -->
    <div class="signature">
      <!-- Signature Tradisional -->
      <template v-if="!data.signature_type || data.signature_type === 'traditional'">
        <div class="sig-left">
          <p class="sig-place">Dibuat di Tegal</p>
          <p class="sig-date">
            pada tanggal {{ formatDateIndonesian(data.created_at || data.start_date) }}
          </p>
          <div class="sig-authority">
            <p class="sig-title">Pihak Pertama</p>
            <p class="sig-subtitle"><!-- materai --></p>
            <div class="sig-space"></div>
            <div class="sig-line"></div>
            <p class="sig-name">NURSALIM</p>
            <p class="sig-company">Direktur Utama</p>
            <p class="sig-company">PT Agsya Karya Manca</p>
          </div>
        </div>
        <div class="sig-right">
          <!-- stempel -->
        </div>
      </template>

      <!-- QR Code Verifikasi -->
      <template v-else-if="data.signature_type === 'qrcode'">
        <div class="sig-qr-only">
          <p class="sig-place">Dibuat dan ditandatangani secara digital</p>
          <p class="sig-date">
            pada tanggal {{ formatDateIndonesian(data.created_at || data.start_date) }}
          </p>
          <div class="qr-code">
            <QrcodeVue :value="verifyUrl" :size="120" level="M" />
          </div>
          <p class="qr-url">{{ verifyUrl }}</p>
          <p class="qr-text">Scan untuk verifikasi dokumen</p>
        </div>
      </template>
    </div>

    <!-- ═══ FOOTER ═══ -->
    <footer class="letter-footer">
      <div class="footer-line"></div>
      <div class="footer-content">
        <span>AKMAN Academy — {{ data.letter_number }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import QrcodeVue from "qrcode.vue";
import type { StaffWorkCertificate } from "@/types";
import { useCompanyStore } from "@/stores/company";

const props = defineProps<{ data: StaffWorkCertificate }>();
const company = useCompanyStore();

const verifyUrl = computed(() => {
  const base = "staff.akman.id/verify";
  return `${base}/${props.data.letter_number}`;
});

onMounted(() => {
  company.fetchProfile();
});

function formatDateIndonesian(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function onLogoError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
}
</script>

<style scoped>
/* ═══════════════════════════════════════════
   A4 PAGE SYSTEM - 210mm x 297mm (96 DPI)
   ═══════════════════════════════════════════ */
.a4-page {
  /* A4 dimensions: 210mm x 297mm */
  width: 794px;
  min-height: 1123px;
  max-height: 1123px;

  /* Margins: 2.5cm top/bottom, lebih lebar left/right */
  padding: 94px 60px;

  /* Page setup */
  box-sizing: border-box;
  position: relative;
  background: white;

  /* Typography */
  font-family: "Times New Roman", "Georgia", serif;
  font-size: 12pt;
  color: #000;
  line-height: 1.5;

  /* Print shadow */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* ═══════════════════════════════════════════
   LETTERHEAD / KOP SURAT
   ═══════════════════════════════════════════ */
.letterhead {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.letterhead-left {
  flex-shrink: 0;
  padding-top: 24px;
}

.letterhead-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.letterhead-center {
  flex: 1;
  text-align: center;
}

.company-name {
  font-size: 16pt;
  font-weight: 700;
  letter-spacing: 2px;
  color: #000;
  margin: 0;
  text-transform: uppercase;
}

.company-brand {
  font-size: 11pt;
  font-weight: 600;
  color: #1e40af;
  margin: 2px 0;
  letter-spacing: 1px;
}

.company-tagline {
  font-size: 9pt;
  font-weight: 400;
  color: #333;
  margin: 2px 0 8px;
  font-style: italic;
}

.company-address {
  font-size: 9pt;
  color: #333;
  line-height: 1.4;
}

.company-address p {
  margin: 0;
}

.letterhead-right {
  flex-shrink: 0;
}

.doc-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 6px 10px;
  border: 1px solid #000;
  font-size: 9pt;
}

.doc-badge-label {
  font-weight: 400;
  color: #333;
}

.doc-badge-value {
  font-weight: 700;
  color: #000;
}

/* ═══════════════════════════════════════════
   GARIS PEMISAH KOP SURAT
   ═══════════════════════════════════════════ */
.letterhead-line {
  height: 3px;
  background: linear-gradient(90deg, #000 0%, #000 45%, #1e40af 50%, #000 55%, #000 100%);
  margin-bottom: 20px;
}

/* ═══════════════════════════════════════════
   JUDUL SURAT
   ═══════════════════════════════════════════ */
.letter-title {
  text-align: center;
  margin-bottom: 24px;
}

.letter-title h2 {
  font-size: 14pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 4px;
  color: #000;
}

.letter-number {
  font-size: 11pt;
  font-weight: 400;
  margin: 0;
  color: #333;
}

/* ═══════════════════════════════════════════
   ISI SURAT / LETTER BODY
   ═══════════════════════════════════════════ */
.letter-body {
  text-align: justify;
  margin-bottom: 24px;
}

.letter-body p {
  margin: 0 0 12px;
  text-indent: 0;
}

.opening {
  margin-bottom: 16px !important;
}

.signatory {
  margin: 8px 0 16px;
  padding-left: 24px;
}

.signatory table {
  border-collapse: collapse;
}

.signatory td {
  font-size: 12pt;
  padding: 2px 0;
  vertical-align: top;
}

.declaration {
  margin-bottom: 16px !important;
}

.employee-info {
  margin: 8px 0 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-left: 4px solid #1e40af;
}

.employee-info table {
  border-collapse: collapse;
}

.employee-info td {
  font-size: 12pt;
  padding: 3px 0;
  vertical-align: top;
}

.label {
  width: 120px;
  font-weight: 600;
}

.colon {
  width: 12px;
  text-align: center;
}

.value {
  font-weight: 600;
  color: #1e40af;
}

.statement {
  margin-bottom: 12px !important;
}

.conduct {
  margin-bottom: 12px !important;
}

.purpose {
  margin-bottom: 16px !important;
  padding: 10px 12px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 4px;
  font-size: 11pt;
}

.closing {
  margin-top: 16px !important;
  font-style: italic;
}

/* ═══════════════════════════════════════════
   TANDA TANGAN
   ═══════════════════════════════════════════ */
.signature {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 32px;
  page-break-inside: avoid;
}

.sig-left {
  flex: 1;
}

.sig-place,
.sig-date {
  font-size: 12pt;
  margin: 0 0 4px;
}

.sig-date {
  margin-bottom: 24px;
}

.sig-authority {
  width: 200px;
}

.sig-title {
  font-size: 12pt;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 4px;
  text-align: center;
}

.sig-subtitle {
  font-size: 10pt;
  color: #666;
  margin: 0 0 8px;
  text-align: center;
}

.sig-space {
  height: 60px;
}

.sig-line {
  width: 100%;
  height: 1px;
  background: #000;
  margin: 0;
}

.sig-name {
  font-size: 12pt;
  font-weight: 600;
  margin: 8px 0 0;
  text-align: center;
}

.sig-company {
  font-size: 10pt;
  color: #666;
  margin: 2px 0 0;
  text-align: center;
}

.sig-right {
  flex-shrink: 0;
  text-align: center;
}

.sig-qr-only {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.sig-stamp {
  width: 80px;
  height: 80px;
  border: 2px dashed #ccc;
  border-radius: 50%;
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

.qr-url {
  font-size: 7pt;
  color: #666;
  margin: 0;
  word-break: break-all;
}

.qr-text {
  font-size: 8pt;
  color: #888;
  margin: 2px 0 0;
  font-style: italic;
}



/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
.letter-footer {
  margin-top: 48px;
}

.footer-line {
  height: 1px;
  background: #ccc;
  margin-bottom: 8px;
}

.footer-content {
  display: flex;
  justify-content: center;
  font-size: 8pt;
  color: #666;
}

/* ═══════════════════════════════════════════
   PRINT STYLES
   ═══════════════════════════════════════════ */
@media print {
  html,
  body {
    width: 794px;
    height: 1123px;
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
  }

  .a4-page {
    width: 794px;
    min-height: 1123px;
    max-height: 1123px;
    padding: 94px 60px;
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    overflow: hidden;
  }

  .letterhead-line {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .employee-info {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .purpose {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .signature {
    break-inside: avoid;
  }

  .letter-footer {
    position: fixed;
    bottom: 94px;
    left: 60px;
    right: 60px;
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE (untuk preview di layar)
   ═══════════════════════════════════════════ */
@media screen and (max-width: 800px) {
  .a4-page {
    width: 100%;
    min-height: auto;
    padding: 16px;
    overflow: auto;
  }
}
</style>
