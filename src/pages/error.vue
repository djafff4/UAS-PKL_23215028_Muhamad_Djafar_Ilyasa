<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-500/5 blur-[100px]"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-500/5 blur-[100px]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/3 blur-[120px]"></div>
    </div>

    <div class="relative max-w-lg w-full">
      <!-- Main Card -->
      <div class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border border-surface-200/50 dark:border-surface-700/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-surface-300/20 dark:shadow-black/30">
        <!-- Status Code -->
        <div class="relative mb-6">
          <span class="text-[120px] sm:text-[140px] font-black leading-none tracking-tighter text-surface-100 dark:text-surface-800 select-none">
            404
          </span>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <FileQuestion :size="40" class="text-white sm:w-12 sm:h-12" />
            </div>
          </div>
        </div>

        <!-- Title & Description -->
        <h1 class="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p class="text-sm sm:text-base text-surface-500 dark:text-surface-400 leading-relaxed mb-8 max-w-sm mx-auto">
          Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak tersedia di sistem ini.
        </p>

        <!-- Quick Links -->
        <div class="grid grid-cols-2 gap-3 mb-8">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
          >
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              :class="link.bgClass">
              <component :is="link.icon" :size="16" :class="link.iconClass" />
            </div>
            <span class="text-xs font-semibold text-surface-700 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-left">
              {{ link.label }}
            </span>
          </RouterLink>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            @click="goBack"
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-all duration-200"
          >
            <ArrowLeft :size="16" />
            Kembali
          </button>
          <RouterLink
            to="/"
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
          >
            <Home :size="16" />
            Ke Dashboard
          </RouterLink>
        </div>

        <!-- Support Link -->
        <div class="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800">
          <p class="text-xs text-surface-400 dark:text-surface-500">
            Butuh bantuan? Hubungi
            <a href="mailto:support@akman.id" class="font-semibold text-primary-500 hover:text-primary-600 transition-colors">
              Tim Support
            </a>
          </p>
        </div>
      </div>

      <!-- Footer Branding -->
      <div class="text-center mt-6">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm border border-surface-200/30 dark:border-surface-700/30">
          <div class="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
            <span class="text-[8px] font-bold text-white">A</span>
          </div>
          <span class="text-[11px] font-semibold text-surface-500 dark:text-surface-400">
            AKMAN Academy
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Home, ArrowLeft, FileQuestion,
  LayoutDashboard, Users, GraduationCap, ClipboardList
} from 'lucide-vue-next'

defineProps<{ error: any }>()

const router = useRouter()

const quickLinks = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    bgClass: 'bg-primary-100 dark:bg-primary-900/30',
    iconClass: 'text-primary-600 dark:text-primary-400',
  },
  {
    to: '/tasks',
    label: 'Tugas Saya',
    icon: ClipboardList,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    to: '/workspace/staff',
    label: 'Karyawan',
    icon: Users,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    to: '/programs',
    label: 'Program',
    icon: GraduationCap,
    bgClass: 'bg-violet-100 dark:bg-violet-900/30',
    iconClass: 'text-violet-600 dark:text-violet-400',
  },
]

function goBack() {
  window.history.length > 1 ? window.history.back() : router.push('/')
}
</script>
