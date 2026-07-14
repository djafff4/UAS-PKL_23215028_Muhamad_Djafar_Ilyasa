<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Corporate / B2B</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola klien corporate dan kontrak B2B</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Tambah Klien
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Building2 :size="18" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.total }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Klien</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.active }}</p>
            <p class="text-xs text-surface-500 font-medium">Aktif</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Target :size="18" class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ store.stats.leads }}</p>
            <p class="text-xs text-surface-500 font-medium">Leads</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Wallet :size="18" class="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-lg font-bold text-surface-900 dark:text-surface-100">{{ formatCurrency(store.stats.total_revenue) }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="search" @input="debouncedSearch" type="text" placeholder="Cari nama perusahaan atau PIC..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
      <select v-model="statusFilter" @change="refresh"
        class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="lead">Lead</option>
        <option value="inactive">Nonaktif</option>
      </select>
      <button @click="refresh" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
        <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="c in store.clients" :key="c.id"
        class="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm font-bold shrink-0">
              {{ companyInitials(c.company_name) }}
            </div>
            <div>
              <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ c.company_name }}</h3>
              <p class="text-xs text-surface-400">{{ c.industry || 'Umum' }}</p>
            </div>
          </div>
          <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
            :class="statusBadge(c.status)">
            {{ statusLabel(c.status) }}
          </span>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-xs text-surface-500">
            <User :size="12" />
            <span>{{ c.contact_person || '-' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-surface-500">
            <Mail :size="12" />
            <span>{{ c.contact_email || '-' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-surface-500">
            <Phone :size="12" />
            <span>{{ c.contact_phone || '-' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-3 border-t border-surface-100/50 dark:border-surface-700/20 text-xs text-surface-400">
          <span class="flex items-center gap-1">
            <FileText :size="12" />
            {{ c.contract_count }} kontrak
          </span>
          <span class="flex items-center gap-1">
            <Wallet :size="12" />
            {{ formatCurrency(c.total_revenue) }}
          </span>
        </div>

        <div class="flex items-center gap-2 mt-3">
          <button @click="openDetail(c)" class="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors">
            Detail
          </button>
          <button @click="openEdit(c)" class="p-2 rounded-xl text-surface-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
            <Pencil :size="14" />
          </button>
          <button @click="confirmDelete(c)" class="p-2 rounded-xl text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>

      <div v-if="!store.clients.length && !store.loading"
        class="col-span-full rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-12 text-center">
        <Building2 :size="40" class="mx-auto text-surface-300 mb-3" />
        <p class="text-sm font-semibold text-surface-500">{{ search || statusFilter ? 'Tidak ada klien yang cocok' : 'Belum ada klien corporate' }}</p>
      </div>

      <div v-if="store.loading" class="col-span-full text-center py-12">
        <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm text-surface-400">Memuat klien...</p>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30 shrink-0">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">{{ editingId ? 'Edit Klien' : 'Tambah Klien Baru' }}</h2>
              <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X :size="18" />
              </button>
            </div>
            <div class="p-5 space-y-4 overflow-y-auto">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nama Perusahaan *</label>
                <input v-model="form.company_name" type="text" class="input-field" placeholder="PT Contoh Indonesia" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Industri</label>
                  <input v-model="form.industry" type="text" class="input-field" placeholder="e.g., Teknologi, Manufaktur" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Ukuran Perusahaan</label>
                  <select v-model="form.company_size" class="input-field">
                    <option value="">Pilih</option>
                    <option value="small">Kecil (< 50 karyawan)</option>
                    <option value="medium">Menengah (50-250)</option>
                    <option value="large">Besar (250-1000)</option>
                    <option value="enterprise">Enterprise (> 1000)</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Website</label>
                <input v-model="form.website" type="url" class="input-field" placeholder="https://example.com" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Alamat</label>
                <textarea v-model="form.address" rows="2" class="input-field resize-none" placeholder="Alamat lengkap"></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kota</label>
                  <input v-model="form.city" type="text" class="input-field" placeholder="Kota" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Provinsi</label>
                  <input v-model="form.province" type="text" class="input-field" placeholder="Provinsi" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Nama PIC</label>
                  <input v-model="form.contact_person" type="text" class="input-field" placeholder="Nama kontak person" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Jabatan PIC</label>
                  <input v-model="form.contact_position" type="text" class="input-field" placeholder="e.g., HR Manager" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Email PIC</label>
                  <input v-model="form.contact_email" type="email" class="input-field" placeholder="pic@company.com" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Telepon PIC</label>
                  <input v-model="form.contact_phone" type="text" class="input-field" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">NPWP</label>
                  <input v-model="form.tax_number" type="text" class="input-field" placeholder="Nomor NPWP" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                  <select v-model="form.status" class="input-field">
                    <option value="active">Aktif</option>
                    <option value="lead">Lead</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Catatan</label>
                <textarea v-model="form.notes" rows="2" class="input-field resize-none" placeholder="Catatan tambahan"></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30 shrink-0">
              <button @click="closeModal" class="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" :disabled="store.creating">Batal</button>
              <button @click="handleSubmit" :disabled="!canSubmit || store.creating" class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="store.creating" :size="16" class="animate-spin" />
                <Save v-else :size="16" />
                {{ store.creating ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Klien' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="showDeleteModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 :size="24" class="text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Hapus Klien?</h3>
            <p class="text-sm text-surface-500 mb-6">Klien "<strong>{{ deletingClient?.company_name }}</strong>" akan dihapus permanen.</p>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">Batal</button>
              <button @click="handleDelete" class="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Building2, CheckCircle, Target, Wallet, User, Mail, Phone, FileText, Pencil, Trash2, X, Save, Loader2 } from 'lucide-vue-next'
import { useCorporateStore, type CorporateClient } from '@/stores/corporate'
import { useToast } from '@/composables/useToast'

const store = useCorporateStore()
const toast = useToast()

const search = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref<string | null>(null)
const deletingClient = ref<CorporateClient | null>(null)

const form = reactive({
  company_name: '',
  industry: '',
  company_size: '',
  website: '',
  address: '',
  city: '',
  province: '',
  contact_person: '',
  contact_position: '',
  contact_email: '',
  contact_phone: '',
  tax_number: '',
  status: 'active',
  notes: '',
})

const canSubmit = computed(() => form.company_name)

onMounted(() => {
  store.fetchClients()
  store.fetchStats()
})

function companyInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
}

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    inactive: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'Aktif',
    lead: 'Lead',
    inactive: 'Nonaktif',
  }
  return labels[status] || status
}

function formatCurrency(amount: number) {
  if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + ' M'
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' jt'
  return new Intl.NumberFormat('id-ID').format(amount)
}

function refresh() {
  store.fetchClients({ status: statusFilter.value || undefined, search: search.value || undefined })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}

function resetForm() {
  form.company_name = ''
  form.industry = ''
  form.company_size = ''
  form.website = ''
  form.address = ''
  form.city = ''
  form.province = ''
  form.contact_person = ''
  form.contact_position = ''
  form.contact_email = ''
  form.contact_phone = ''
  form.tax_number = ''
  form.status = 'active'
  form.notes = ''
}

function closeModal() {
  showCreateModal.value = false
  editingId.value = null
  resetForm()
}

function openEdit(c: CorporateClient) {
  editingId.value = c.id
  form.company_name = c.company_name
  form.industry = c.industry
  form.company_size = c.company_size
  form.website = c.website
  form.address = c.address
  form.city = c.city
  form.province = c.province
  form.contact_person = c.contact_person
  form.contact_position = c.contact_position
  form.contact_email = c.contact_email
  form.contact_phone = c.contact_phone
  form.tax_number = c.tax_number
  form.status = c.status
  form.notes = c.notes
  showCreateModal.value = true
}

function openDetail(c: CorporateClient) {
  window.open(`/corporate/${c.id}`, '_blank')
}

function confirmDelete(c: CorporateClient) {
  deletingClient.value = c
  showDeleteModal.value = true
}

async function handleSubmit() {
  if (!canSubmit.value || store.creating) return

  let result
  if (editingId.value) {
    result = await store.updateClient(editingId.value, { ...form })
  } else {
    result = await store.createClient({ ...form })
  }

  if (result?.success) {
    toast.success(editingId.value ? 'Klien berhasil diupdate' : 'Klien berhasil ditambahkan')
    closeModal()
  } else {
    toast.error(result?.message || 'Gagal menyimpan klien')
  }
}

async function handleDelete() {
  if (!deletingClient.value) return

  const result = await store.deleteClient(deletingClient.value.id)
  if (result?.success) {
    toast.success('Klien berhasil dihapus')
    showDeleteModal.value = false
    deletingClient.value = null
  } else {
    toast.error(result?.message || 'Gagal menghapus klien')
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
