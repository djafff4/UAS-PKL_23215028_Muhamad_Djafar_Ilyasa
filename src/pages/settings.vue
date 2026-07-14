<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Pengaturan</h1>
        <p class="text-sm text-white/60 mt-1 font-medium">Atur preferensi akun dan sistem</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3 sm:mx-0 px-3 sm:px-0">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0"
        :class="activeTab === tab.key
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 ring-1 ring-primary-400/20'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-500 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:text-surface-700 dark:hover:text-surface-300 backdrop-blur-sm'">
        <component :is="tab.icon" :size="15" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Notifikasi -->
    <div v-if="activeTab === 'notifications'" class="space-y-4">
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Bell :size="15" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Preferensi Notifikasi</h3>
            <p class="text-xs text-surface-500 mt-0.5">Atur notifikasi yang ingin Anda terima</p>
          </div>
        </div>
        <div class="divide-y divide-surface-100 dark:divide-surface-800">
          <div v-for="pref in notificationPrefs" :key="pref.key"
            class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div class="pr-4">
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-200">{{ pref.label }}</p>
              <p class="text-xs text-surface-500 mt-0.5 leading-relaxed">{{ pref.desc }}</p>
            </div>
            <button @click="toggleNotif(pref.key)"
              class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              :class="settings[pref.key] ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                :class="settings[pref.key] ? 'translate-x-[22px]' : 'translate-x-0'" />
            </button>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-surface-100 dark:border-surface-800">
          <button @click="saveNotificationSettings"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
            <Save :size="14" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>

    <!-- Tab: Keamanan -->
    <div v-if="activeTab === 'security'" class="space-y-4">
      <!-- Ubah Password -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <KeyRound :size="15" class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Ubah Password</h3>
            <p class="text-xs text-surface-500 mt-0.5">Ganti password akun Anda secara berkala</p>
          </div>
        </div>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Password Saat Ini</label>
            <input v-model="passwordForm.current" type="password" placeholder="Masukkan password saat ini"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Password Baru</label>
            <input v-model="passwordForm.newPassword" type="password" placeholder="Minimal 6 karakter"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Konfirmasi Password Baru</label>
            <input v-model="passwordForm.confirm" type="password" placeholder="Ulangi password baru"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
          </div>
          <p v-if="passwordError" class="text-xs font-medium text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {{ passwordError }}
          </p>
          <p v-if="passwordSuccess" class="text-xs font-medium text-emerald-600 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg">
            <CheckCircle :size="14" />
            {{ passwordSuccess }}
          </p>
          <button @click="changePassword"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
            <KeyRound :size="14" />
            Perbarui Password
          </button>
        </div>
      </div>

      <!-- Google Account Linking -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-[#4285F4]/10 dark:bg-[#4285F4]/20 flex items-center justify-center">
            <Globe :size="15" class="text-[#4285F4]" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Akun Tertaut</h3>
            <p class="text-xs text-surface-500 mt-0.5">Tautkan akun Google untuk memudahkan akses</p>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/30">
            <div class="w-10 h-10 rounded-full bg-white border border-surface-200 dark:border-surface-700 flex items-center justify-center shadow-sm">
              <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">Google</p>
              <p v-if="isGoogleLinked" class="text-xs text-surface-500 truncate mt-0.5">
                {{ auth.user?.email || 'Akun tertaut' }}
              </p>
              <p v-else class="text-xs text-surface-400 mt-0.5">Belum ditautkan</p>
            </div>
            <div>
              <button v-if="isGoogleLinked" @click="unlinkGoogle"
                class="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 rounded-lg transition-all active:scale-[0.97]"
                :disabled="linking">
                {{ linking ? 'Memproses...' : 'Lepas Akun' }}
              </button>
              <button v-else @click="linkGoogle"
                class="px-3 py-1.5 text-xs font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-lg transition-all flex items-center gap-1.5 active:scale-[0.97]"
                :disabled="linking">
                {{ linking ? 'Memproses...' : 'Tautkan Akun' }}
              </button>
            </div>
          </div>
          <p v-if="linkMessage"
            class="text-xs font-medium flex items-center gap-1.5 px-3.5 py-2 rounded-lg"
            :class="linkSuccess ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'text-red-500 bg-red-50 dark:bg-red-950/20'">
            <CheckCircle v-if="linkSuccess" :size="14" />
            <span v-else class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {{ linkMessage }}
          </p>
        </div>
      </div>

      <!-- Avatar Upload -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <Camera :size="15" class="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Foto Profil</h3>
            <p class="text-xs text-surface-500 mt-0.5">Unggah foto profil Anda (maks 5 MB, JPG/PNG/WebP)</p>
          </div>
        </div>
        <div class="flex items-center gap-5">
          <!-- Avatar Preview -->
          <div class="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-surface-100 dark:ring-surface-800 shadow-lg shrink-0 group cursor-pointer"
            @click="avatarFileInput?.click()">
            <img v-if="avatarPreview || auth.user?.profile?.avatar_url" :src="avatarPreview || auth.user?.profile?.avatar_url" class="w-full h-full object-cover" />
            <span v-else class="select-none">{{ avatarInitials }}</span>
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              <Camera :size="20" class="text-white" />
            </div>
          </div>
          <input ref="avatarFileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/webp" @change="onAvatarSelect" />

          <!-- Upload Controls -->
          <div class="flex-1 space-y-2">
            <div v-if="avatarFile">
              <p class="text-xs text-surface-600 dark:text-surface-400 truncate mb-2">{{ avatarFile.name }}</p>
              <div class="flex gap-2">
                <button @click="uploadAvatar" :disabled="avatarUploading"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-xs font-bold rounded-xl transition-all disabled:cursor-not-allowed">
                  <Loader2 v-if="avatarUploading" :size="14" class="animate-spin" />
                  <Save v-else :size="14" />
                  {{ avatarUploading ? 'Mengupload...' : 'Simpan Foto' }}
                </button>
                <button @click="cancelAvatar" :disabled="avatarUploading"
                  class="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-xs font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all disabled:cursor-not-allowed">
                  Batal
                </button>
              </div>
            </div>
            <div v-else>
              <p class="text-xs text-surface-500">Klik avatar atau tombol di bawah untuk mengganti foto profil</p>
              <button @click="avatarFileInput?.click()"
                class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-xs font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all">
                <Camera :size="14" />
                Pilih Foto
              </button>
            </div>
          </div>
        </div>

        <div v-if="showAvatarFocalCropper && (avatarPreview || auth.user?.profile?.avatar_url)" class="mt-4">
          <FocalPointCropper
            :image-url="avatarPreview || auth.user?.profile?.avatar_url!"
            :output-size="400"
            @update:cropped-blob="onAvatarCroppedBlob"
          />
        </div>
      </div>
    </div>

    <!-- Tab: Tampilan & Bahasa -->
    <div v-if="activeTab === 'appearance'" class="space-y-4">
      <!-- Theme Selector -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Sun :size="15" class="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Tema Tampilan</h3>
            <p class="text-xs text-surface-500 mt-0.5">Pilih tema yang nyaman untuk mata Anda</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button v-for="opt in themeOptions" :key="opt.key" @click="applyTheme(opt.key)"
            class="relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-center group"
            :class="theme === opt.key
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-sm shadow-primary-500/10'
              : 'border-surface-200 dark:border-surface-700/40 bg-white dark:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600'">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
              :class="[`bg-gradient-to-br ${opt.color}`, theme === opt.key ? 'shadow-md scale-105' : 'opacity-70 group-hover:opacity-90']">
              <component :is="opt.icon" :size="22" class="text-white" />
            </div>
            <div>
              <p class="text-sm font-bold" :class="theme === opt.key ? 'text-primary-700 dark:text-primary-300' : 'text-surface-800 dark:text-surface-200'">{{ opt.label }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ opt.desc }}</p>
            </div>
            <div v-if="theme === opt.key" class="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
              <CheckCircle :size="12" class="text-white" />
            </div>
          </button>
        </div>
      </div>

      <!-- Language Selector -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Languages :size="15" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Bahasa</h3>
            <p class="text-xs text-surface-500 mt-0.5">Pilih bahasa antarmuka aplikasi</p>
          </div>
        </div>
        <div class="max-w-xs">
          <div class="relative">
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Globe :size="14" class="text-surface-400" />
            </div>
            <select v-model="language"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all appearance-none cursor-pointer">
              <option v-for="lang in languageOptions" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Timezone Selector -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Monitor :size="15" class="text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Zona Waktu</h3>
            <p class="text-xs text-surface-500 mt-0.5">Atur zona waktu untuk jadwal dan notifikasi</p>
          </div>
        </div>
        <div class="max-w-xs">
          <div class="relative">
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Globe :size="14" class="text-surface-400" />
            </div>
            <select v-model="timezone"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all appearance-none cursor-pointer">
              <option v-for="tz in timezoneOptions" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="card p-5 sm:p-6">
        <button @click="saveAppearanceSettings" :disabled="appearanceSaving"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed">
          <Loader2 v-if="appearanceSaving" :size="14" class="animate-spin" />
          <Save v-else :size="14" />
          {{ appearanceSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </div>
    </div>

    <!-- Tab: Staff Management (admin/direktur only) -->
    <div v-if="activeTab === 'staff'" class="space-y-4">
      <div class="card p-8 sm:p-10 text-center">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
          <Users :size="28" class="text-white" />
        </div>
        <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Manajemen Staff</h3>
        <p class="text-sm text-surface-500 max-w-xs mx-auto mb-6 leading-relaxed">Kelola data staff, jabatan, role, dan struktur organisasi di halaman khusus Staff Management.</p>
        <RouterLink to="/workspace/staff"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
          <ExternalLink :size="16" />
          Buka Staff Management
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Bell, Shield, Users, ExternalLink, Save, KeyRound, Globe, CheckCircle,
  Sun, Moon, Monitor, Camera, Languages, Loader2,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import FocalPointCropper from '@/components/profile/FocalPointCropper.vue'

const auth = useAuthStore()
const toast = useToast()

const tabs = [
  { key: 'notifications', label: 'Notifikasi', icon: Bell },
  { key: 'security', label: 'Keamanan', icon: Shield },
  { key: 'appearance', label: 'Tampilan', icon: Sun },
  { key: 'staff', label: 'Manajemen Staff', icon: Users },
]
const activeTab = ref('notifications')

const settings = ref<Record<string, boolean>>({
  notif_new_participant: true,
  notif_document_pending: true,
  notif_alpha_warning: true,
  notif_payment: false,
  notif_placement: true,
  notif_weekly_report: false,
})

const notificationPrefs = [
  { key: 'notif_new_participant', label: 'Peserta Baru', desc: 'Notifikasi ketika ada peserta baru mendaftar' },
  { key: 'notif_document_pending', label: 'Dokumen Tertunda', desc: 'Notifikasi ketika dokumen peserta pending verifikasi' },
  { key: 'notif_alpha_warning', label: 'Peringatan Alpha', desc: 'Notifikasi ketika peserta tidak masuk tanpa keterangan' },
  { key: 'notif_payment', label: 'Pembayaran', desc: 'Notifikasi ketika ada pembayaran masuk' },
  { key: 'notif_placement', label: 'Penempatan', desc: 'Notifikasi ketika peserta ditempatkan ke perusahaan' },
  { key: 'notif_weekly_report', label: 'Laporan Mingguan', desc: 'Kirim laporan ringkasan mingguan via email' },
]

// Appearance & Language
const theme = ref(localStorage.getItem('theme') || 'light')
const language = ref('id')
const timezone = ref('Asia/Jakarta')
const appearanceSaving = ref(false)

const themeOptions = [
  { key: 'light', label: 'Terang', desc: 'Mode terang untuk siang hari', icon: Sun, color: 'from-amber-400 to-orange-500' },
  { key: 'dark', label: 'Gelap', desc: 'Mode gelap untuk malam hari', icon: Moon, color: 'from-indigo-500 to-purple-600' },
  { key: 'system', label: 'Sistem', desc: 'Ikuti pengaturan perangkat', icon: Monitor, color: 'from-surface-500 to-surface-700' },
]

const languageOptions = [
  { value: 'id', label: 'Bahasa Indonesia', code: 'ID' },
  { value: 'en', label: 'English', code: 'EN' },
]

const timezoneOptions = [
  { value: 'Asia/Jakarta', label: 'WIB — Jakarta (UTC+7)' },
  { value: 'Asia/Makassar', label: 'WITA — Makassar (UTC+8)' },
  { value: 'Asia/Jayapura', label: 'WIT — Jayapura (UTC+9)' },
]

function applyTheme(t: string) {
  theme.value = t
  localStorage.setItem('theme', t)
  if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

async function saveAppearanceSettings() {
  appearanceSaving.value = true
  try {
    const res: any = await useApi('/auth/settings', {
      method: 'PUT',
      body: { theme: theme.value, language: language.value, timezone: timezone.value },
    })
    if (res.success) {
      applyTheme(theme.value)
      toast.success('Berhasil', 'Pengaturan tampilan berhasil disimpan')
    } else {
      toast.error('Gagal', res.message || 'Gagal menyimpan pengaturan')
    }
  } catch {
    toast.error('Gagal', 'Gagal menyimpan pengaturan')
  } finally {
    appearanceSaving.value = false
  }
}

// Avatar Upload
const avatarFileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarUploading = ref(false)
const showAvatarFocalCropper = ref(false)
const avatarCroppedBlob = ref<Blob | null>(null)

function onAvatarSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Gagal', 'Ukuran foto maksimal 5 MB')
      return
    }
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
    showAvatarFocalCropper.value = true
    avatarCroppedBlob.value = null
  }
}

