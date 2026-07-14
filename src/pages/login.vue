<template>
  <div class="flex min-h-screen w-full overflow-hidden bg-white dark:bg-surface-950">
    <!-- Left Panel - Corporate Visual -->
    <div class="relative hidden w-0 flex-1 lg:flex overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
      </div>

      <!-- Abstract glow orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-600/20 to-indigo-600/10 blur-[100px] animate-pulse" style="animation-duration: 8s;"></div>
        <div class="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/15 to-primary-600/5 blur-[120px] animate-pulse" style="animation-duration: 12s; animation-delay: 2s;"></div>
      </div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 xl:p-16 2xl:p-20 text-white w-full">
        <!-- Logo -->
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
            <img :src="logo" alt="AKMAN" class="h-8 w-auto" />
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight leading-none">AKMAN</h1>
            <p class="text-[8px] font-semibold text-primary-400/60 uppercase tracking-[0.3em] mt-1">Internal Workspace</p>
          </div>
        </div>

        <!-- Center Content -->
        <div class="flex-1 flex flex-col justify-center max-w-lg">
          <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-400/60 mb-6">— Akses Terbatas</p>
          <h2 class="text-4xl xl:text-5xl 2xl:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            Kelola<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-indigo-300">Ekosistem.</span>
          </h2>
          <p class="text-base xl:text-lg text-surface-400 font-medium leading-relaxed max-w-md">
            Pusat operasional digital untuk manajemen tugas, KPI, dokumen, rapat, dan pencapaian tim AKMAN.
          </p>

          <div class="flex flex-wrap gap-4 mt-10">
            <div v-for="badge in trustBadges" :key="badge.label" class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div class="h-8 w-8 rounded-lg flex items-center justify-center" :class="badge.bgClass">
                <component :is="badge.icon" :size="16" :class="badge.iconClass" />
              </div>
              <span class="text-[10px] font-semibold text-surface-300 tracking-wide">{{ badge.label }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-[9px] text-surface-500 font-semibold tracking-wide">
          <span>&copy; {{ year }} PT Agsya Karya Manca</span>
          <span v-if="greeting" class="text-primary-400/60">{{ greeting }}</span>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex w-full min-h-dvh items-center justify-center overflow-y-auto lg:w-1/2 relative bg-white dark:bg-surface-950">
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent"></div>
      </div>

      <div class="relative z-10 w-full px-5 xs:px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 max-w-xl py-8 sm:py-12">

        <!-- Mobile Logo -->
        <div class="flex items-center justify-between mb-8 lg:hidden">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-surface-950 flex items-center justify-center overflow-hidden">
              <img :src="logo" alt="AKMAN" class="h-6 w-auto brightness-0 invert" />
            </div>
            <div>
              <p class="text-[10px] font-bold tracking-wider text-primary-600 leading-none">AKMAN</p>
              <p class="text-[8px] font-semibold text-surface-400 tracking-wider mt-0.5">Internal Workspace</p>
            </div>
          </div>
          <RouterLink to="/" class="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-surface-400 hover:text-primary-600 transition-colors">
            <ArrowLeft :size="12" />
            Beranda
          </RouterLink>
        </div>

        <!-- Greeting -->
        <div class="mb-8 sm:mb-10 text-center lg:text-left">
          <h1 class="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white tracking-tight leading-tight">
            Selamat Datang<br class="xs:hidden sm:block" />
            <span class="text-primary-600">Kembali</span>
          </h1>
          <p class="mt-2 text-sm sm:text-base text-surface-500 font-medium">{{ greetingWord }}, silakan masuk ke dashboard staff Anda.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
          <!-- Email -->
          <div class="space-y-1.5">
            <label for="email" class="block text-[10px] sm:text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest ml-1">Email Perusahaan</label>
            <div class="relative">
              <div class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                <Mail :size="18" class="sm:w-5 sm:h-5" />
              </div>
              <input
                id="email"
                ref="emailRef"
                v-model="form.email"
                type="email"
                autocomplete="username"
                inputmode="email"
                placeholder="nama@akman.id"
                class="input-field pl-10 sm:pl-12"
                :class="{ 'ring-2 ring-red-400/50 border-red-300': emailError }"
                @input="emailError = ''"
                @blur="validateEmail"
              />
            </div>
            <p v-if="emailError" class="text-red-500 text-[10px] font-semibold px-1 flex items-center gap-1 mt-1.5">
              <AlertCircle :size="14" class="shrink-0" /> {{ emailError }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label for="password" class="block text-[10px] sm:text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest ml-1">Password</label>
            <div class="relative">
              <div class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
                <Lock :size="18" class="sm:w-5 sm:h-5" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="input-field pl-10 sm:pl-12 pr-12 sm:pr-14"
                :class="{ 'ring-2 ring-red-400/50 border-red-300': passwordError }"
                @input="passwordError = ''"
                @keydown.enter="handleLogin"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-600 transition-colors p-1 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800"
                :title="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              >
                <Eye v-if="!showPassword" :size="18" class="sm:w-5 sm:h-5" />
                <EyeOff v-else :size="18" class="sm:w-5 sm:h-5" />
              </button>
            </div>
            <p v-if="passwordError" class="text-red-500 text-[10px] font-semibold px-1 flex items-center gap-1 mt-1.5">
              <AlertCircle :size="14" class="shrink-0" /> {{ passwordError }}
            </p>
          </div>

          <!-- Options Row -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2.5 cursor-pointer group min-h-[44px]">
              <div class="relative flex items-center justify-center h-11 w-11 -ml-2">
                <input type="checkbox" v-model="form.remember" class="sr-only peer" />
                <div class="h-4 w-4 sm:h-5 sm:w-5 rounded-md border-2 border-surface-300 peer-checked:border-primary-600 peer-checked:bg-primary-600 transition-all group-hover:border-primary-400 flex items-center justify-center">
                  <Check v-if="form.remember" :size="14" class="text-white" />
                </div>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest group-hover:text-surface-700 transition-colors">Ingat Saya</span>
            </label>
            <span class="text-[10px] sm:text-xs font-bold text-surface-300 uppercase tracking-widest select-none">
              Lupa Password?
            </span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full justify-center py-3.5 sm:py-4 text-xs sm:text-sm tracking-normal shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 active:scale-[0.98] transition-all duration-300"
          >
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            <span v-else class="flex items-center gap-2.5">
              Masuk
              <ArrowRight :size="16" class="sm:w-[18px] sm:h-[18px]" />
            </span>
          </button>

          <!-- Error -->
          <Transition name="fade">
            <div v-if="authError" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] sm:text-xs font-semibold" role="alert">
              <AlertCircle :size="16" class="shrink-0" />
              {{ authError }}
            </div>
          </Transition>

          <!-- Divider -->
          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-surface-200"></div></div>
            <span class="relative bg-white dark:bg-surface-950 px-4 text-[9px] sm:text-[10px] font-bold tracking-widest text-surface-400">Atau masuk dengan</span>
          </div>

          <!-- Google SSO -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all text-surface-600 dark:text-surface-300 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 active:scale-[0.98] group"
          >
            <svg class="h-5 w-5 sm:h-[22px] sm:w-[22px] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none">
              <path d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.7-1.6 2.8-3.9 2.8-6.7 0-.6-.1-1.2-.2-1.8H12z" fill="#EA4335"/>
              <path d="M12 22c2.6 0 4.9-.9 6.5-2.5l-3-2.3c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2l-3.1 2.4C4.9 19.8 8.2 22 12 22z" fill="#34A853"/>
              <path d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9l-3.1-2.4C2.5 9.1 2 10.5 2 12s.5 2.9 1.3 4.3l3.1-2.4z" fill="#4A90E2"/>
              <path d="M12 5.9c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17 2.8 14.7 2 12 2 8.2 2 4.9 4.2 3.3 7.7l3.1 2.4c.8-2.4 3-4.2 5.6-4.2z" fill="#FBBC05"/>
            </svg>
            <span>Google Account</span>
          </button>
        </form>

        <p class="mt-8 sm:mt-10 text-center text-[9px] font-semibold text-surface-400 tracking-wider leading-relaxed">
          Hanya untuk staff & manajemen AKMAN yang berwenang.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import logo from '@/assets/img/logo.jpeg'
import {
  Loader2, ArrowLeft, ArrowRight, Eye, EyeOff,
  Mail, Lock, AlertCircle, Check,
  ShieldCheck, LockKeyhole, Zap
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const toasts = useToast()
const emailRef = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')
const authError = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: true
})

