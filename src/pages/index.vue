<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- ===== HEADER ===== -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-5 sm:p-8">
      <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-[60px]"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-400/10 blur-[40px]"></div>

      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5 mb-2.5">
            <div class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">{{ greeting }}</span>
            <span v-if="positionBadge" class="text-[10px] font-semibold text-primary-200 bg-white/10 px-2 py-0.5 rounded-md">{{ positionBadge }}</span>
            <span v-if="auth.userDepartment && !auth.isDirut" class="text-[10px] font-semibold text-primary-200 bg-white/10 px-2 py-0.5 rounded-md">{{ auth.userDepartment }}</span>
          </div>
          <h1 class="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
            Selamat Datang, <span class="text-primary-200">{{ displayName }}</span>
          </h1>
          <p class="text-xs sm:text-sm text-white/60 mt-1 font-medium">
            {{ timeMessage }}
          </p>
        </div>
        <div class="text-right shrink-0 flex flex-col items-end gap-2">
          <p class="text-xs sm:text-sm font-semibold text-white/90">{{ todayDate }}</p>
          <!-- Date Filter -->
          <DateFilter v-model="dateFilter" />
        </div>
      </div>
    </div>

    <!-- ===== STATS CARDS ===== -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <!-- Total Task -->
      <StatCard
        :icon="CheckSquare"
        :iconBg="'bg-primary-500/10'"
        :iconColor="'text-primary-600 dark:text-primary-400'"
        label="Total Task"
        :value="taskStore.taskStats.total > 0 ? String(taskStore.taskStats.total) : 'Belum ada'"
        :valueMuted="taskStore.taskStats.total === 0"
      />
      <!-- KPI On Track -->
      <StatCard
        v-if="auth.isDirekturOrKepala"
        :icon="BarChart3"
        :iconBg="'bg-emerald-500/10'"
        :iconColor="'text-emerald-600 dark:text-emerald-400'"
        label="KPI On Track"
        :value="kpiStore.kpiStats.onTrack > 0 ? String(kpiStore.kpiStats.onTrack) : 'Belum ada'"
        :valueMuted="kpiStore.kpiStats.onTrack === 0"
        :trend="12"
      />
      <!-- Progress Roadmap -->
      <RouterLink v-if="auth.canManageRoadmap" to="/roadmap" class="group relative overflow-hidden rounded-2xl border border-surface-200/50 dark:border-surface-700/30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200/50 dark:hover:border-primary-800/30 hover:-translate-y-0.5 block">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Map :size="20" class="md:w-[22px] md:h-[22px]" />
            </div>
            <span v-if="roadmapProgressTrend > 0" class="inline-flex items-center gap-0.5 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30">
              <TrendingUp :size="10" />
              {{ roadmapProgressTrend }}%
            </span>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">{{ roadmapProgress }}%</p>
          <p class="text-xs md:text-sm text-surface-400 dark:text-surface-500 mt-1 font-medium">Progress Roadmap</p>
          <!-- Progress bar -->
          <div class="mt-3 w-full h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700" :style="{ width: roadmapProgress + '%' }"></div>
          </div>
          <!-- Link indicator -->
          <div class="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Lihat detail
            <ArrowRight :size="10" class="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </RouterLink>
      <!-- Staff Aktif -->
      <StatCard
        v-if="auth.isDirekturOrKepala"
        :icon="Users"
        :iconBg="'bg-violet-500/10'"
        :iconColor="'text-violet-600 dark:text-violet-400'"
        label="Staff Aktif"
        :value="activeStaffCount > 0 ? String(activeStaffCount) : 'Belum ada'"
        :valueMuted="activeStaffCount === 0"
      />
    </div>

    <!-- ===== MAIN GRID: Activity + Task Overview ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Activity Feed (2/3) -->
      <div class="lg:col-span-2 card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-primary-500"></span>
            Aktivitas Terbaru
          </h3>
          <span class="text-[10px] font-medium text-surface-400 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center gap-1">
            <span v-if="activityStore.loading" class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span v-else class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ activityStore.loading ? 'Memperbarui...' : 'Live' }}
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="activityStore.loading && !activityStore.activities.length" class="flex items-center justify-center py-8">
          <Loader2 :size="24" class="animate-spin text-primary-500" />
        </div>
        <!-- Empty State -->
        <DashboardEmptyState
          v-else-if="!activityStore.activities.length"
          title="Belum ada aktivitas"
          message="Tenang saja! Belum ada aktivitas hari ini. Mulai dengan membuat task baru atau cek jadwal meeting."
          :actions="quickActions"
          compact
        />
        <!-- Activity Feed -->
        <ActivityFeed v-else :items="activityStore.activities" />
      </div>

      <!-- Task Overview (1/3) -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-primary-500"></span>
            Task Overview
          </h3>
          <RouterLink to="/tasks" class="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">Lihat semua</RouterLink>
        </div>

        <!-- Empty state -->
        <DashboardEmptyState
          v-if="taskStore.taskStats.total === 0"
          title="Belum ada task"
          message="Belum ada task yang ditugaskan. Buat task baru untuk memulai!"
          :actions="[{ label: '+ Buat Task', to: '/tasks', icon: Plus, primary: true }]"
          compact
        />
        <!-- Task breakdown -->
        <div v-else class="space-y-2">
          <div v-for="(count, status) in taskStatsFiltered" :key="status"
            class="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
            <div class="flex items-center gap-2.5">
              <div class="w-2 h-2 rounded-full" :class="statusColor(status)"></div>
              <span class="text-sm font-medium text-surface-600 dark:text-surface-400">{{ statusLabels[status] || status }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ count }}</span>
              <div class="w-16 h-1.5 rounded-full overflow-hidden bg-surface-200 dark:bg-surface-700">
                <div class="h-full rounded-full transition-all duration-500"
                  :class="statusColor(status)"
                  :style="{ width: (count / taskStore.taskStats.total * 100) + '%' }">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
          <RouterLink to="/tasks"
            class="flex items-center justify-between p-3 rounded-xl bg-primary-50/50 dark:bg-primary-950/10 hover:bg-primary-100/50 dark:hover:bg-primary-950/20 transition-colors group">
            <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">Kelola Task</span>
            <ArrowRight :size="16" class="text-primary-500 transition-transform group-hover:translate-x-1" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- ===== BOTTOM GRID: KPI + Notifications ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- KPI per Divisi -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
            KPI per Divisi
          </h3>
          <RouterLink to="/kpi" class="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">Detail</RouterLink>
        </div>

        <!-- Empty state -->
        <DashboardEmptyState
          v-if="!Object.keys(filteredKpiByDivisi).length"
          title="Belum ada KPI"
          message="Belum ada indikator KPI yang dicatat. Pantau performa divisi dengan menambahkan KPI."
          :actions="[{ label: '+ Tambah KPI', to: '/kpi', icon: Plus, primary: true }]"
          compact
        />

        <!-- With data -->
        <template v-else>
          <!-- Donut Chart summary -->
          <div class="flex flex-col sm:flex-row items-center gap-6 mb-4">
            <DonutChart
              :segments="kpiDonutSegments"
              :size="140"
              :strokeWidth="24"
              :centerText="kpiStore.kpiStats.total + ' Total'"
            />
            <div class="space-y-2 text-center sm:text-left">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-sm text-surface-600 dark:text-surface-400">On Track: <strong class="text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.onTrack }}</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span class="text-sm text-surface-600 dark:text-surface-400">Need Attention: <strong class="text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.needAttention }}</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span class="text-sm text-surface-600 dark:text-surface-400">Behind: <strong class="text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.behind }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Divisi breakdown -->
          <div class="space-y-3">
            <div v-for="(kpis, divisi) in filteredKpiByDivisi" :key="divisi"
              class="p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ divisi }}</span>
                <span class="text-xs font-medium text-surface-400">
                  <span class="text-emerald-600 dark:text-emerald-400">{{ kpis.filter((k: any) => k.status === 'ON_TRACK').length }}</span>
                  /{{ kpis.length }} on track
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                  :style="{ width: (kpis.filter((k: any) => k.status === 'ON_TRACK').length / kpis.length * 100) + '%' }">
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Notifications / Suggestions -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full" :class="notifStore.notifications.length ? 'bg-amber-500' : 'bg-primary-500'"></span>
            {{ notifStore.notifications.length ? 'Notifikasi' : 'Saran Hari Ini' }}
          </h3>
          <button v-if="notifStore.unreadCount" @click="notifStore.markAllAsRead()"
            class="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">Tandai dibaca</button>
        </div>

        <!-- Notifications -->
        <div v-if="notifStore.notifications.length" class="space-y-1">
          <div v-for="n in notifStore.notifications.slice(0, 5)" :key="n.id"
            @click="notifStore.markAsRead(n.id)"
            class="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
            :class="n.read
              ? 'hover:bg-surface-50 dark:hover:bg-surface-800/30'
              : 'bg-primary-50/50 dark:bg-primary-950/10 hover:bg-primary-100/50 dark:hover:bg-primary-950/20'">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="notifBg(n.type)">
              <component :is="notifIcon(n.type)" :size="15" :class="notifColor(n.type)" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ n.title }}</p>
                <span v-if="!n.read" class="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5"></span>
              </div>
              <p class="text-xs text-surface-500 mt-0.5 line-clamp-1">{{ n.message }}</p>
              <p class="text-[10px] text-surface-400 mt-1 font-medium">{{ formatTimeNotif(n.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Suggestions Widget (when no notifications) -->
        <div v-else class="space-y-2.5">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.title"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group cursor-pointer"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              :class="suggestion.bg">
              <component :is="suggestion.icon" :size="15" :class="suggestion.color" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ suggestion.title }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ suggestion.description }}</p>
            </div>
            <RouterLink :to="suggestion.to" class="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              Lihat
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  CheckSquare, BarChart3, Map, Users, ArrowRight,
  Info, AlertTriangle, CheckCircle, XCircle,
  Plus, Calendar, Lightbulb, ListChecks, Target, TrendingUp,
  Loader2
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useKpiStore } from '@/stores/kpi'
import { useNotificationStore } from '@/stores/notification'
import { useWorkspaceActivityStore } from '@/stores/workspaceActivity'
import { useRoadmapStore } from '@/stores/roadmap'
import { useStaffManagementStore } from '@/stores/staffManagement'
import StatCard from '@/components/StatCard.vue'
import ActivityFeed from '@/components/ActivityFeed.vue'
import DashboardEmptyState from '@/components/DashboardEmptyState.vue'
import DonutChart from '@/components/DonutChart.vue'
import type { DonutSegment } from '@/types'
import DateFilter from '@/components/DateFilter.vue'

