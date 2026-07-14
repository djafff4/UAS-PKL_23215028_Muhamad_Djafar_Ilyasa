<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left: Staff Info & Edit Form -->
    <div class="lg:col-span-2 space-y-6">
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
          <span class="w-1 h-4 rounded-full bg-primary-500"></span>
          Detail Staff
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Nama Lengkap</label>
            <input :value="detail.full_name" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Email</label>
            <input :value="detail.email" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Akman ID</label>
            <input :value="detail.akman_id" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Telepon</label>
            <input v-if="auth.canManageStaff" v-model="form.phone" type="text" placeholder="Nomor telepon"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            <input v-else :value="detail.phone" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Departemen</label>
            <select v-if="auth.canManageStaff" v-model="form.department"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
              <option value="">Pilih Departemen</option>
              <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
            </select>
            <input v-else :value="detail.department" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Jabatan</label>
            <input v-if="auth.canManageStaff" v-model="form.position" type="text" placeholder="Jabatan"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            <input v-else :value="detail.position" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Atasan Langsung</label>
            <select v-if="auth.canManageStaff" v-model="form.reports_to"
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
              <option :value="null">Tidak Ada</option>
              <option v-for="s in managerOptions" :key="s.id" :value="s.id">
                {{ s.full_name }} — {{ s.position || '-' }}
              </option>
            </select>
            <input v-else :value="managerName || '-'" disabled
              class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <button v-if="auth.canManageStaff" @click="form.is_active = !form.is_active"
                class="relative w-10 h-6 rounded-full transition-colors duration-200"
                :class="form.is_active ? 'bg-emerald-500' : 'bg-surface-300 dark:bg-surface-600'">
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  :class="form.is_active ? 'translate-x-4' : 'translate-x-0'" />
              </button>
              <span v-else
                class="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                :class="detail.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                {{ detail.is_active ? 'Active' : 'Inactive' }}
              </span>
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">Akun Aktif</span>
            </label>
          </div>
        </div>
        <div v-if="auth.canManageStaff" class="mt-6 flex gap-3">
          <button @click="saveChanges"
            class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            :disabled="saving">
            <div v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <p v-if="saveMessage" class="text-sm font-medium flex items-center"
            :class="saveSuccess ? 'text-emerald-600' : 'text-red-500'">{{ saveMessage }}</p>
        </div>
        <div v-else class="mt-4 pt-4 border-t border-surface-200/50 dark:border-surface-800/30">
          <p class="text-xs text-surface-400 flex items-center gap-1.5">
            <Lock :size="12" />
            Hanya Direktur Utama yang dapat mengubah data staff
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Summary Sidebar -->
    <div class="space-y-6">
      <div
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-3">Informasi Akun</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-surface-500">Gender</span>
            <span class="font-medium text-surface-900 dark:text-surface-100">{{ detail.gender || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-500">Akman ID</span>
            <span class="font-medium text-surface-900 dark:text-surface-100 text-xs">{{ detail.akman_id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-500">Atasan</span>
            <span class="font-medium text-surface-900 dark:text-surface-100">{{ managerName || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-500">Dibuat</span>
            <span class="font-medium text-surface-900 dark:text-surface-100">{{ formatDate(detail.created_at) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-500">Diupdate</span>
            <span class="font-medium text-surface-900 dark:text-surface-100">{{ formatDate(detail.updated_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Lock } from 'lucide-vue-next'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  staffId: string
  departments: string[]
  allStaff: any[]
}>()

const emit = defineEmits<{
  saved: []
}>()

const auth = useAuthStore()
const store = useStaffManagementStore()

const detail = computed(() => store.staffDetail!)
const saving = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)

const form = ref({
  phone: '',
  department: '',
  position: '',
  reports_to: null as string | null,
  is_active: true,
})

const managerOptions = computed(() =>
  props.allStaff.filter(s => s.id !== detail.value?.id)
)

const managerName = computed(() => {
  if (!detail.value?.reports_to) return null
  const mgr = props.allStaff.find(s => s.id === detail.value?.reports_to)
  return mgr?.full_name || null
})

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function saveChanges() {
  saving.value = true
  saveMessage.value = ''
  try {
    const res = await store.updateStaff(props.staffId, {
      phone: form.value.phone || null,
      department: form.value.department || null,
      position: form.value.position || null,
      is_active: form.value.is_active,
      reports_to: form.value.reports_to,
    })
    if (res.success) {
      saveSuccess.value = true
      saveMessage.value = 'Data berhasil disimpan'
      await store.fetchStaffDetail(props.staffId)
      emit('saved')
    } else {
      saveSuccess.value = false
      saveMessage.value = res.message || 'Gagal menyimpan data'
    }
  } catch (err: any) {
    saveSuccess.value = false
    saveMessage.value = err.message || 'Terjadi kesalahan'
  } finally {
    saving.value = false
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

onMounted(() => {
  if (detail.value) {
    form.value = {
      phone: detail.value.phone || '',
      department: detail.value.department || '',
      position: detail.value.position || '',
      reports_to: detail.value.reports_to || null,
      is_active: detail.value.is_active,
    }
  }
})
</script>
