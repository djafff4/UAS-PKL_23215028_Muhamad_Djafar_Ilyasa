<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-cyan-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Manajemen Peserta</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola data peserta pelatihan AKMAN Academy</p>
        </div>
        <div class="flex gap-2">
          <button @click="exportCsv" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
            <Download :size="16" />
            Export
          </button>
          <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
            <Plus :size="16" />
            Tambah Peserta
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <Users :size="18" class="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.participantsByRole.length }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Peserta</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <UserCheck :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ activeParticipants }}</p>
            <p class="text-xs text-surface-500 font-medium">Aktif</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <GraduationCap :size="18" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalCompletedClasses }}</p>
            <p class="text-xs text-surface-500 font-medium">Kelas Selesai</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <BookOpen :size="18" class="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ totalEnrolledClasses }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Enroll</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="searchRole" type="text" placeholder="Cari nama, email, atau telepon..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
      <button @click="store.fetchParticipantsByRole()" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
        <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
      </button>
    </div>

    <!-- Participants Table -->
    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-50 dark:bg-surface-800/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Kontak</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Lokasi</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Pendidikan</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Kelas</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100/50 dark:divide-surface-800/30">
            <tr v-for="p in filteredParticipantsByRole" :key="p.user_id"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {{ initials(p.full_name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-surface-900 dark:text-surface-100 truncate">{{ p.full_name }}</p>
                    <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span class="text-xs text-surface-400">{{ p.akman_id }}</span>
                      <span v-for="role in parseAddonRoles(p.addon_roles, p.addon_role_labels)" :key="role.name"
                        class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold"
                        :class="addonRoleBadge(role.name)">
                        {{ role.label }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <p class="text-surface-600 dark:text-surface-400 truncate max-w-[200px]">{{ p.email }}</p>
                <p class="text-xs text-surface-400">{{ p.phone || '-' }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <p class="text-surface-600 dark:text-surface-400">{{ p.city || '-' }}</p>
                <p class="text-xs text-surface-400">{{ p.province || '-' }}</p>
              </td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <span class="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                  {{ p.education_level || '-' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ p.enrolled_classes }}</span>
                  <span v-if="p.completed_classes > 0" class="text-xs text-emerald-600 dark:text-emerald-400">
                    ({{ p.completed_classes }} selesai)
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="p.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                  {{ p.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!filteredParticipantsByRole.length && !store.loading"
        class="p-12 text-center">
        <Users :size="40" class="mx-auto text-surface-300 mb-3" />
        <p class="text-sm font-semibold text-surface-500">{{ searchRole ? 'Tidak ada peserta yang cocok' : 'Belum ada peserta' }}</p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="text-center py-12">
        <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm text-surface-400">Memuat peserta...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Users, UserCheck, Download, GraduationCap, BookOpen } from 'lucide-vue-next'
import { useParticipantStore } from '@/stores/participants'
import { useToast } from '@/composables/useToast'

const store = useParticipantStore()
const toast = useToast()

const searchRole = ref('')
const showCreateModal = ref(false)

const filteredParticipantsByRole = computed(() => {
  if (!searchRole.value) return store.participantsByRole
  const s = searchRole.value.toLowerCase()
  return store.participantsByRole.filter(p =>
    p.full_name.toLowerCase().includes(s) ||
    p.email.toLowerCase().includes(s) ||
    p.phone.toLowerCase().includes(s)
  )
})

const activeParticipants = computed(() => store.participantsByRole.filter(p => p.is_active).length)
const totalCompletedClasses = computed(() => store.participantsByRole.reduce((sum, p) => sum + p.completed_classes, 0))
const totalEnrolledClasses = computed(() => store.participantsByRole.reduce((sum, p) => sum + p.enrolled_classes, 0))

onMounted(() => {
  store.fetchParticipantsByRole()
})

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function addonRoleBadge(role: string) {
  const badges: Record<string, string> = {
    peserta_reguler: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    peserta_personal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    peserta_mentoring: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return badges[role] || 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
}

function parseAddonRoles(names: string, labels: string) {
  if (!names) return []
  const nameArr = names.split(',')
  const labelArr = labels ? labels.split(',') : nameArr
  return nameArr.map((name, i) => ({ name, label: labelArr[i] || name }))
}

function exportCsv() {
  toast.success('Export', 'Fitur export akan segera tersedia')
}
</script>