const auth = useAuthStore()
const taskStore = useTaskStore()
const kpiStore = useKpiStore()
const notifStore = useNotificationStore()
const activityStore = useWorkspaceActivityStore()
const roadmapStore = useRoadmapStore()
const staffStore = useStaffManagementStore()

const dateFilter = ref<'hari_ini' | 'minggu_ini' | 'bulan_ini'>('hari_ini')

// Polling intervals
let activityPollInterval: ReturnType<typeof setInterval> | null = null
let notifPollInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  activityStore.fetchActivities(dateFilter.value)
  roadmapStore.fetchRoadmaps()
  staffStore.fetchStaff()

  // Poll activities every 30 seconds
  activityPollInterval = setInterval(() => {
    activityStore.fetchActivities(dateFilter.value)
  }, 30000)

  // Poll notifications every 60 seconds
  notifPollInterval = setInterval(() => {
    notifStore.fetchNotifications()
  }, 60000)
})

onUnmounted(() => {
  if (activityPollInterval) clearInterval(activityPollInterval)
  if (notifPollInterval) clearInterval(notifPollInterval)
})

// Watch dateFilter changes
watch(dateFilter, (newVal) => {
  activityStore.fetchActivities(newVal)
})

// ── Computed ──

const displayName = computed(() =>
  auth.user?.profile?.full_name || auth.user?.name || auth.user?.email?.split('@')[0] || 'Staff'
)

