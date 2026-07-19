<div align="center">

# Staff Akman

### Sistem Manajemen Internal Staff untuk PT AGSYA KARYA MANCA

[![Vue.js](https://img.shields.io/badge/Vue.js-3.6-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.x-119eff?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#lisensi)

---

**Staff Akman** adalah Single Page Application (SPA) modern yang dibangun untuk kebutuhan internal staff PT AGSYA KARYA MANCA. Aplikasi ini menyediakan fitur lengkap untuk manajemen staff, termasuk task management, KPI monitoring, CV builder, letter generator, dan banyak lagi.

[Live Demo](https://staff-akman.vercel.app) · [Report Bug](https://github.com/username/UAS-PKL_24225046_Muhammad-Affif/issues) · [Request Feature](https://github.com/username/UAS-PKL_24225046_Muhammad-Affif/issues)

</div>

---

## Informasi Mahasiswa

| | |
|---|---|
| **Nama** | Muhamad Djafar Ilyasa |
| **NIM** | 23215028 |
| **Tempat PKL** | PT AGSYA KARYA MANCA (Akman) |
| **Periode** | 2026 |

---

## Demo Akun

Untuk mencoba aplikasi, gunakan akun demo berikut:

| Email | Password | Role |
|-------|----------|------|
| `djafar@akman.id` | `password123` | Staff |
| `affif@akman.id` | `password123` | Staff |

---

## Fitur Utama

### Task & KPI Management
- Manajemen tugas dengan status tracking
- Monitoring KPI staff secara real-time
- Dashboard visual dengan charts

### Document & Notes
- Document Center untuk penyimpanan dokumen
- Notes untuk catatan harian
- E-Library untuk referensi

### CV Builder
- 5 template profesional:
  - **Akman Academy** - Template untuk akademi
  - **Akman Corporate** - Template korporat
  - **Modern** - Template modern & minimalis
  - **Executive** - Template eksekutif
  - **Minimalist** - Template simpel & bersih
- Export ke PDF dan PNG

### Letter Generator
- Surat Kontrak
- Surat Pengangkatan
- Sertifikat Kerja
- Surat Pemberhentian
- Template JSON-based dengan binding resolution

### Events & Forms
- Event registration system
- Form templates untuk registrasi
- Manajemen peserta

### Finance Tracking
- Tracking keuangan staff
- Laporan keuangan

### Staff Management
- Manajemen data staff
- Role-based access control
- Profil staff lengkap

### Workspace
- Workspace per divisi
- Kolaborasi tim

---

## Teknologi yang Digunakan

### Frontend Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| [Vue.js](https://vuejs.org/) | 3.x | Progressive JavaScript Framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | 6.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Utility-first CSS framework |
| [Pinia](https://pinia.vuejs.org/) | 2.x | State management |
| [Vue Router](https://router.vuejs.org/) | 4.x | Client-side routing |

### Mobile (Hybrid)

| Teknologi | Keterangan |
|-----------|------------|
| [Capacitor](https://capacitorjs.com/) | Cross-platform native runtime |
| Capacitor Camera | Akses kamera |
| Capacitor Filesystem | Akses file system |
| Capacitor Network | Deteksi jaringan |
| Capacitor Push Notifications | Push notification |
| Capacitor Haptics | Feedback haptic |

### Libraries & Tools

| Library | Keterangan |
|---------|------------|
| [html2canvas](https://html2canvas.hertzen.com/) | Screenshot DOM ke canvas |
| [jsPDF](https://www.pdfjs.org/) | Generate PDF di browser |
| [pdf-lib](https://pdf-lib.js.org/) | PDF manipulation |
| [Lucide Icons](https://lucide.dev/) | Icon library |
| [VueUse](https://vueuse.org/) | Composition utilities |

---

## Tautan Deploy

### Web Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/UAS-PKL_24225046_Muhammad-Affif)

- **URL**: [https://staff-akman.vercel.app](https://staff-akman.vercel.app)
- **Platform**: Vercel

### Mobile Application

- **Platform**: Android (Capacitor)
- **Build**: Menggunakan build script bawaan

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) 18+ (rekomendasi: 20+)
- npm atau yarn atau pnpm
- Git

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/username/UAS-PKL_24225046_Muhammad-Affif.git
cd UAS-PKL_24225046_Muhammad-Affif

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit file .env sesuai kebutuhan

# 4. Jalankan development server
npm run dev
```

### Aplikasi

Buka browser dan akses:

```
http://localhost:3001
```

### Commands Tersedia

| Command | Keterangan |
|---------|------------|
| `npm run dev` | Jalankan dev server |
| `npm run dev:lokal` | Dev dengan environment lokal |
| `npm run build` | Build untuk produksi |
| `npm run preview` | Preview build produksi |
| `npm run build:mobile` | Build untuk Capacitor mobile |
| `npm run cap:sync` | Sync Capacitor Android project |
| `npm run android:open` | Buka Android Studio |
| `npm run mobile:build-apk` | Full APK build chain |

---

## Struktur Proyek

```
.
├── public/                    # Static files
├── src/
│   ├── assets/               # Static assets (CSS, images)
│   ├── components/           # Reusable Vue components
│   │   ├── cv/              # CV Builder components
│   │   ├── letters/         # Letter templates
│   │   ├── events/          # Event management
│   │   ├── staff/           # Staff management
│   │   ├── profile/         # Profile components
│   │   ├── e-library/       # E-Library components
│   │   ├── sidebar/         # Sidebar navigation
│   │   └── ui/              # Base UI components
│   ├── composables/         # Composition API hooks
│   │   ├── useApi.ts        # API wrapper
│   │   ├── useStaffApi.ts   # Staff API wrapper
│   │   ├── useCvExport.ts   # CV export logic
│   │   └── useLetterExport.ts # Letter export logic
│   ├── config/              # Configuration
│   │   └── navigation.ts    # Sidebar navigation config
│   ├── data/                # Mock data & templates
│   │   └── letters_templates/ # Letter template JSON
│   ├── layouts/             # Page layouts
│   │   ├── default.vue      # Authenticated layout
│   │   └── login.vue        # Login layout
│   ├── pages/               # Route pages (one per route)
│   ├── router/              # Vue Router config
│   ├── stores/              # Pinia stores
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Utility functions
├── docs/                    # Documentation
├── .env.example             # Environment variables template
├── capacitor.config.ts      # Capacitor config
├── tailwind.config.js       # Tailwind config
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── package.json
```

---

## Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
# API Configuration
VITE_API_URL=https://api.example.com

# Server Configuration
VITE_PORT=3001

# App Configuration
VITE_APP_URL=http://localhost:3001
```

---

## Build & Deploy

### Web (Vercel)

```bash
# Build
npm run build

# Output directory: dist/
```

### Mobile (Android)

```bash
# 1. Build web
npm run build:mobile

# 2. Sync Capacitor
npx cap sync android

# 3. Buka Android Studio
npx cap open android

# 4. Build APK dari Android Studio
# Atau via CLI:
cd android
./gradlew assembleDebug
```

APK tersedia di: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Kontribusi

Kontribusi sangat dihargai! Silakan buka Issue terlebih dahulu untuk membahas perubahan yang ingin Anda buat.

1. Fork Project
2. Create Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## Lisensi

**Proprietary** - PT AGSYA KARYA MANCA

Hanya untuk penggunaan internal PT AGSYA KARYA MANCA.

---

<div align="center">

**Dibuat oleh**: Muhamad Djafar Ilyasa (23215028)

**Periode PKL**: 2026

[![Built with Vue.js](https://img.shields.io/badge/Built_with-Vue.js-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org/)

</div>
