<template>
  <header class="h-16 lg:h-[72px] bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/30 flex items-center justify-between px-3 sm:px-4 md:px-6 shrink-0 transition-colors duration-300 sticky top-0 z-30">

    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <!-- Hamburger for mobile + desktop (sidebar collapse toggle) -->
      <button
        @click="$emit('toggleSidebar')"
        class="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-all duration-200 shrink-0"
        :title="sidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
      >
        <PanelLeftClose v-if="!sidebarCollapsed" :size="20" class="hidden lg:block" />
        <PanelLeftOpen v-else :size="20" class="hidden lg:block" />
        <Menu :size="20" class="lg:hidden" />
      </button>

      <!-- Page Title -->
      <h2 class="text-sm sm:text-base lg:text-lg font-semibold text-surface-900 dark:text-surface-100 truncate tracking-tight">{{ pageTitle }}</h2>

      <!-- Divisi Filter (admin/direktur only) -->
      <div v-if="auth.hasGlobalAccess" class="relative ml-2" ref="filterRef">
        <button
          @click="toggleFilter"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
        >
          <Building2 :size="14" />
          <span class="truncate max-w-[100px]">{{ deptFilter.departmentLabel }}</span>
          <ChevronDown :size="12" />
        </button>

        <transition name="filter-dropdown">
          <div v-if="showFilter" @click.outside="showFilter = false"
            class="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl shadow-black/5 border border-surface-200 dark:border-surface-700 z-50 py-1 max-h-64 overflow-y-auto">
            <button
              @click="selectDept('')"
              class="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400': deptFilter.showAll }"
            >
              <Globe :size="14" />
              Semua Divisi
            </button>
            <div class="h-px bg-surface-100 dark:bg-surface-800 mx-3" />
            <button
              v-for="dept in deptFilter.departments" :key="dept"
              @click="selectDept(dept)"
              class="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400': deptFilter.activeDepartment === dept }"
            >
              <div class="w-1.5 h-1.5 rounded-full" :class="deptColor(dept)"></div>
              {{ dept }}
            </button>
          </div>
        </transition>
      </div>
    </div>

    <div class="flex items-center gap-1 sm:gap-2">

      <!-- Dark Mode Toggle -->
      <button
        @click="toggleDarkMode"
        class="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 relative overflow-hidden"
      >
        <div class="relative h-5 w-5">
          <Sun :size="20" class="absolute inset-0 transition-all duration-300"
            :class="isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'" />
          <Moon :size="20" class="absolute inset-0 transition-all duration-300"
            :class="isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'" />
        </div>
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button
          @click="showNotif = !showNotif"
          class="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 relative"
        >
          <Bell :size="20" />
          <span v-if="notifStore.unreadCount" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-950" />
        </button>

        <!-- Notification Dropdown -->
        <transition name="notif-dropdown">
          <div v-if="showNotif" @click.outside="showNotif = false"
            class="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-10 left-2 sm:left-auto w-auto sm:w-80 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-surface-200/50 dark:border-surface-800/30 z-50 max-h-[70vh] sm:max-h-96 overflow-y-auto">
            <div class="sticky top-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-4 border-b border-surface-200/50 dark:border-surface-800/30 flex items-center justify-between rounded-t-2xl">
              <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Notifikasi</h3>
              <button v-if="notifStore.unreadCount" @click="notifStore.markAllAsRead()" class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">Tandai semua dibaca</button>
            </div>
            <div v-for="n in notifStore.notifications" :key="n.id"
              @click="notifStore.markAsRead(n.id)"
              class="px-4 py-3 border-b border-surface-100/50 dark:border-surface-800/20 hover:bg-surface-50 dark:hover:bg-surface-800/30 cursor-pointer transition-colors last:border-0"
              :class="{ 'bg-primary-50/50 dark:bg-primary-950/10': !n.read }">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="notifBg(n.type)">
                  <component :is="notifIcon(n.type)" :size="16" :class="notifColor(n.type)" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ n.title }}</p>
                  <p class="text-xs text-surface-500 mt-0.5 line-clamp-2">{{ n.message }}</p>
                  <p class="text-[10px] text-surface-400 mt-1.5 font-medium">{{ formatTime(n.createdAt) }}</p>
                </div>
              </div>
            </div>
            <div v-if="!notifStore.notifications?.length" class="p-8 text-center">
              <Bell :size="24" class="mx-auto text-surface-300 mb-2" />
              <p class="text-sm text-surface-400">Belum ada notifikasi</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- User Profile -->
      <RouterLink to="/profile" class="flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-surface-200/50 dark:border-surface-800/30 hover:bg-surface-50 dark:hover:bg-surface-800/50 -mr-3 sm:-mr-4 px-3 sm:px-4 py-2 transition-colors rounded-l-xl">
        <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold ring-2 ring-white dark:ring-surface-950 shadow-sm shrink-0">
          <img v-if="auth.user?.profile?.avatar_url" :src="auth.user.profile.avatar_url" class="w-full h-full object-cover" />
          <span v-else>{{ displayName.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="hidden sm:block min-w-0">
          <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate max-w-[140px] lg:max-w-[180px]">{{ displayName }}</p>
          <p class="text-[11px] font-medium text-surface-400 dark:text-surface-500 capitalize truncate">{{ auth.pillar === 'staff' ? 'Staff' : auth.pillar }}</p>
        </div>
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Info, AlertTriangle, CheckCircle, XCircle, Sun, Moon, Menu, PanelLeftClose, PanelLeftOpen, Building2, ChevronDown, Globe } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useDepartmentFilterStore } from '@/stores/departmentFilter'
import { useNotificationStore } from '@/stores/notification'

