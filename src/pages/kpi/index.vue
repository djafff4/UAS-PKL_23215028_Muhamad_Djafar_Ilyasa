<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">KPI Monitoring</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Monitoring performa divisi dan anggota</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Buat KPI
        </button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div class="group relative overflow-hidden rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-all duration-300 group-hover:scale-110">
            <CheckCircle :size="24" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.onTrack }}</p>
            <p class="text-sm text-surface-500 font-medium">On Track</p>
          </div>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl border border-amber-200/50 dark:border-amber-800/30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-all duration-300 group-hover:scale-110">
            <AlertTriangle :size="24" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.needAttention }}</p>
            <p class="text-sm text-surface-500 font-medium">Need Attention</p>
          </div>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-800/30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 transition-all duration-300 group-hover:scale-110">
            <XCircle :size="24" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ kpiStore.kpiStats.behind }}</p>
            <p class="text-sm text-surface-500 font-medium">Behind</p>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Tables by Divisi -->
    <div v-for="(kpis, divisi) in kpiStore.kpiByDivisi" :key="divisi" class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
          {{ divisi }}
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[700px]">
          <thead>
            <tr class="text-surface-500 dark:text-surface-400 border-b border-surface-200/50 dark:border-surface-700/30">
              <th class="text-left font-semibold p-4">Indikator</th>
              <th class="text-center font-semibold p-4">Target</th>
              <th class="text-center font-semibold p-4">Pencapaian</th>
              <th class="text-center font-semibold p-4 w-48">Progress</th>
              <th class="text-center font-semibold p-4">Status</th>
              <th class="text-center font-semibold p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kpi in kpis" :key="kpi.id"
              class="border-b border-surface-100/50 dark:border-surface-800/20 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <td class="p-4 font-medium text-surface-900 dark:text-surface-100">{{ kpi.indikator }}</td>
              <td class="p-4 text-center text-surface-700 dark:text-surface-300">{{ kpi.target }}</td>
              <td class="p-4 text-center text-surface-700 dark:text-surface-300">{{ kpi.pencapaian }}</td>
              <td class="p-4">
                <div class="flex items-center gap-2.5 justify-center">
                  <div class="flex-1 max-w-[120px] h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700" :class="kpiBarColor(kpi.status)"
                      :style="{ width: Math.min(100, (kpi.pencapaian / kpi.target * 100)) + '%' }"></div>
                  </div>
                  <span class="text-xs font-semibold text-surface-500 w-8">{{ Math.round(kpi.pencapaian / kpi.target * 100) }}%</span>
                </div>
              </td>
              <td class="p-4 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="kpiStatusBadge(kpi.status)">{{ kpi.status.replace('_', ' ') }}</span>
              </td>
              <td class="p-4 text-center">
                <div class="inline-flex items-center gap-1">
                  <button @click="openEditModal(kpi)" class="p-1.5 rounded-lg text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Edit">
                    <Pencil :size="15" />
                  </button>
                  <button @click="openDeleteModal(kpi)" class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Hapus">
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create KPI Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Buat KPI Baru</h2>
              <button @click="closeModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- Indikator -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Indikator</label>
                <input v-model="form.indikator" type="text" placeholder="Nama indikator KPI" class="input-field" />
              </div>

              <!-- Target & Pencapaian -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Target</label>
                  <input v-model.number="form.target" type="number" min="0" placeholder="0" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Pencapaian</label>
                  <input v-model.number="form.pencapaian" type="number" min="0" placeholder="0" class="input-field" />
                </div>
              </div>

              <!-- Periode & Divisi -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Periode</label>
                  <input v-model="form.periode" type="text" placeholder="Contoh: Q1 2026" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Divisi</label>
                  <input v-model="form.divisi" type="text" placeholder="Nama divisi" class="input-field" />
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                <select v-model="form.status" class="input-field">
                  <option value="ON_TRACK">On Track</option>
                  <option value="NEED_ATTENTION">Need Attention</option>
                  <option value="BEHIND">Behind</option>
                </select>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="kpiStore.creating">
                Batal
              </button>
              <button
                @click="handleCreate"
                :disabled="!canCreate || kpiStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="kpiStore.creating" :size="16" class="animate-spin" />
                <Plus v-else :size="16" />
                {{ kpiStore.creating ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit KPI Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeEditModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Edit KPI</h2>
              <button @click="closeEditModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- Indikator -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Indikator</label>
                <input v-model="editForm.indikator" type="text" placeholder="Nama indikator KPI" class="input-field" />
              </div>

              <!-- Target & Pencapaian -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Target</label>
                  <input v-model.number="editForm.target" type="number" min="0" placeholder="0" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Pencapaian</label>
                  <input v-model.number="editForm.pencapaian" type="number" min="0" placeholder="0" class="input-field" />
                </div>
              </div>

              <!-- Periode & Divisi -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Periode</label>
                  <input v-model="editForm.periode" type="text" placeholder="Contoh: Q1 2026" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Divisi</label>
                  <input v-model="editForm.divisi" type="text" placeholder="Nama divisi" class="input-field" />
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                <select v-model="editForm.status" class="input-field">
                  <option value="ON_TRACK">On Track</option>
                  <option value="NEED_ATTENTION">Need Attention</option>
                  <option value="BEHIND">Behind</option>
                </select>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeEditModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="kpiStore.creating">
                Batal
              </button>
              <button
                @click="handleUpdate"
                :disabled="!canUpdate || kpiStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="kpiStore.creating" :size="16" class="animate-spin" />
                <Pencil v-else :size="16" />
                {{ kpiStore.creating ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeDeleteModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Hapus KPI</h2>
              <button @click="closeDeleteModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <Trash2 :size="20" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">Yakin ingin menghapus KPI ini?</p>
                  <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    <span class="font-medium text-surface-700 dark:text-surface-300">"{{ deletingKpi?.indikator }}"</span>
                    akan dihapus secara permanen.
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeDeleteModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="deleting">
                Batal
              </button>
              <button
                @click="handleDelete"
                :disabled="deleting"
                class="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="deleting" :size="16" class="animate-spin" />
                <Trash2 v-else :size="16" />
                {{ deleting ? 'Menghapus...' : 'Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { CheckCircle, AlertTriangle, XCircle, Plus, X, Loader2, Pencil, Trash2 } from 'lucide-vue-next'
import { useKpiStore } from '@/stores/kpi'
import { useToast } from '@/composables/useToast'

const kpiStore = useKpiStore()
const toast = useToast()
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingKpi = ref<any>(null)
const deletingKpi = ref<any>(null)

const form = reactive({
  indikator: '',
  target: 0,
  pencapaian: 0,
  periode: '',
  status: 'ON_TRACK',
  divisi: '',
})

const editForm = reactive({
  indikator: '',
  target: 0,
  pencapaian: 0,
  periode: '',
  status: 'ON_TRACK',
  divisi: '',
})

const deleting = ref(false)

const canCreate = computed(() => form.indikator && form.periode && form.divisi)
const canUpdate = computed(() => editForm.indikator && editForm.periode && editForm.divisi)

onMounted(() => kpiStore.fetchKpis())

function kpiBarColor(status: string) {
  const colors: Record<string, string> = {
    'ON_TRACK': 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    'NEED_ATTENTION': 'bg-gradient-to-r from-amber-500 to-amber-400',
    'BEHIND': 'bg-gradient-to-r from-red-500 to-red-400',
  }
  return colors[status] || 'bg-surface-500'
}

function kpiStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'ON_TRACK': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'NEED_ATTENTION': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'BEHIND': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function closeModal() {
  showCreateModal.value = false
  form.indikator = ''
  form.target = 0
  form.pencapaian = 0
  form.periode = ''
  form.status = 'ON_TRACK'
  form.divisi = ''
}

async function handleCreate() {
  if (!canCreate.value || kpiStore.creating) return
  const res = await kpiStore.createKpi({ ...form })
  if (res?.success) {
    toast.success('Berhasil', 'KPI berhasil dibuat')
    closeModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal membuat KPI')
  }
}

function openEditModal(kpi: any) {
  editingKpi.value = kpi
  editForm.indikator = kpi.indikator
  editForm.target = kpi.target
  editForm.pencapaian = kpi.pencapaian
  editForm.periode = kpi.periode
  editForm.status = kpi.status
  editForm.divisi = kpi.divisi
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingKpi.value = null
  editForm.indikator = ''
  editForm.target = 0
  editForm.pencapaian = 0
  editForm.periode = ''
  editForm.status = 'ON_TRACK'
  editForm.divisi = ''
}

async function handleUpdate() {
  if (!canUpdate.value || !editingKpi.value || kpiStore.creating) return
  const res = await kpiStore.updateKpi(editingKpi.value.id, { ...editForm })
  if (res?.success) {
    toast.success('Berhasil', 'KPI berhasil diupdate')
    closeEditModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal mengupdate KPI')
  }
}

function openDeleteModal(kpi: any) {
  deletingKpi.value = kpi
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deletingKpi.value = null
}

async function handleDelete() {
  if (!deletingKpi.value || deleting.value) return
  deleting.value = true
  const res = await kpiStore.deleteKpi(deletingKpi.value.id)
  deleting.value = false
  if (res?.success) {
    toast.success('Berhasil', 'KPI berhasil dihapus')
    closeDeleteModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus KPI')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
}
</style>
