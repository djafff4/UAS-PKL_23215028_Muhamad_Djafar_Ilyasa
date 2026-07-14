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
      
      <h2 class="cover-title">SURAT PERJANJIAN KERJA</h2>
      <p class="cover-type">({{ data.contract_type }})</p>
      
      <div class="cover-divider"></div>
      
      <div class="cover-meta">
        <div class="meta-row">
          <span class="meta-label">Nomor Dokumen</span>
          <span class="meta-value">: {{ data.contract_number }}</span>
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

    <!-- PAGE 2: CONTENT - PASAL 1-3 -->
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
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.contract_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- Document Title -->
      <h2 class="doc-title">SURAT PERJANJIAN KERJA</h2>
      <p class="doc-number">Nomor: {{ data.contract_number }}</p>

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
        <h3 class="summary-title">INFORMASI KONTRAK</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Jenis Kontrak</span>
            <span class="summary-value">{{ data.contract_type }}</span>
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
            <span class="summary-label">Masa Kerja</span>
            <span class="summary-value">{{ formatDateIndonesian(data.start_date) }} s/d {{ data.end_date ? formatDateIndonesian(data.end_date) : 'Berkala' }}</span>
          </div>
          <div v-if="data.salary" class="summary-item">
            <span class="summary-label">Total Upah</span>
            <span class="summary-value">Rp {{ formatCurrency(data.salary) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Status</span>
            <span class="summary-value">{{ data.status || 'DRAFT' }}</span>
          </div>
        </div>
      </div>

      <!-- PASAL 1: RUANG LINGKUP PEKERJAAN -->
      <div class="article">
        <h3 class="article-title">PASAL 1<br>RUANG LINGKUP PEKERJAAN</h3>
        <div class="article-content">
          <p>1.1 Pihak Kedua dipekerjakan oleh Pihak Pertama sebagai {{ data.position }} di Departemen {{ data.department }}.</p>
          <p>1.2 Pihak Kedua bertanggung jawab untuk melaksanakan tugas dan tanggung jawab yang melekat pada jabatan tersebut sesuai dengan job description yang ditetapkan perusahaan.</p>
          <p>1.3 Pihak Kedua bersedia ditempatkan di seluruh wilayah kerja PT Agsya Karya Manca sesuai kebutuhan perusahaan.</p>
        </div>
      </div>

      <!-- PASAL 2: MASA KERJA -->
      <div class="article">
        <h3 class="article-title">PASAL 2<br>MASA KERJA</h3>
        <div class="article-content">
          <p>2.1 Perjanjian kerja ini berlaku mulai tanggal {{ formatDateIndonesian(data.start_date) }}.</p>
          <p v-if="data.end_date">2.2 Perjanjian kerja ini berakhir pada tanggal {{ formatDateIndonesian(data.end_date) }} tanpa perlu peringatan atau pemberitahuan terlebih dahulu.</p>
          <p v-else>2.2 Perjanjian kerja ini berlaku untuk jangka waktu yang tidak ditentukan (PKWTT).</p>
          <p>2.3 Apabila berakhirnya perjanjian kerja jatuh pada hari libur, maka berakhirnya perjanjian kerja adalah pada hari kerja terakhir sebelum hari libur tersebut.</p>
        </div>
      </div>

      <!-- PASAL 3: UPAH DAN TUNJANGAN -->
      <div class="article">
        <h3 class="article-title">PASAL 3<br>UPAH DAN TUNJANGAN</h3>
        <div class="article-content">
          <p>3.1 Pihak Pertama memberikan upah kepada Pihak Kedua dengan rincian sebagai berikut:</p>
          <table class="salary-table">
            <tbody>
              <tr><td class="salary-label">Gaji Pokok</td><td>: Rp {{ data.salary ? formatCurrency(data.salary) : '..............' }}</td></tr>
              <tr><td class="salary-label">Tunjangan Tetap</td><td>: Rp ..............</td></tr>
              <tr><td class="salary-label">Tunjangan Tidak Tetap</td><td>: Rp ..............</td></tr>
              <tr><td class="salary-label">Total Upah</td><td>: Rp {{ data.salary ? formatCurrency(data.salary) : '..............' }}</td></tr>
            </tbody>
          </table>
          <p>3.2 Pembayaran upah dilakukan setiap tanggal ........ setiap bulan melalui transfer bank ke rekening Pihak Kedua.</p>
          <p>3.3 Pihak Pertama dapat memberikan insentif dan/atau bonus berdasarkan kinerja dan pencapaian target sesuai kebijakan perusahaan.</p>
          <p>3.4 Pemotongan upah hanya dilakukan sesuai ketentuan peraturan perundang-undangan yang berlaku (PPh 21, BPJS Kesehatan, BPJS Ketenagakerjaan).</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer">
        <span>Dokumen Internal AKMAN Academy</span>
        <span>{{ data.contract_number }}</span>
        <span>Halaman 2 dari 5</span>
      </div>
    </div>

    <!-- PAGE 3: PASAL 4-7 -->
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
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.contract_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- PASAL 4: WAKTU KERJA -->
      <div class="article">
        <h3 class="article-title">PASAL 4<br>WAKTU KERJA</h3>
        <div class="article-content">
          <p>4.1 Jam kerja mengikuti ketentuan perusahaan yaitu 8 (delapan) jam sehari dan 40 (empat puluh) jam seminggu.</p>
          <p>4.2 Karyawan dapat bekerja secara onsite, hybrid, atau remote sesuai kebutuhan operasional dan kebijakan perusahaan.</p>
          <p>4.3 Lembur dilaksanakan sesuai ketentuan peraturan perundang-undangan dan kebijakan perusahaan dengan kompensasi yang diatur tersendiri.</p>
          <p>4.4 Hari kerja dan hari libur mengikuti kalender perusahaan dan ketentuan peraturan perundang-undangan.</p>
        </div>
      </div>

      <!-- PASAL 5: HAK DAN KEWAJIBAN -->
      <div class="article">
        <h3 class="article-title">PASAL 5<br>HAK DAN KEWAJIBAN</h3>
        <div class="article-content">
          <p><strong>A. Hak Pihak Kedua:</strong></p>
          <p>5.1 Menerima upah sesuai kesepakatan.</p>
          <p>5.2 Mendapatkan jaminan sosial (BPJS Kesehatan dan BPJS Ketenagakerjaan).</p>
          <p>5.3 Mendapatkan cuti sesuai ketentuan peraturan perundang-undangan.</p>
          <p>5.4 Mendapatkan pelatihan dan pengembangan sesuai kebutuhan.</p>

          <p><strong>B. Kewajiban Pihak Kedua:</strong></p>
          <p>5.5 Melaksanakan tugas dengan penuh tanggung jawab.</p>
          <p>5.6 Mematuhi peraturan perusahaan, SOP, kode etik, dan kebijakan perusahaan.</p>
          <p>5.7 Menjaga kerahasiaan informasi perusahaan.</p>
          <p>5.8 Menjaga nama baik perusahaan.</p>
          <p>5.9 Melaporkan setiap pelanggaran yang diketahui.</p>

          <p><strong>C. Kewajiban Pihak Pertama:</strong></p>
          <p>5.10 Membayar upah tepat waktu.</p>
          <p>5.11 Mendaftarkan Pihak Kedua ke program jaminan sosial.</p>
          <p>5.12 Menyediakan lingkungan kerja yang aman dan sehat.</p>
          <p>5.13 Memberikan hak cuti sesuai ketentuan.</p>
        </div>
      </div>

      <!-- PASAL 6: CUTI DAN ISTIRAHAT -->
      <div class="article">
        <h3 class="article-title">PASAL 6<br>CUTI DAN ISTIRAHAT</h3>
        <div class="article-content">
          <p>6.1 Pihak Kedua berhak memperoleh waktu istirahat dan cuti sesuai ketentuan peraturan perundang-undangan dan kebijakan perusahaan.</p>
          <p>6.2 Cuti tahunan diberikan minimal 12 (dua belas) hari kerja setelah masa kerja 12 (dua belas) bulan secara terus-menerus.</p>
          <p>6.3 Cuti besar, cuti sakit, cuti melahirkan, dan cuti lainnya diberikan sesuai ketentuan peraturan perundang-undangan.</p>
          <p>6.4 Istirahat mingguan minimal 1 (satu) hari untuk 6 (enam) hari kerja dalam 1 (satu) minggu.</p>
        </div>
      </div>

      <!-- PASAL 7: KERAHASIAAN INFORMASI -->
      <div class="article">
        <h3 class="article-title">PASAL 7<br>KERAHASIAAN INFORMASI</h3>
        <div class="article-content">
          <p>7.1 Pihak Kedua wajib menjaga kerahasiaan seluruh data, dokumen, sistem, informasi bisnis, dan informasi lainnya yang diperoleh selama hubungan kerja berlangsung.</p>
          <p>7.2 Kewajiban kerahasiaan ini tetap berlaku setelah berakhirnya hubungan kerja untuk jangka waktu yang tidak terbatas.</p>
          <p>7.3 Pihak Kedua dilarang membocorkan, menyalin, atau menggunakan informasi rahasia untuk kepentingan pihak lain tanpa persetujuan tertulis dari Pihak Pertama.</p>
          <p>7.4 Pelanggaran terhadap kewajiban kerahasiaan ini dapat dikenakan sanksi sesuai peraturan perundang-undangan yang berlaku.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer">
        <span>Dokumen Internal AKMAN Academy</span>
        <span>{{ data.contract_number }}</span>
        <span>Halaman 3 dari 5</span>
      </div>
    </div>

    <!-- PAGE 4: PASAL 8-11 -->
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
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.contract_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- PASAL 8: HAK KEKAYAAN INTELEKTUAL -->
      <div class="article">
        <h3 class="article-title">PASAL 8<br>HAK KEKAYAAN INTELEKTUAL</h3>
        <div class="article-content">
          <p>8.1 Seluruh karya, dokumen, sistem, aplikasi, materi pembelajaran, desain, dan produk kerja yang dihasilkan dalam hubungan kerja menjadi milik PT Agsya Karya Manca.</p>
          <p>8.2 Pihak Kedua tidak berhak menggunakan atau mengklaim Hak Kekayaan Intelektual tersebut untuk kepentingan pribadi atau pihak lain.</p>
          <p>8.3 Pihak Kedua wajib menyerahkan seluruh dokumen dan aset terkait HKI kepada perusahaan saat berakhirnya hubungan kerja.</p>
        </div>
      </div>

      <!-- PASAL 9: PENGGUNAAN ASET PERUSAHAAN -->
      <div class="article">
        <h3 class="article-title">PASAL 9<br>PENGGUNAAN ASET PERUSAHAAN</h3>
        <div class="article-content">
          <p>9.1 Pihak Pertama dapat menyediakan aset perusahaan (laptop, email, akun, dan lainnya) untuk mendukung pelaksanaan tugas Pihak Kedua.</p>
          <p>9.2 Pihak Kedua wajib menggunakan aset perusahaan hanya untuk keperluan pekerjaan dan menjaga kondisi aset tersebut.</p>
          <p>9.3 Pihak Kedua wajib mengembalikan seluruh aset perusahaan dalam kondisi baik saat berakhirnya hubungan kerja.</p>
          <p>9.4 Kerusakan atau kehilangan aset perusahaan akibat kelalaian Pihak Kedua menjadi tanggung jawab Pihak Kedua.</p>
        </div>
      </div>

      <!-- PASAL 10: DISIPLIN DAN SANKSI -->
      <div class="article">
        <h3 class="article-title">PASAL 10<br>DISIPLIN DAN SANKSI</h3>
        <div class="article-content">
          <p>10.1 Pihak Kedua wajib mematuhi peraturan perusahaan, SOP, kode etik, dan kebijakan perusahaan yang berlaku.</p>
          <p>10.2 Pelanggaran terhadap kewajiban dapat dikenakan sanksi berupa:</p>
          <p class="sub-item">a. Teguran lisan</p>
          <p class="sub-item">b. Teguran tertulis</p>
          <p class="sub-item">c. Skorsing</p>
          <p class="sub-item">d. Pemutusan hubungan kerja</p>
          <p>10.3 Penerapan sanksi mengacu pada peraturan perusahaan dan ketentuan perundang-undangan yang berlaku.</p>
        </div>
      </div>

      <!-- PASAL 11: BERAKHIRNYA HUBUNGAN KERJA -->
      <div class="article">
        <h3 class="article-title">PASAL 11<br>BERAKHIRNYA HUBUNGAN KERJA</h3>
        <div class="article-content">
          <p>11.1 Perjanjian kerja ini berakhir karena:</p>
          <p class="sub-item">a. Berakhirnya jangka waktu perjanjian kerja (untuk PKWT)</p>
          <p class="sub-item">b. Kesepakatan para pihak</p>
          <p class="sub-item">c. Pengunduran diri Pihak Kedua dengan pemberitahuan tertulis minimal 30 (tiga puluh) hari sebelumnya</p>
          <p class="sub-item">d. Meninggal dunia Pihak Kedua</p>
          <p class="sub-item">e. Pemutusan hubungan kerja sesuai ketentuan peraturan perundang-undangan</p>
          <p>11.2 Pihak Kedua wajib menyelesaikan serah terima tugas dan mengembalikan seluruh aset perusahaan saat berakhirnya hubungan kerja.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="page-footer">
        <span>Dokumen Internal AKMAN Academy</span>
        <span>{{ data.contract_number }}</span>
        <span>Halaman 4 dari 5</span>
      </div>
    </div>

    <!-- PAGE 5: PASAL 12-13 + SIGNATURE -->
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
              <tr><td class="doc-label">No Dokumen</td><td>: {{ data.contract_number }}</td></tr>
              <tr><td class="doc-label">Versi</td><td>: 1.0</td></tr>
              <tr><td class="doc-label">Status</td><td>: {{ data.status || 'DRAFT' }}</td></tr>
              <tr><td class="doc-label">Tanggal</td><td>: {{ formatDateIndonesian(data.created_at) }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="header-divider"></div>

      <!-- PASAL 12: PENYELESAIAN PERSELISIHAN -->
      <div class="article">
        <h3 class="article-title">PASAL 12<br>PENYELESAIAN PERSELISIHAN</h3>
        <div class="article-content">
          <p>12.1 Apabila terjadi perselisihan dalam pelaksanaan perjanjian kerja ini, para pihak sepakat menyelesaikannya terlebih dahulu secara musyawarah untuk mufakat.</p>
          <p>12.2 Apabila musyawarah tidak berhasil, para pihak sepakat mengikuti mekanisme penyelesaian hubungan industrial sesuai peraturan perundang-undangan yang berlaku.</p>
          <p>12.3 Para pihak sepakat memilih domisili hukum yang tetap di Pengadilan Negeri Tegal.</p>
        </div>
      </div>

      <!-- PASAL 13: PENUTUP -->
      <div class="article">
        <h3 class="article-title">PASAL 13<br>PENUTUP</h3>
        <div class="article-content">
          <p>13.1 Perjanjian kerja ini dibuat dalam 2 (dua) rangkap bermeterai cukup, masing-masing untuk Pihak Pertama dan Pihak Kedua, dan keduanya memiliki kekuatan hukum yang sama.</p>
          <p>13.2 Hal-hal yang belum diatur dalam perjanjian ini akan diatur kemudian berdasarkan kesepakatan bersama dan selaras dengan ketentuan peraturan perundang-undangan.</p>
          <p>13.3 Perjanjian kerja ini mulai berlaku pada tanggal ditandatangani oleh kedua belah pihak.</p>
        </div>
      </div>

      <!-- Signature (pushed to bottom) -->
      <div class="signature-section">
        <div class="sig-content">
          <!-- Signature Tradisional -->
          <template v-if="!data.signature_type || data.signature_type === 'traditional'">
            <div class="sig-left">
              <p class="sig-place">Dibuat dan ditandatangani di:</p>
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.start_date) }}</p>
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
              <p class="sig-location">Tegal, {{ formatDateIndonesian(data.start_date) }}</p>
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
        <span>{{ data.contract_number }}</span>
        <span>Halaman 5 dari 5</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { StaffContract } from '@/types'
import { useCompanyStore } from '@/stores/company'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{ data: StaffContract }>()
const company = useCompanyStore()

const verifyUrl = computed(() => {
  const base = 'staff.akman.id/verify'
  return `${base}/${props.data.contract_number}`
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount)
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

/* ===== SALARY TABLE ===== */
.salary-table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0 16px;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
}

.salary-table td {
  font-size: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.salary-table tr:last-child td {
  border-bottom: none;
  font-weight: 700;
  background: #e0e7ff;
}

.salary-label {
  width: 180px;
  font-weight: 600;
  color: #475569;
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
