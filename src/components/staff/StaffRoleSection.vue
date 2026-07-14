<template>
  <div
    class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
    <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
      <span class="w-1 h-4 rounded-full bg-amber-500"></span>
      Role & Akses
    </h3>
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <span v-for="r in detail.roles" :key="r"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          :class="r === 'staff' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'">
          {{ r }}
          <button v-if="auth.canManageStaff && r !== 'staff'" @click="removeRole(r)"
            class="hover:text-red-500 transition-colors">
            <X :size="12" />
          </button>
        </span>
        <span v-if="!detail.roles.length" class="text-xs text-surface-400">Tidak ada role</span>
      </div>
      <div v-if="auth.canManageStaff" class="flex gap-2">
        <select v-model="selectedRole"
          class="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
          <option value="">Pilih role...</option>
          <option v-for="r in availableRoles" :key="r.name" :value="r.name" :disabled="detail.roles.includes(r.name)">
            {{ r.label || r.name }}
          </option>
        </select>
        <button @click="addRole"
          class="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5"
          :disabled="!selectedRole">
          <Plus :size="16" />
          Tambah
        </button>
      </div>
      <div v-else class="text-xs text-surface-400 flex items-center gap-1.5">
        <Lock :size="12" />
        Hanya Direktur Utama yang dapat mengelola role
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Plus, Lock } from 'lucide-vue-next'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  staffId: string
  availableRoles: any[]
}>()

const auth = useAuthStore()
const store = useStaffManagementStore()

const detail = computed(() => store.staffDetail!)
const selectedRole = ref('')

async function addRole() {
  if (!selectedRole.value) return
  try {
    const res = await store.assignRole(props.staffId, selectedRole.value)
    if (res.success) {
      selectedRole.value = ''
      await store.fetchStaffDetail(props.staffId)
    }
  } catch { /* silent */ }
}

async function removeRole(roleName: string) {
  try {
    const res = await store.removeRole(props.staffId, roleName)
    if (res.success) {
      await store.fetchStaffDetail(props.staffId)
    }
  } catch { /* silent */ }
}
</script>
