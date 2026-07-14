<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="router.push('/workspace/staff')"
      class="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
      <ArrowLeft :size="16" />
      Kembali
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat data staff...</p>
    </div>

    <template v-if="!loading && detail">
      <!-- Page Header -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-surface-900 p-5 sm:p-6">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none"
          style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;">
        </div>
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-[60px]"></div>
        <div class="relative z-10 flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl font-bold">
            {{ initials(detail.full_name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{{ detail.full_name }}</h1>
            <p class="text-sm text-white/60 font-medium">{{ detail.position || '-' }} • {{ detail.department || '-' }}</p>
          </div>
          <span class="inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0"
            :class="detail.is_active ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-400/20 text-red-300'">
            {{ detail.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-surface-200 dark:border-surface-700 -mb-px">
        <nav class="flex gap-6 overflow-x-auto" role="tablist">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === tab.key
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'"
            role="tab" :aria-selected="activeTab === tab.key">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <StaffDetailSection v-if="activeTab === 'detail'" :staff-id="id" :departments="departments" :all-staff="allStaff" />
      <StaffRoleSection v-if="activeTab === 'role'" :staff-id="id" :available-roles="availableRoles" />
      <StaffLettersSection v-if="activeTab === 'letters'" :staff-id="id" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useStaffManagementStore } from '@/stores/staffManagement'
import StaffDetailSection from '@/components/staff/StaffDetailSection.vue'
import StaffRoleSection from '@/components/staff/StaffRoleSection.vue'
import StaffLettersSection from '@/components/staff/StaffLettersSection.vue'

const router = useRouter()
const route = useRoute()
const store = useStaffManagementStore()

const id = route.params.id as string
const detail = computed(() => store.staffDetail)
const loading = ref(true)
const departments = ref<string[]>([])
const availableRoles = ref<any[]>([])
const allStaff = ref<any[]>([])

// ── Tab Navigation ──
const tabs = [
  { key: 'detail', label: 'Detail Staff' },
  { key: 'role', label: 'Role & Akses' },
  { key: 'letters', label: 'Dokumen HRD' },
]
const activeTab = ref('detail')

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

onMounted(async () => {
  await Promise.all([
    store.fetchStaffDetail(id),
    store.fetchDepartments(),
    store.fetchRoles(),
  ])
  departments.value = await store.fetchDepartments()
  const roles = await store.fetchRoles()
  availableRoles.value = roles.filter((r: any) => r.name !== 'student')

  await store.fetchStaff({ size: 100 })
  allStaff.value = [...store.staffList]
  loading.value = false
})
</script>
