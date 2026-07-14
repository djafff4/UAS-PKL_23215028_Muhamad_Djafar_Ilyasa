# UAS PKL - Staff Akman

## Informasi Mahasiswa

- **Nama**: Muhammad Affif
- **NIM**: 24225046
- **Tempat PKL**: PT AGSYA KARYA MANCA (Akman)

## Judul Sistem

**Staff Akman** - Sistem Manajemen Internal Staff untuk PT AGSYA KARYA MANCA

## Deskripsi

Staff Akman adalah Single Page Application (SPA) yang dibangun untuk kebutuhan internal staff PT AGSYA KARYA MANCA. Aplikasi ini menyediakan fitur lengkap untuk manajemen staff, termasuk:

- Manajemen Tugas & KPI
- Meeting, Notes, dan Documents
- Event Registration dengan Form
- CV Builder dengan 5 Template
- Letter Generator (Kontrak, Pengangkatan, Sertifikat Kerja, Pemberhentian)
- E-Library
- Finance Tracking
- Roadmap
- Staff Management

## Teknologi yang Digunakan

### Frontend
- **Vue 3** - Progressive JavaScript Framework (Composition API, `<script setup>`)
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool dan dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router 4** - Routing

### Mobile (Hybrid)
- **Capacitor 8** - Cross-platform native runtime
  - Camera, Filesystem, Network, Push Notifications, Haptics

### Tools & Libraries
- **html2canvas + jsPDF** - PDF/PNG export
- **pdf-lib** - PDF manipulation
- **lucide-vue-next** - Icons
- **@vueuse/core** - Composition utilities

## Tautan Deploy

### Web Application
- **URL**: [https://staff-akman.vercel.app](https://staff-akman.vercel.app)
- **Platform**: Vercel

### Mobile Application
- **APK**: Build using Capacitor Android
- **Status**: Tersedia via build script

## Cara Menjalankan Sistem secara Lokal

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/[username]/UAS-PKL_24225046_Muhammad-Affif.git
cd UAS-PKL_24225046_Muhammad-Affif
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka browser dan akses:
```
http://localhost:3001
```

### Build untuk Produksi

```bash
npm run build
```

### Build APK (Android)

```bash
npm run build:mobile
npx cap sync android
cd android
./gradlew assembleDebug
```

APK akan tersedia di: `android/app/build/outputs/apk/debug/app-debug.apk`

## Struktur Proyek

```
├── src/
│   ├── assets/          # Static assets (CSS, images)
│   ├── components/      # Reusable Vue components
│   │   ├── cv/         # CV Builder components
│   │   ├── letters/    # Letter templates
│   │   ├── events/     # Event management
│   │   ├── staff/      # Staff management
│   │   └── ...
│   ├── composables/    # Composition API hooks
│   ├── config/         # Navigation config
│   ├── data/           # Mock data & templates
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── router/         # Vue Router config
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Utility functions
├── public/             # Static files
├── docs/               # Documentation
└── package.json
```

## Lisensi

Proprietary - PT AGSYA KARYA MANCA

---

**Dibuat oleh**: Muhammad Affif (24225046)  
**Periode PKL**: 2026