const positionBadge = computed(() => {
  if (auth.isDirut) return 'Direktur Utama'
  if (auth.isDirekturTeknologi) return 'Direktur Teknologi'
  if (auth.isKepalaDivisi) return `Kepala ${auth.userDepartment}`
  if (auth.userPosition) return auth.userPosition
  return ''
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 11 ? 'PAGI' : hour < 15 ? 'SIANG' : hour < 18 ? 'SORE' : 'MALAM'
})

const timeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Semangat memulai hari! Ada beberapa task yang perlu perhatian Anda.'
  if (hour < 15) return 'Produktif siang hari ini. Jangan lupa istirahat dan makan siang.'
  if (hour < 18) return 'Sore hari yang sibuk. Cek progress task sebelum pulang.'
  return 'Malam yang tenang. Manfaatkan waktu untuk review pekerjaan.'
})

const todayDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  progress: 'Progress',
  review: 'Review',
  done: 'Done',
  cancelled: 'Cancelled',
}

const taskStatsFiltered = computed(() => {
  const { total, ...rest } = taskStore.taskStats
  return rest
})

const quickActions = computed(() => {
  const actions = [
    { label: '+ Buat Task Baru', to: '/tasks', icon: Plus, primary: true },
    { label: 'Lihat Kalender', to: '/events', icon: Calendar, primary: false },
  ]

  if (auth.canManageStaff) {
    actions.push({ label: '+ Tambah Anggota', to: '/workspace/staff', icon: Users, primary: false })
    actions.push({ label: 'Kelola Staff', to: '/workspace/staff', icon: Users, primary: false })
  } else if (auth.isDirekturOrKepala) {
    actions.push({ label: 'Lihat Staff Divisi', to: '/workspace', icon: Users, primary: false })
  }

  return actions
})

