<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-400/10 blur-[60px]"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Roadmap</h1>
        <p class="text-sm text-white/60 mt-1 font-medium">Monitoring target dan progres pengembangan perusahaan</p>
      </div>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="auth.canManageRoadmap && showForm" class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-violet-200/50 dark:border-violet-800/30 p-5 sm:p-6 ring-2 ring-violet-500/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">
          {{ editingId ? 'Edit Roadmap' : 'Tambah Roadmap Baru' }}
        </h3>
        <button @click="cancelForm" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
          <X :size="18" />
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="md:col-span-2 lg:col-span-1">
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Judul *</label>
          <input v-model="form.title" type="text" placeholder="Nama roadmap"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Deadline</label>
          <input v-model="form.deadline" type="date"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Status</label>
          <select v-model="form.status"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all">
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_TRACK">On Track</option>
            <option value="DELAYED">Delayed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Divisi</label>
          <select v-if="auth.hasGlobalAccess" v-model="form.divisi"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all">
            <option value="">Pilih Divisi</option>
            <option v-for="d in departmentList" :key="d" :value="d">{{ d }}</option>
          </select>
          <input v-else :value="auth.userDepartment" disabled
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-500 cursor-not-allowed" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Progres (%)</label>
          <input v-model.number="form.progress" type="number" min="0" max="100"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all" />
        </div>
        <div class="md:col-span-2 lg:col-span-2">
          <label class="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">Deskripsi</label>
          <textarea v-model="form.description" rows="2" placeholder="Deskripsi roadmap"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all resize-none"></textarea>
        </div>
      </div>
      <div class="mt-4 flex gap-3">
        <button @click="saveRoadmap"
          class="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
          :disabled="!form.title || saving">
          <div v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          {{ saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Roadmap' }}
        </button>
        <button @click="cancelForm"
          class="px-4 py-2.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-sm font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all">
          Batal
        </button>
        <p v-if="formError" class="text-sm text-red-500 font-medium flex items-center">{{ formError }}</p>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <button @click="roadmapStore.fetchRoadmaps()"
          class="px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
          <RefreshCw :size="15" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
      <button v-if="auth.canManageRoadmap && !showForm" @click="openCreateForm"
        class="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/20">
        <Plus :size="16" />
        Tambah Roadmap
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ roadmapStore.roadmaps.length }}</p>
        <p class="text-xs text-surface-500 font-medium mt-1">Total Milestone</p>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <p class="text-2xl font-bold text-emerald-600">{{ completedCount }}</p>
        <p class="text-xs text-surface-500 font-medium mt-1">Completed</p>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <p class="text-2xl font-bold text-blue-600">{{ inProgressCount }}</p>
        <p class="text-xs text-surface-500 font-medium mt-1">In Progress</p>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <p class="text-2xl font-bold text-amber-600">{{ delayedCount }}</p>
        <p class="text-xs text-surface-500 font-medium mt-1">Delayed</p>
      </div>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <div class="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/30 via-violet-500/10 to-transparent"></div>

      <div v-for="m in roadmapStore.roadmaps" :key="m.id" class="relative pl-14 pb-6 sm:pb-8 last:pb-0 group">
        <div class="absolute left-[13px] w-3 h-3 rounded-full border-2 z-10 transition-all duration-300 group-hover:scale-125"
          :class="milestoneDotColor(m.status)">
        </div>
        <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ m.title }}</h3>
                <div v-if="auth.canManageRoadmap" class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditForm(m)" class="p-1 rounded text-surface-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all">
                    <Pencil :size="13" />
                  </button>
                  <button @click="confirmDelete(m)" class="p-1 rounded text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
              <p class="text-xs text-surface-500 mt-0.5">{{ m.description }}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0"
              :class="milestoneBadge(m.status)">{{ m.status.replace('_', ' ') }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-surface-500">
            <span class="flex items-center gap-1.5">
              <Building2 :size="13" />
              {{ m.divisi }}
            </span>
            <span class="flex items-center gap-1.5">
              <CalendarDays :size="13" />
              Target: {{ formatDate(m.deadline) }}
            </span>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <div class="flex-1 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="milestoneProgressColor(m.status)"
                :style="{ width: m.progress + '%' }"></div>
            </div>
            <span class="text-xs font-bold text-surface-600 dark:text-surface-400 w-8 text-right">{{ m.progress }}%</span>
          </div>
          <!-- Delete confirmation -->
          <div v-if="deletingId === m.id" class="mt-3 pt-3 border-t border-red-200/50 dark:border-red-800/30">
            <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-2">Hapus roadmap "{{ m.title }}"?</p>
            <div class="flex gap-2">
              <button @click="deleteRoadmap(m.id)"
                class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all">
                Ya, Hapus
              </button>
              <button @click="deletingId = null"
                class="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-xs font-semibold rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-all">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!roadmapStore.roadmaps.length && !loading" class="text-center py-12">
        <Map :size="32" class="mx-auto text-surface-300 mb-2" />
        <p class="text-sm text-surface-400">Belum ada roadmap</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Building2, CalendarDays, Plus, X, Pencil, Trash2, RefreshCw, Map } from 'lucide-vue-next'
