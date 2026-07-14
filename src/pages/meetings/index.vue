<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-700 via-rose-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Meeting & Notes</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Dokumentasi rapat internal perusahaan</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <CalendarPlus :size="16" />
          Buat Meeting
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="search" type="text" placeholder="Cari meeting..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
      <select v-model="statusFilter"
        class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
        <option value="">Semua Status</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="ONGOING">Ongoing</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Meeting List -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="meeting in filteredMeetings" :key="meeting.id"
          class="card p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          @click="router.push(`/meetings/${meeting.id}`)">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-800/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <CalendarDays :size="20" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{{ meeting.title }}</h3>
                <p class="text-xs text-surface-500 mt-0.5 font-medium">{{ meeting.date }}, {{ meeting.time }} &bull; {{ meeting.location }}</p>
                <!-- Participants avatars -->
                <div v-if="meeting.participants?.length" class="flex items-center gap-1.5 mt-2">
                  <div class="flex -space-x-1.5">
                    <div v-for="(p, pi) in meeting.participants.slice(0, 5)" :key="pi"
                      class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 border-2 border-white dark:border-surface-900 flex items-center justify-center text-[9px] font-bold text-primary-600 dark:text-primary-400 shrink-0"
                      :title="p.name || p.full_name || p.email">
                      {{ participantInitial(p) }}
                    </div>
                    <div v-if="meeting.participants.length > 5"
                      class="w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-800 border-2 border-white dark:border-surface-900 flex items-center justify-center text-[9px] font-bold text-surface-500 shrink-0">
                      +{{ meeting.participants.length - 5 }}
                    </div>
                  </div>
                  <span class="text-[10px] text-surface-400 font-medium">{{ meeting.participants.length }} peserta</span>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2 shrink-0">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0"
                :class="meetingStatusBadge(meeting.status)">{{ meeting.status }}</span>
              <div class="flex flex-col gap-1">
                <button @click.stop="openEdit(meeting)"
                  class="p-1.5 rounded-lg text-surface-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
                  <Pencil :size="14" />
                </button>
                <button @click.stop="confirmDelete(meeting)"
                  class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="meeting.notulen" class="mt-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
            <p class="text-xs font-bold text-surface-500 mb-1.5 uppercase tracking-wider">Notulen:</p>
            <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed line-clamp-3">{{ meeting.notulen }}</p>
          </div>
        </div>
        <div v-if="!filteredMeetings.length" class="card p-8 text-center">
          <CalendarDays :size="32" class="mx-auto text-surface-300 mb-2" />
          <p class="text-sm text-surface-400">{{ search || statusFilter ? 'Tidak ada meeting yang cocok' : 'Belum ada meeting' }}</p>
        </div>
      </div>

      <!-- Upcoming Agenda -->
      <div class="card p-5 sm:p-6">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-5">
          <span class="w-1 h-4 rounded-full bg-rose-500"></span>
          Agenda Mendatang
        </h3>
        <div class="space-y-3">
          <div v-for="m in upcomingMeetings" :key="m.id"
            class="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group">
            <div class="text-center shrink-0 w-10">
              <p class="text-lg font-black text-primary-600 leading-none">{{ day(m.date) }}</p>
              <p class="text-[10px] font-bold text-surface-400 uppercase tracking-wider mt-0.5">{{ month(m.date) }}</p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{{ m.title }}</p>
              <p class="text-xs text-surface-500 mt-0.5">{{ m.time }} &bull; {{ m.location }}</p>
            </div>
          </div>
          <div v-if="!upcomingMeetings.length" class="p-4 text-center">
            <p class="text-sm text-surface-400">Tidak ada agenda</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Meeting Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Buat Meeting Baru</h2>
              <button @click="closeModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Meeting</label>
                <input v-model="form.title" type="text" placeholder="Masukkan judul meeting" class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                  <input v-model="form.date" type="date" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Waktu</label>
                  <input v-model="form.time" type="time" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Lokasi</label>
                <input v-model="form.location" type="text" placeholder="Masukkan lokasi meeting" class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                <select v-model="form.status" class="input-field">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Notulen</label>
                <textarea v-model="form.notulen" rows="3" placeholder="Tulis notulen meeting..." class="input-field resize-none"></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="meetingStore.creating">Batal</button>
              <button @click="handleCreate" :disabled="!canCreate || meetingStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="meetingStore.creating" :size="16" class="animate-spin" />
                <CalendarPlus v-else :size="16" />
                {{ meetingStore.creating ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Meeting Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeEdit">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Edit Meeting</h2>
              <button @click="closeEdit" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Meeting</label>
                <input v-model="form.title" type="text" placeholder="Masukkan judul meeting" class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                  <input v-model="form.date" type="date" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Waktu</label>
                  <input v-model="form.time" type="time" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Lokasi</label>
                <input v-model="form.location" type="text" placeholder="Masukkan lokasi meeting" class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                <select v-model="form.status" class="input-field">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Notulen</label>
                <textarea v-model="form.notulen" rows="3" placeholder="Tulis notulen meeting..." class="input-field resize-none"></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeEdit" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="meetingStore.creating">Batal</button>
              <button @click="handleUpdate" :disabled="!canUpdate || meetingStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="meetingStore.creating" :size="16" class="animate-spin" />
                <Pencil v-else :size="16" />
                {{ meetingStore.creating ? 'Menyimpan...' : 'Update' }}
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
import { useRouter } from 'vue-router'
import { CalendarDays, CalendarPlus, X, Loader2, Pencil, Trash2, Search } from 'lucide-vue-next'
import { useMeetingStore } from '@/stores/meetings'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const meetingStore = useMeetingStore()
const toast = useToast()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const statusFilter = ref('')

const form = reactive({
  title: '',
  date: '',
  time: '',
  location: '',
  status: 'SCHEDULED',
  notulen: '',
})

const canCreate = computed(() => form.title && form.date && form.time && form.location)
const canUpdate = computed(() => form.title && form.date && form.time && form.location)

const filteredMeetings = computed(() => {
  let result = meetingStore.meetings
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.notulen?.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    result = result.filter(m => m.status === statusFilter.value)
  }
  return result
})

onMounted(() => meetingStore.fetchMeetings())

const upcomingMeetings = computed(() =>
  meetingStore.meetings.filter(m => m.status === 'SCHEDULED' || m.status === 'ONGOING')
)

function participantInitial(p: any) {
  const name = p.name || p.full_name || p.email || ''
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
}

function meetingStatusBadge(status: string) {
  const badges: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ONGOING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function day(date: string) { return new Date(date).getDate().toString() }
function month(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { month: 'short' })
}

function resetForm() {
  form.title = ''
  form.date = ''
  form.time = ''
  form.location = ''
  form.status = 'SCHEDULED'
  form.notulen = ''
}

function closeModal() {
  showCreateModal.value = false
  resetForm()
}

function openEdit(meeting: any) {
  editingId.value = meeting.id
  form.title = meeting.title
  form.date = meeting.date
  form.time = meeting.time
  form.location = meeting.location
  form.status = meeting.status
  form.notulen = meeting.notulen || ''
  showEditModal.value = true
}

function closeEdit() {
  showEditModal.value = false
  editingId.value = null
  resetForm()
}

async function handleCreate() {
  if (!canCreate.value || meetingStore.creating) return
  const res = await meetingStore.createMeeting({ ...form })
  if (res?.success) {
    toast.success('Berhasil', 'Meeting berhasil dibuat')
    closeModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal membuat meeting')
  }
}

async function handleUpdate() {
  if (!canUpdate.value || !editingId.value) return
  const res = await meetingStore.updateMeeting(editingId.value, { ...form })
  if (res?.success || res?.data) {
    toast.success('Berhasil', 'Meeting berhasil diupdate')
    closeEdit()
  } else {
    toast.error('Gagal', res?.message || 'Gagal mengupdate meeting')
  }
}

function confirmDelete(meeting: any) {
  if (confirm(`Hapus meeting "${meeting.title}"?`)) {
    handleDelete(meeting.id)
  }
}

async function handleDelete(id: string) {
  const res = await meetingStore.deleteMeeting(id)
  if (res?.success || res?.status === 200 || res?.status === 204) {
    toast.success('Berhasil', 'Meeting berhasil dihapus')
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus meeting')
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