function onAvatarCroppedBlob(blob: Blob | null) {
  avatarCroppedBlob.value = blob
}

function cancelAvatar() {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarFile.value = null
  avatarPreview.value = null
  showAvatarFocalCropper.value = false
  avatarCroppedBlob.value = null
  if (avatarFileInput.value) avatarFileInput.value.value = ''
}

async function uploadAvatar() {
  if (!avatarCroppedBlob.value || avatarUploading.value) return
  avatarUploading.value = true

  try {
    const formData = new FormData()
    const file = new File([avatarCroppedBlob.value], 'avatar.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    const res: any = await useApi('/auth/avatar', {
      method: 'POST',
      body: formData,
    })

    if (res.success && res.data?.avatar_url) {
      if (auth.user) {
        auth.setAuthData(
          {
            ...auth.user,
            profile: {
              ...auth.user?.profile,
              avatar_url: res.data.avatar_url,
            },
          },
          auth.token || '',
        )
      }
      toast.success('Berhasil', 'Foto profil berhasil diupload')
      cancelAvatar()
    } else {
      throw new Error(res.message || 'Gagal upload')
    }
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Gagal menyimpan foto profil')
  } finally {
    avatarUploading.value = false
  }
}

const avatarInitials = computed(() => {
  const name = auth.user?.profile?.full_name || auth.user?.name || auth.user?.email || ''
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'S'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

function toggleNotif(key: string) {
  settings.value[key] = !settings.value[key]
}

async function fetchSettings() {
  try {
    const res: any = await useApi('/auth/settings')
    if (res.success && res.data) {
      Object.keys(settings.value).forEach((k) => {
        if (res.data[k] !== undefined) settings.value[k] = res.data[k]
      })
      // Populate appearance settings from backend
      if (res.data.theme) {
        theme.value = res.data.theme
        localStorage.setItem('theme', res.data.theme)
      }
      if (res.data.language) language.value = res.data.language
      if (res.data.timezone) timezone.value = res.data.timezone
      // Apply theme on load
      applyTheme(theme.value)
    }
  } catch { /* silent */ }
}

async function saveNotificationSettings() {
  try {
    const res: any = await useApi('/auth/settings', {
      method: 'PUT',
      body: settings.value,
    })
    if (res.success) {
      toast.success('Berhasil', 'Pengaturan notifikasi berhasil disimpan')
    } else {
      toast.error('Gagal', res.message || 'Gagal menyimpan pengaturan')
    }
  } catch {
    toast.error('Gagal', 'Gagal menyimpan pengaturan')
  }
}

// Password
const passwordForm = ref({ current: '', newPassword: '', confirm: '' })
const passwordError = ref('')
const passwordSuccess = ref('')

async function changePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!passwordForm.value.current) { passwordError.value = 'Password saat ini wajib diisi'; return }
  if (passwordForm.value.newPassword.length < 6) { passwordError.value = 'Password baru minimal 6 karakter'; return }
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) { passwordError.value = 'Konfirmasi password tidak cocok'; return }

  try {
    const res: any = await useApi('/auth/profile/password', {
      method: 'POST',
      body: { current_password: passwordForm.value.current, new_password: passwordForm.value.newPassword },
    })
    if (res.success) {
      passwordSuccess.value = 'Password berhasil diperbarui'
      passwordForm.value = { current: '', newPassword: '', confirm: '' }
      setTimeout(() => passwordSuccess.value = '', 4000)
    } else {
      passwordError.value = res.message || 'Gagal mengubah password'
    }
  } catch (err: any) {
    passwordError.value = err?.data?.message || err.message || 'Terjadi kesalahan'
  }
}