import { useRoadmapStore } from '@/stores/roadmap'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const roadmapStore = useRoadmapStore()
const auth = useAuthStore()
const toast = useToast()

const loading = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const deletingId = ref<string | null>(null)
const departmentList = ref<string[]>([])

const form = ref({
  title: '',
  description: '',
  deadline: '',
  status: 'PENDING',
  progress: 0,
  divisi: '',
})

const completedCount = computed(() => roadmapStore.roadmaps.filter(r => r.status === 'COMPLETED').length)
const inProgressCount = computed(() => roadmapStore.roadmaps.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ON_TRACK').length)
const delayedCount = computed(() => roadmapStore.roadmaps.filter(r => r.status === 'DELAYED').length)

function formatDate(date: string) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function milestoneDotColor(status: string) {
  const colors: Record<string, string> = {
    COMPLETED: 'border-emerald-500 bg-emerald-500',
    IN_PROGRESS: 'border-blue-500 bg-blue-500',
    ON_TRACK: 'border-blue-500 bg-blue-500',
    PENDING: 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900',
    DELAYED: 'border-amber-500 bg-amber-500',
  }
  return colors[status] || ''
}

function milestoneBadge(status: string) {
  const badges: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ON_TRACK: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PENDING: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
    DELAYED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }
  return badges[status] || ''
}

function milestoneProgressColor(status: string) {
  const colors: Record<string, string> = {
    COMPLETED: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    IN_PROGRESS: 'bg-gradient-to-r from-blue-500 to-blue-400',
    ON_TRACK: 'bg-gradient-to-r from-blue-500 to-blue-400',
    PENDING: 'bg-surface-300 dark:bg-surface-600',
    DELAYED: 'bg-gradient-to-r from-amber-500 to-amber-400',
  }
  return colors[status] || 'bg-surface-500'
}

function openCreateForm() {
  editingId.value = null
  form.value = {
    title: '',
    description: '',
    deadline: '',
    status: 'PENDING',
    progress: 0,
    divisi: auth.hasGlobalAccess ? '' : auth.userDepartment,
  }
  formError.value = ''
  showForm.value = true
}

function openEditForm(m: any) {
  editingId.value = m.id
  form.value = {
    title: m.title,
    description: m.description || '',
    deadline: m.deadline || '',
    status: m.status || 'PENDING',
    progress: m.progress || 0,
    divisi: m.divisi || '',
  }
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
  form.value = { title: '', description: '', deadline: '', status: 'PENDING', progress: 0, divisi: '' }
  formError.value = ''
}

function confirmDelete(m: any) {
  deletingId.value = m.id
}

async function saveRoadmap() {
  if (!form.value.title.trim()) {
    formError.value = 'Judul wajib diisi'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      deadline: form.value.deadline,
      status: form.value.status,
      progress: form.value.progress,
      divisi: form.value.divisi || auth.userDepartment,
    }

    let res: any
    if (editingId.value) {
      res = await roadmapStore.updateRoadmap(editingId.value, payload)
    } else {
      res = await roadmapStore.createRoadmap(payload)
    }

    if (res?.success || res?.data) {
      toast.success(editingId.value ? 'Roadmap berhasil diperbarui' : 'Roadmap berhasil dibuat')
      cancelForm()
    } else {
      formError.value = res?.message || 'Gagal menyimpan roadmap'
    }
  } catch (err: any) {
    formError.value = err.message || 'Terjadi kesalahan'
  } finally {
    saving.value = false
  }
}

async function deleteRoadmap(id: string) {
  try {
    const res = await roadmapStore.deleteRoadmap(id)
    if (res?.success || res?.data) {
      toast.success('Roadmap berhasil dihapus')
      deletingId.value = null
    }
  } catch {
    toast.error('Gagal menghapus roadmap')
  }
}

onMounted(async () => {
  loading.value = true
  await roadmapStore.fetchRoadmaps()
  loading.value = false
})
</script>
