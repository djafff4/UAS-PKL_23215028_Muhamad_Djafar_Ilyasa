<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-[60px]"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Manajemen Staff</h1>
        <p class="text-sm text-white/60 mt-1 font-medium">Kelola data staff, jabatan, dan peran akses</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input v-model="search" type="text" placeholder="Cari nama, email, atau telepon..."
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
            @input="debouncedSearch" />
        </div>
        <select v-model="deptFilter"
          class="px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all min-w-[160px]">
          <option value="">Semua Departemen</option>
          <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
        </select>
        <button @click="refresh"
          class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
          <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-50 dark:bg-surface-800/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Departemen</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Jabatan</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Role</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800/30">
            <tr v-for="s in store.staffList" :key="s.id" @click="router.push(`/workspace/staff/${s.id}`)"
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
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">{{ s.department || '-' }}</td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">{{ s.position || '-' }}</td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="r in s.roles" :key="r"
                    class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                    :class="r === 'staff' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'">
                    {{ r }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="s.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                  {{ s.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button v-if="auth.canManageStaff" @click.stop="router.push(`/workspace/staff/${s.id}`)"
                  class="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all">
                  <Eye :size="14" />
                </button>
              </td>
            </tr>
            <tr v-if="!store.staffList.length && !loading">
              <td colspan="7" class="px-4 py-12 text-center text-sm text-surface-400">
                <Users :size="32" class="mx-auto text-surface-300 mb-2" />
                Tidak ada data staff
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-12 text-center text-sm text-surface-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  Memuat data...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="store.total > store.size" class="flex items-center justify-between px-4 py-3 border-t border-surface-200/50 dark:border-surface-800/30">
        <p class="text-xs text-surface-400">
          {{ (store.page - 1) * store.size + 1 }}-{{ Math.min(store.page * store.size, store.total) }} dari {{ store.total }}
        </p>
        <div class="flex gap-1">
          <button @click="changePage(store.page - 1)" :disabled="store.page <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="store.page <= 1 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800'">
            Prev
          </button>
          <button @click="changePage(store.page + 1)" :disabled="store.page * store.size >= store.total"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="store.page * store.size >= store.total ? 'text-surface-300 cursor-not-allowed' : 'text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800'">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshCw, Eye, Users } from 'lucide-vue-next'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const store = useStaffManagementStore()
const auth = useAuthStore()

const search = ref('')
const deptFilter = ref('')
const departments = ref<string[]>([])
const loading = ref(false)

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}

function refresh() {
  store.fetchStaff({
    search: search.value || undefined,
    department: deptFilter.value || undefined,
    page: 1,
    size: 20,
  })
}

function changePage(p: number) {
  store.fetchStaff({
    search: search.value || undefined,
    department: deptFilter.value || undefined,
    page: p,
    size: 20,
  })
}

watch(deptFilter, () => refresh())

onMounted(async () => {
  loading.value = true
  store.fetchStaff({ page: 1, size: 20 })
  departments.value = await store.fetchDepartments()
  loading.value = false
})
</script>