const suggestions = [
  { title: 'Cek progress task', description: 'Task yang mendekati deadline perlu perhatian', to: '/tasks', icon: ListChecks, bg: 'bg-primary-100 dark:bg-primary-900/30', color: 'text-primary-600 dark:text-primary-400' },
  { title: 'Review KPI minggu ini', description: 'Pantau pencapaian target divisi', to: '/kpi', icon: Target, bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
  { title: 'Rencanakan meeting', description: 'Jadwalkan agenda dengan tim', to: '/meetings', icon: Calendar, bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
  { title: 'Buat catatan baru', description: 'Catat ide dan hal penting', to: '/notes', icon: Lightbulb, bg: 'bg-violet-100 dark:bg-violet-900/30', color: 'text-violet-600 dark:text-violet-400' },
]

// ── Roadmap Progress ──

const roadmapProgress = computed(() => {
  const roadmaps = roadmapStore.roadmaps
  if (!roadmaps.length) return 0
  const total = roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0)
  return Math.round(total / roadmaps.length)
})

const roadmapProgressTrend = computed(() => {
  // Simple trend calculation based on completed vs total
  const roadmaps = roadmapStore.roadmaps
  if (!roadmaps.length) return 0
  const completed = roadmaps.filter(r => r.status === 'COMPLETED').length
  return Math.round((completed / roadmaps.length) * 100)
})

// ── Active Staff Count ──

const activeStaffCount = computed(() => {
  return staffStore.staffList.filter((s: any) => s.is_active !== false).length
})

const filteredKpiByDivisi = computed(() => {
  if (auth.canViewAllDivisions) return kpiStore.kpiByDivisi
  if (!auth.userDepartment) return {}
  const dept = auth.userDepartment
  const entry = Object.entries(kpiStore.kpiByDivisi).find(([key]) =>
    key.toLowerCase() === dept.toLowerCase()
  )
  return entry ? { [entry[0]]: entry[1] } : {}
})

// ── KPI Donut Chart ──

const kpiDonutSegments = computed((): DonutSegment[] => {
  const stats = kpiStore.kpiStats
  const total = stats.total || 1
  return [
    { label: 'On Track', value: stats.onTrack, color: '#10b981', percentage: (stats.onTrack / total) * 100 },
    { label: 'Need Attention', value: stats.needAttention, color: '#f59e0b', percentage: (stats.needAttention / total) * 100 },
    { label: 'Behind', value: stats.behind, color: '#ef4444', percentage: (stats.behind / total) * 100 },
  ].filter(s => s.value > 0)
})

// ── Helpers ──

function statusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    progress: 'bg-blue-500',
    review: 'bg-purple-500',
    done: 'bg-green-500',
    cancelled: 'bg-red-500',
  }
  return colors[status] || 'bg-surface-500'
}

function notifIcon(type: string) {
  const icons: Record<string, any> = { info: Info, warning: AlertTriangle, success: CheckCircle, error: XCircle }
  return icons[type] || Info
}

function notifColor(type: string) {
  const colors: Record<string, string> = {
    info: 'text-blue-500', warning: 'text-yellow-500', success: 'text-green-500', error: 'text-red-500'
  }
  return colors[type] || 'text-surface-500'
}

function notifBg(type: string) {
  const bgs: Record<string, string> = {
    info: 'bg-blue-100 dark:bg-blue-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
  }
  return bgs[type] || 'bg-surface-100 dark:bg-surface-800'
}

function formatTimeNotif(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>
