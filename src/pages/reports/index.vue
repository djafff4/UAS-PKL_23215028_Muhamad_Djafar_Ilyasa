<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Laporan & Analytics</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Dashboard analitik operasional AKMAN Academy</p>
        </div>
        <button @click="refreshAll" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
          Refresh
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400">Memuat laporan...</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <Users :size="14" class="text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.participants?.active || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Peserta Aktif</p>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen :size="14" class="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.programs?.published || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Program Aktif</p>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <UserCog :size="14" class="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.instructors?.active || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Instruktur</p>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Briefcase :size="14" class="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.corporate?.active || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Klien Corporate</p>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CheckSquare :size="14" class="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.tasks?.completed || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Task Selesai</p>
        </div>
        <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <CalendarDays :size="14" class="text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-surface-900 dark:text-surface-100">{{ store.dashboardStats?.meetings?.upcoming || 0 }}</p>
          <p class="text-[10px] text-surface-400 font-medium">Meeting Mendatang</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-violet-500"></span>
            Enrollment per Program
          </h3>
          <div v-if="store.enrollmentReport.length" class="space-y-3">
            <div v-for="item in store.enrollmentReport.slice(0, 5)" :key="item.program_name"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{{ item.program_name }}</p>
                <p class="text-xs text-surface-400">{{ item.enrolled }} terdaftar</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-700"
                    :style="{ width: (item.completed / (item.enrolled || 1) * 100) + '%' }"></div>
                </div>
                <span class="text-xs font-semibold text-surface-500 w-12 text-right">{{ Math.round(item.completed / (item.enrolled || 1) * 100) }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <BookOpen :size="24" class="mx-auto text-surface-300 mb-2" />
            <p class="text-xs text-surface-400">Belum ada data enrollment</p>
          </div>
        </div>

        <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
            Sertifikasi per Standar
          </h3>
          <div v-if="store.certificationReport.length" class="space-y-3">
            <div v-for="item in store.certificationReport.slice(0, 5)" :key="item.standard_type + item.issuer"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="standardBadge(item.standard_type)">
                  <Award :size="16" />
                </div>
                <div>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ item.issuer }}</p>
                  <p class="text-xs text-surface-400">{{ item.standard_type }}</p>
                </div>
              </div>
              <span class="text-lg font-bold text-surface-900 dark:text-surface-100">{{ item.count }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Award :size="24" class="mx-auto text-surface-300 mb-2" />
            <p class="text-xs text-surface-400">Belum ada data sertifikasi</p>
          </div>
        </div>

        <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-amber-500"></span>
            Penempatan per Negara
          </h3>
          <div v-if="store.placementReport.length" class="space-y-3">
            <div v-for="item in store.placementReport" :key="item.country"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-xs font-bold">
                  {{ item.country.slice(0, 2).toUpperCase() }}
                </div>
                <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ item.country }}</p>
              </div>
              <span class="text-lg font-bold text-surface-900 dark:text-surface-100">{{ item.count }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Globe :size="24" class="mx-auto text-surface-300 mb-2" />
            <p class="text-xs text-surface-400">Belum ada data penempatan</p>
          </div>
        </div>

        <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-blue-500"></span>
            Revenue Trend (12 Bulan)
          </h3>
          <div v-if="store.revenueReport.length" class="space-y-2">
            <div v-for="item in store.revenueReport.slice(0, 6)" :key="item.period"
              class="flex items-center gap-3 text-xs">
              <span class="text-surface-400 w-16">{{ item.period }}</span>
              <div class="flex-1 flex items-center gap-1">
                <div class="h-2 rounded-full bg-emerald-500" :style="{ width: (item.income / maxRevenue * 100) + '%' }"></div>
                <span class="text-emerald-600 font-medium">{{ formatShortCurrency(item.income) }}</span>
              </div>
              <div class="flex-1 flex items-center gap-1">
                <div class="h-2 rounded-full bg-red-500" :style="{ width: (item.expense / maxRevenue * 100) + '%' }"></div>
                <span class="text-red-600 font-medium">{{ formatShortCurrency(item.expense) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <BarChart3 :size="24" class="mx-auto text-surface-300 mb-2" />
            <p class="text-xs text-surface-400">Belum ada data revenue</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RefreshCw, Users, BookOpen, UserCog, Briefcase, CheckSquare, CalendarDays, Award, Globe, BarChart3 } from 'lucide-vue-next'
import { useReportStore } from '@/stores/reports'

const store = useReportStore()

onMounted(() => {
  store.fetchAllReports()
})

function refreshAll() {
  store.fetchAllReports()
}

const maxRevenue = computed(() => {
  const maxIncome = Math.max(...store.revenueReport.map(r => r.income), 1)
  const maxExpense = Math.max(...store.revenueReport.map(r => r.expense), 1)
  return Math.max(maxIncome, maxExpense)
})

function formatShortCurrency(amount: number) {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'M'
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'jt'
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'rb'
  return amount.toString()
}

function standardBadge(type: string) {
  const badges: Record<string, string> = {
    SKKNI: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    SKKI: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    INTERNATIONAL: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return badges[type] || 'bg-surface-100 text-surface-600'
}
</script>