// Google Account Linking
const linking = ref(false)
const linkMessage = ref('')
const linkSuccess = ref(false)
const isGoogleLinked = computed(() => !!auth.user?.google_id)

function linkGoogle() {
  linking.value = true
  linkMessage.value = ''

  const apiUrl = import.meta.env.VITE_API_URL
  const popup = window.open(`${apiUrl}/auth/google/login`, '_blank', 'width=600,height=700')

  if (!popup) {
    linkMessage.value = 'Pop-up diblokir. Izinkan pop-up untuk halaman ini.'
    linkSuccess.value = false
    linking.value = false
    return
  }

  linkMessage.value = 'Jendela baru telah dibuka untuk tautkan akun Google.'
  linkSuccess.value = true
  linking.value = false
}

async function unlinkGoogle() {
  linking.value = true
  linkMessage.value = ''

  try {
    const res: any = await useApi('/auth/google/link', { method: 'DELETE' })
    if (res.success) {
      linkMessage.value = 'Akun Google berhasil dilepas'
      linkSuccess.value = true
      await auth.fetchMe()
    } else {
      linkMessage.value = res.message || 'Gagal melepas akun Google'
      linkSuccess.value = false
    }
  } catch (err: any) {
    linkMessage.value = err.message || 'Terjadi kesalahan'
    linkSuccess.value = false
  } finally {
    linking.value = false
  }
}

function handleGoogleAuthMessage(event: MessageEvent) {
  if (event.data?.type === 'google-auth-success') {
    auth.fetchMe()
    linkMessage.value = 'Akun Google berhasil ditautkan'
    linkSuccess.value = true
    setTimeout(() => linkMessage.value = '', 5000)
  } else if (event.data?.type === 'google-auth-error') {
    linkMessage.value = event.data.error || 'Gagal menautkan akun Google'
    linkSuccess.value = false
  }
}

onMounted(() => {
  // Apply stored theme immediately on page load
  applyTheme(theme.value)
  fetchSettings()
  window.addEventListener('message', handleGoogleAuthMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleGoogleAuthMessage)
})
</script>