defineProps<{ sidebarCollapsed?: boolean }>()
defineEmits<{ toggleSidebar: [] }>()

const auth = useAuthStore()
const deptFilter = useDepartmentFilterStore()
const notifStore = useNotificationStore()
const route = useRoute()
const showNotif = ref(false)
const showFilter = ref(false)

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  if (auth.hasGlobalAccess) {
    deptFilter.fetchDepartments()
  }
})

function toggleFilter() {
  showFilter.value = !showFilter.value
}

function selectDept(dept: string) {
  deptFilter.setDepartment(dept)
  showFilter.value = false
}

const deptColors: Record<string, string> = {
  Teknologi: 'bg-blue-500',
  Akademik: 'bg-green-500',
  SDM: 'bg-purple-500',
  Keuangan: 'bg-yellow-500',
  Marketing: 'bg-pink-500',
  Pemasaran: 'bg-orange-500',
  Operasional: 'bg-teal-500',
  'Hubungan Industri': 'bg-indigo-500',
  Eksekutif: 'bg-red-500',
}

function deptColor(dept: string) {
  return deptColors[dept] || 'bg-surface-500'
}

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks': 'Task Management',
  '/kpi': 'KPI Monitoring',
  '/roadmap': 'Roadmap',
  '/workspace': 'Workspace Divisi',
  '/documents': 'Document Center',
  '/meetings': 'Meeting',
  '/notes': 'Notes',
  '/achievements': 'Achievements',
  '/keuangan': 'Keuangan',
  '/settings': 'Pengaturan',
}

const displayName = computed(() =>
  auth.user?.profile?.full_name || auth.user?.name || auth.user?.email?.split('@')[0] || 'Staff'
)

const pageTitle = computed(() => {
  const base = pageTitles[route.path] || 'AKMAN Internal Workspace'
  const dept = deptFilter.effectiveDepartment
  return dept ? `${base} | ${dept}` : base
})

function notifIcon(type: string) {
  const icons: Record<string, any> = { info: Info, warning: AlertTriangle, success: CheckCircle, error: XCircle }
  return icons[type] || Info
}

function notifColor(type: string) {
  const colors: Record<string, string> = { info: 'text-blue-500', warning: 'text-yellow-500', success: 'text-green-500', error: 'text-red-500' }
  return colors[type] || 'text-surface-500'
}

function notifBg(type: string) {
  const bgs: Record<string, string> = { info: 'bg-blue-100 dark:bg-blue-900/30', warning: 'bg-yellow-100 dark:bg-yellow-900/30', success: 'bg-green-100 dark:bg-green-900/30', error: 'bg-red-100 dark:bg-red-900/30' }
  return bgs[type] || 'bg-surface-100 dark:bg-surface-800'
}

function formatTime(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.notif-dropdown-enter-active,
.notif-dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.notif-dropdown-enter-from,
.notif-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.filter-dropdown-enter-active,
.filter-dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.filter-dropdown-enter-from,
.filter-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
