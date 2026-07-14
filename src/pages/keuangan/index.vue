<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Manajemen Keuangan</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola pemasukan dan pengeluaran organisasi</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button @click="exportToCSV" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200">
            <Download :size="16" />
            Export CSV
          </button>
          <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200">
            <Plus :size="16" />
            Tambah Transaksi
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <TrendingUp :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Pemasukan</span>
        </div>
        <p class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatCurrency(store.summary.totalPemasukan) }}</p>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <TrendingDown :size="18" class="text-red-600 dark:text-red-400" />
          </div>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Pengeluaran</span>
        </div>
        <p class="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">Rp {{ formatCurrency(store.summary.totalPengeluaran) }}</p>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Wallet :size="18" class="text-primary-600 dark:text-primary-400" />
          </div>
          <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Saldo</span>
        </div>
        <p class="text-xl sm:text-2xl font-bold" :class="store.summary.saldo >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-red-600 dark:text-red-400'">
          {{ store.summary.saldo >= 0 ? '' : '-' }}Rp {{ formatCurrency(Math.abs(store.summary.saldo)) }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 flex-wrap">
      <button v-for="cat in categories" :key="cat.key"
        @click="activeCategory = cat.key"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
        :class="activeCategory === cat.key
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 border border-surface-200/50 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'">
        {{ cat.label }}
      </button>
    </div>

    <div v-if="filteredTransactions.length" class="space-y-2">
      <div v-for="t in filteredTransactions" :key="t.id"
        class="group rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="t.type === 'PEMASUKAN' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'">
            <TrendingUp v-if="t.type === 'PEMASUKAN'" :size="18" class="text-emerald-600 dark:text-emerald-400" />
            <TrendingDown v-else :size="18" class="text-red-600 dark:text-red-400" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{{ t.description }}</h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                    :class="t.type === 'PEMASUKAN' ? 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-100/70 text-red-700 dark:bg-red-900/20 dark:text-red-400'">
                    {{ t.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                    {{ t.category }}
                  </span>
                </div>
              </div>
              <p class="text-sm sm:text-base font-bold shrink-0" :class="t.type === 'PEMASUKAN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                {{ t.type === 'PEMASUKAN' ? '+' : '-' }}Rp {{ formatCurrency(t.amount) }}
              </p>
            </div>
            <div class="flex items-center justify-between mt-1.5">
              <div class="flex items-center gap-3">
                <p class="text-[11px] text-surface-400 font-medium flex items-center gap-1.5">
                  <CalendarDays :size="11" /> {{ formatDate(t.date) }}
                </p>
                <button v-if="t.evidence_photo" @click="openPhotoPreview(t.evidence_photo)"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                  <ImageIcon :size="11" /> Lihat Bukti
                </button>
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click="openEditModal(t)"
                  class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Pencil :size="14" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="t.evidence_photo" class="w-12 h-12 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-surface-200 dark:border-surface-700"
            @click="openPhotoPreview(t.evidence_photo)">
            <img :src="t.evidence_photo" alt="Bukti" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30">
      <DashboardEmptyState
        title="Belum ada transaksi"
        message="Mulai catat pemasukan dan pengeluaran untuk memantau keuangan organisasi."
        :actions="[{ label: '+ Tambah Transaksi', to: '#', icon: Plus, primary: true }]"
        compact
      />
    </div>

    <!-- Create Transaction Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30 shrink-0">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Tambah Transaksi Baru</h2>
              <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Transaksi</label>
                <div class="flex gap-2">
                  <button @click="form.type = 'PEMASUKAN'"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    :class="form.type === 'PEMASUKAN' ? 'bg-emerald-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'">
                    Pemasukan
                  </button>
                  <button @click="form.type = 'PENGELUARAN'"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    :class="form.type === 'PENGELUARAN' ? 'bg-red-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'">
                    Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jumlah (Rp)</label>
                <input v-model.number="form.amount" type="number" min="0" placeholder="0" class="input-field" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="form.category" class="input-field">
                  <option value="" disabled>Pilih kategori</option>
                  <option v-for="cat in transactionCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
                <input v-model="form.description" type="text" placeholder="Deskripsi transaksi" class="input-field" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                <input v-model="form.date" type="date" class="input-field" />
              </div>

              <!-- Photo Upload -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Foto Bukti Transaksi</label>
                <div v-if="photoPreview" class="relative w-full max-w-xs">
                  <img :src="photoPreview" alt="Preview bukti" class="w-full h-40 object-cover rounded-xl border border-surface-200 dark:border-surface-700" />
                  <button @click="removePhoto"
                    class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg">
                    <X :size="14" />
                  </button>
                  <p class="text-[10px] text-surface-400 mt-1 truncate">{{ selectedPhoto?.name }}</p>
                </div>
                <div v-else
                  @click="photoInput?.click()"
                  class="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-colors bg-surface-50 dark:bg-surface-800/30">
                  <Camera :size="24" class="text-surface-400" />
                  <span class="text-xs font-medium text-surface-500">Klik untuk upload foto bukti</span>
                  <span class="text-[10px] text-surface-400">JPG, PNG, WEBP (maks 5 MB)</span>
                </div>
                <input ref="photoInput" type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/webp" @change="onPhotoSelect" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30 shrink-0">
              <button @click="closeModal" class="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" :disabled="store.creating">
                Batal
              </button>
              <button
                @click="handleCreate"
                :disabled="!canCreate || store.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="store.creating" :size="16" class="animate-spin" />
                <Plus v-else :size="16" />
                {{ store.creating ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Transaction Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeEditModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30 shrink-0">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Edit Transaksi</h2>
              <button @click="closeEditModal" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X :size="18" />
              </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Transaksi</label>
                <div class="flex gap-2">
                  <button @click="editForm.type = 'PEMASUKAN'"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    :class="editForm.type === 'PEMASUKAN' ? 'bg-emerald-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'">
                    Pemasukan
                  </button>
                  <button @click="editForm.type = 'PENGELUARAN'"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    :class="editForm.type === 'PENGELUARAN' ? 'bg-red-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'">
                    Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jumlah (Rp)</label>
                <input v-model.number="editForm.amount" type="number" min="0" placeholder="0" class="input-field" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="editForm.category" class="input-field">
                  <option value="" disabled>Pilih kategori</option>
                  <option v-for="cat in transactionCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
                <input v-model="editForm.description" type="text" placeholder="Deskripsi transaksi" class="input-field" />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                <input v-model="editForm.date" type="date" class="input-field" />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30 shrink-0">
              <button @click="closeEditModal" class="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" :disabled="store.creating">
                Batal
              </button>
              <button
                @click="handleEdit"
                :disabled="!canEdit || store.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="store.creating" :size="16" class="animate-spin" />
                <Pencil v-else :size="16" />
                {{ store.creating ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="previewPhotoUrl" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="previewPhotoUrl = null">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="previewPhotoUrl = null" />
          <div class="relative max-w-2xl w-full">
            <button @click="previewPhotoUrl = null"
              class="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
              <X :size="18" />
            </button>
            <img :src="previewPhotoUrl" alt="Bukti pengeluaran" class="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, X, TrendingUp, TrendingDown, Wallet, CalendarDays, Loader2, Camera, Image as ImageIcon, Pencil, Download } from 'lucide-vue-next'
import { useKeuanganStore } from '@/stores/keuangan'
import { useToast } from '@/composables/useToast'
import DashboardEmptyState from '@/components/DashboardEmptyState.vue'

const store = useKeuanganStore()
const toast = useToast()
const activeCategory = ref('Semua')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTransaction = ref<any>(null)
const previewPhotoUrl = ref<string | null>(null)

const editForm = reactive({
  type: 'PEMASUKAN' as string,
  amount: 0,
  category: '',
  description: '',
  date: '',
})

const photoInput = ref<HTMLInputElement | null>(null)
const selectedPhoto = ref<File | null>(null)
const photoPreview = ref<string | null>(null)

const categories = [
  { key: 'Semua', label: 'Semua' },
  { key: 'PEMASUKAN', label: 'Pemasukan' },
  { key: 'PENGELUARAN', label: 'Pengeluaran' },
]

const transactionCategories = [
  'Penjualan',
  'Jasa',
  'Investasi',
  'Gaji',
  'Operasional',
  'Marketing',
  'Peralatan',
  'Transport',
  'Lainnya',
]

const form = reactive({
  type: 'PEMASUKAN' as string,
  amount: 0,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
})

const canCreate = computed(() => form.amount > 0 && form.category && form.description && form.date)
const canEdit = computed(() => editForm.amount > 0 && editForm.category && editForm.description && editForm.date)

onMounted(() => store.fetchTransactions())

const filteredTransactions = computed(() => {
  if (activeCategory.value === 'Semua') return store.transactions
  return store.transactions.filter(t => t.type === activeCategory.value)
})

function formatCurrency(value: number): string {
  return value.toLocaleString('id-ID')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function onPhotoSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5 MB')
      return
    }
    selectedPhoto.value = file
    photoPreview.value = URL.createObjectURL(file)
  }
}

function removePhoto() {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  selectedPhoto.value = null
  photoPreview.value = null
  if (photoInput.value) photoInput.value.value = ''
}

function openPhotoPreview(url: string) {
  previewPhotoUrl.value = url
}

function closeModal() {
  showCreateModal.value = false
  form.type = 'PEMASUKAN'
  form.amount = 0
  form.category = ''
  form.description = ''
  form.date = new Date().toISOString().split('T')[0]
  removePhoto()
}

async function handleCreate() {
  console.log('[KEUANGAN] handleCreate called', { canCreate: canCreate.value, creating: store.creating, form: { ...form } })
  if (!canCreate.value || store.creating) return

  try {
    const res = await store.createTransaction({
      ...form,
      evidence_photo: selectedPhoto.value,
    })
    console.log('[KEUANGAN] createTransaction result:', res)

    if (res?.success) {
      toast.success('Berhasil', 'Transaksi berhasil disimpan')
      closeModal()
    } else {
      toast.error('Gagal', res?.message || 'Terjadi kesalahan saat menyimpan transaksi')
    }
  } catch (err: any) {
    console.error('[KEUANGAN] handleCreate error:', err)
    toast.error('Error', err?.message || 'Terjadi kesalahan tak terduga')
  }
}

function openEditModal(transaction: any) {
  editingTransaction.value = transaction
  editForm.type = transaction.type
  editForm.amount = transaction.amount
  editForm.category = transaction.category
  editForm.description = transaction.description
  editForm.date = transaction.date
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingTransaction.value = null
  editForm.type = 'PEMASUKAN'
  editForm.amount = 0
  editForm.category = ''
  editForm.description = ''
  editForm.date = ''
}

async function handleEdit() {
  if (!canEdit.value || store.creating || !editingTransaction.value) return

  try {
    const res = await store.updateTransaction(editingTransaction.value.id, { ...editForm })

    if (res?.success) {
      toast.success('Berhasil', 'Transaksi berhasil diupdate')
      closeEditModal()
    } else {
      toast.error('Gagal', res?.message || 'Terjadi kesalahan saat mengupdate transaksi')
    }
  } catch (err: any) {
    toast.error('Error', err?.message || 'Terjadi kesalahan tak terduga')
  }
}

function exportToCSV() {
  const headers = ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah']
  const rows = store.transactions.map(t => [
    t.date,
    t.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran',
    t.category,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toString(),
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `keuangan_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast.success('Berhasil', 'File CSV berhasil diunduh')
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
