<template>
  <div class="card overflow-hidden">
    <!-- Card Header -->
    <div class="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-center justify-between border-b border-surface-100 dark:border-surface-800/40">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
        <span class="w-1 h-4 rounded-full bg-primary-500"></span>
        Detail Staff
      </h3>
      <span class="text-[10px] font-bold uppercase tracking-widest text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">
        Read-only
      </span>
    </div>

    <!-- Detail Items -->
    <div class="divide-y divide-surface-100 dark:divide-surface-800/30">
      <!-- Akman ID -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-500/20">
          <Hash :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Akman ID</p>
          <p class="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{{ auth.user?.akman_id || '-' }}</p>
        </div>
      </div>

      <!-- Posisi -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-violet-500/20">
          <Award :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Posisi / Jabatan</p>
          <p class="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{{ auth.user?.staff_detail?.position || '-' }}</p>
        </div>
      </div>

      <!-- Departemen -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
          <Building2 :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Departemen</p>
          <p class="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{{ auth.user?.staff_detail?.department || '-' }}</p>
        </div>
      </div>

      <!-- Status Kepegawaian -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/20">
          <FileText :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Status Kepegawaian</p>
          <p class="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{{ employmentStatus }}</p>
        </div>
      </div>

      <!-- Tanggal Bergabung -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
          <Calendar :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Tanggal Bergabung</p>
          <p class="text-sm font-bold text-surface-900 dark:text-surface-100 mt-0.5">{{ formatDate(auth.user?.staff_detail?.join_date) }}</p>
        </div>
      </div>

      <!-- Status Akun -->
      <div class="flex items-center gap-3.5 px-5 sm:px-6 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/20 transition-colors">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          :class="auth.user?.is_active
            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/20'
            : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20'">
          <CircleCheck v-if="auth.user?.is_active" :size="15" class="text-white" />
          <CircleX v-else :size="15" class="text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Status Akun</p>
          <p class="text-sm font-bold mt-0.5" :class="auth.user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ auth.user?.is_active ? 'Aktif' : 'Nonaktif' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Hash, Award, Building2, Calendar, FileText, CircleCheck, CircleX } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const employmentStatus = computed(() => {
  const status = auth.user?.staff_detail?.employment_status
  if (!status || status === '-') return '-'
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase())
})

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
</script>