const year = computed(() => new Date().getFullYear())

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi! Siap untuk produktif hari ini?'
  if (hour < 15) return 'Selamat siang! Semoga harimu menyenangkan.'
  if (hour < 18) return 'Selamat sore! Masih semangat bekerja?'
  return 'Selamat malam! Jaga kesehatan ya.'
})

const greetingWord = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
})

const trustBadges = [
  { label: 'Terpercaya', icon: ShieldCheck, bgClass: 'bg-emerald-500/20', iconClass: 'text-emerald-400' },
  { label: 'Aman', icon: LockKeyhole, bgClass: 'bg-blue-500/20', iconClass: 'text-blue-400' },
  { label: 'Cepat', icon: Zap, bgClass: 'bg-amber-500/20', iconClass: 'text-amber-400' },
]

function validateEmail(): boolean {
  const v = form.email.trim()
  if (!v) {
    emailError.value = 'Email harus diisi'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    emailError.value = 'Format email tidak valid. Contoh: nama@akman.id'
    return false
  }
  emailError.value = ''
  return true
}

async function handleLogin() {
  authError.value = ''
  passwordError.value = ''
  if (!validateEmail()) return
  if (!form.password.trim()) {
    passwordError.value = 'Password harus diisi'
    return
  }

  loading.value = true
  try {
    await auth.login(form.email.trim(), form.password)
    toasts.success('Berhasil', `Selamat datang kembali, ${auth.user?.profile?.full_name || 'Staff'}`)
    await router.push('/')
  } catch (err: any) {
    authError.value = err.message || 'Login gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

function handleGoogleLogin() {
  const apiUrl = import.meta.env.VITE_API_URL
  window.location.href = `${apiUrl}/auth/google/login`
}

onMounted(() => {
  emailRef.value?.focus()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
