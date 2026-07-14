<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Workspace Divisi</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Pusat operasional masing-masing direktorat/divisi</p>
        </div>
        <button @click="router.push('/workspace/staff')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Users :size="16" />
          Kelola Semua Staff
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users :size="18" class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalStaff }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Staff</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Building2 :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ divisiStore.divisiList.length }}</p>
            <p class="text-xs text-surface-500 font-medium">Departemen</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <UserCheck :size="18" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ activeStaff }}</p>
            <p class="text-xs text-surface-500 font-medium">Staff Aktif</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Crown :size="18" class="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalHeads }}</p>
            <p class="text-xs text-surface-500 font-medium">Kepala Divisi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat data divisi...</p>
    </div>

    <template v-else>
      <!-- Divisi Cards -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-primary-500"></span>
            Daftar Departemen
          </h2>
          <button v-if="selectedDept" @click="selectedDept = ''"
            class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors flex items-center gap-1">
            <X :size="14" />
            Reset Filter
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          <div v-for="(divisi, i) in divisiStore.divisiList" :key="divisi.department"
            @click="selectedDept = selectedDept === divisi.department ? '' : divisi.department"
            class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            :class="selectedDept === divisi.department
              ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20'
              : 'border-surface-200/50 dark:border-surface-700/30'">
            <div class="absolute -inset-x-20 -top-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              :class="divisiGlow(divisiColors[i % divisiColors.length].color)"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                  :class="divisiColors[i % divisiColors.length].bg">
                  {{ divisiInitials(divisi.department) }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{{ divisi.department }}</h3>
                  <p class="text-xs text-surface-500 font-medium">{{ divisi.member_count }} anggota</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs pt-3 border-t border-surface-100/50 dark:border-surface-700/20">
                <span class="text-surface-400 font-medium truncate mr-2">
                  Kepala: {{ divisi.head_name || '-' }}
                </span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Staff List Section -->
      <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-surface-200/50 dark:border-surface-800/30">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="flex items-center gap-2 flex-1">
              <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <span class="w-1 h-4 rounded-full bg-primary-500"></span>
                {{ selectedDept ? `Staff ${selectedDept}` : 'Semua Staff' }}
              </h2>
              <span class="text-[10px] font-medium text-surface-400 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">
                {{ filteredStaffList.length }} orang
              </span>
            </div>
            <div class="flex gap-2">
              <div class="relative flex-1 sm:flex-initial">
                <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input v-model="search" type="text" placeholder="Cari nama atau email..."
                  class="w-full sm:w-64 pl-9 pr-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
              </div>
              <button @click="refreshStaff"
                class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2 shrink-0">
                <RefreshCw :size="16" :class="{ 'animate-spin': staffLoading }" />
                <span class="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Staff Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-50 dark:bg-surface-800/50">
                <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Departemen</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Jabatan</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-100 dark:divide-surface-800/30">
              <tr v-for="s in filteredStaffList" :key="s.id" @click="router.push(`/workspace/staff/${s.id}`)"
                class="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold shrink-0">
                      {{ initials(s.full_name) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ s.full_name }}</p>
                      <p class="text-xs text-surface-400 sm:hidden">{{ s.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">{{ s.email }}</td>
                <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">
                  <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    :class="selectedDept === s.department ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'">
                    {{ s.department || '-' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">{{ s.position || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="s.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                    {{ s.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button @click.stop="router.push(`/workspace/staff/${s.id}`)"
                    class="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all">
                    <Eye :size="14" />
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredStaffList.length && !staffLoading">
                <td colspan="6" class="px-4 py-12 text-center text-sm text-surface-400">
                  <Users :size="32" class="mx-auto text-surface-300 mb-2" />
                  {{ search ? 'Tidak ada staff yang cocok' : 'Tidak ada data staff' }}
                </td>
              </tr>
              <tr v-if="staffLoading">
                <td colspan="6" class="px-4 py-12 text-center text-sm text-surface-400">
                  <div class="flex items-center justify-center gap-2">
                    <div class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    Memuat data staff...
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="card p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-primary-500"></span>
            Aktivitas Terbaru
          </h3>
          <span class="text-[10px] font-medium text-surface-400 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">Real-time</span>
        </div>
        <ActivityFeed :items="activityStore.activities" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Users, Building2, UserCheck, Crown, Search, RefreshCw, Eye, X } from 'lucide-vue-next'
import { useDivisiStore } from '@/stores/divisi'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useWorkspaceActivityStore } from '@/stores/workspaceActivity'
import ActivityFeed from '@/components/ActivityFeed.vue'

const router = useRouter()
const divisiStore = useDivisiStore()
const staffStore = useStaffManagementStore()
const activityStore = useWorkspaceActivityStore()

const loading = ref(true)
const staffLoading = ref(false)
const search = ref('')
const selectedDept = ref('')

const totalStaff = computed(() => staffStore.total || staffStore.staffList.length)
const activeStaff = computed(() => staffStore.staffList.filter(s => s.is_active).length)
const totalHeads = computed(() => divisiStore.divisiList.filter(d => d.head_name).length)

const filteredStaffList = computed(() => {
  let result = staffStore.staffList
  if (selectedDept.value) {
    result = result.filter(s => s.department === selectedDept.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(s =>
      s.full_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    )
  }
  return result
})

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function refreshStaff() {
  staffLoading.value = true
  staffStore.fetchStaff({
    department: selectedDept.value || undefined,
    search: search.value || undefined,
    page: 1,
    size: 50,
  }).finally(() => {
    staffLoading.value = false
  })
}

onMounted(async () => {
  await Promise.all([
    divisiStore.fetchDivisi(),
    activityStore.fetchActivities(),
    staffStore.fetchStaff({ page: 1, size: 50 }),
  ])
  loading.value = false
})

const divisiColors = [
  { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { bg: 'bg-gradient-to-br from-amber-500 to-amber-600', color: 'bg-gradient-to-br from-amber-500 to-amber-600' },
  { bg: 'bg-gradient-to-br from-rose-500 to-rose-600', color: 'bg-gradient-to-br from-rose-500 to-rose-600' },
  { bg: 'bg-gradient-to-br from-violet-500 to-violet-600', color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
]

function divisiInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function divisiGlow(color: string) {
  const glows: Record<string, string> = {
    'bg-gradient-to-br from-blue-500 to-blue-600': 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-emerald-500 to-emerald-600': 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-purple-500 to-purple-600': 'bg-gradient-to-br from-purple-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-amber-500 to-amber-600': 'bg-gradient-to-br from-amber-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-rose-500 to-rose-600': 'bg-gradient-to-br from-rose-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-violet-500 to-violet-600': 'bg-gradient-to-br from-violet-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-cyan-500 to-cyan-600': 'bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent',
    'bg-gradient-to-br from-orange-500 to-orange-600': 'bg-gradient-to-br from-orange-500/10 via-transparent to-transparent',
  }
  return glows[color] || ''
}
</script>
