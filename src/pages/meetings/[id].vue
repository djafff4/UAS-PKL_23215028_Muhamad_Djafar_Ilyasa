<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="router.push('/meetings')"
      class="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
      <ArrowLeft :size="16" />
      Kembali ke Meeting
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat detail meeting...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!meeting" class="card p-12 text-center">
      <CalendarDays :size="40" class="mx-auto text-surface-300 mb-3" />
      <p class="text-sm font-semibold text-surface-500">Meeting tidak ditemukan</p>
      <p class="text-xs text-surface-400 mt-1">Meeting mungkin sudah dihapus atau URL tidak valid.</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-700 via-rose-800 to-surface-900 p-5 sm:p-6">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-400/10 blur-[60px]"></div>
        <div class="relative z-10">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{{ meeting.title }}</h1>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/60">
                <span class="flex items-center gap-1.5">
                  <CalendarDays :size="14" />
                  {{ meeting.date }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Clock :size="14" />
                  {{ meeting.time }}
                </span>
                <span class="flex items-center gap-1.5">
                  <MapPin :size="14" />
                  {{ meeting.location }}
                </span>
              </div>
            </div>
            <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0"
              :class="meetingStatusBadge(meeting.status)">{{ meeting.status }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button @click="openEdit"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition-all duration-200">
          <Pencil :size="16" />
          Edit Meeting
        </button>
        <button @click="confirmDelete"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all duration-200">
          <Trash2 :size="16" />
          Hapus
        </button>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Left: Detail & Notulen -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Detail Card -->
          <div class="card p-5 sm:p-6">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
              <span class="w-1 h-4 rounded-full bg-rose-500"></span>
              Detail Meeting
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <CalendarDays :size="18" class="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Tanggal</p>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ meeting.date }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <Clock :size="18" class="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Waktu</p>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ meeting.time }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <MapPin :size="18" class="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Lokasi</p>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100 mt-0.5">{{ meeting.location }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <FileText :size="18" class="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider mt-0.5"
                    :class="meetingStatusBadge(meeting.status)">{{ meeting.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notulen Card -->
          <div class="card p-5 sm:p-6">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
              <span class="w-1 h-4 rounded-full bg-rose-500"></span>
              Notulen
            </h3>
            <div v-if="meeting.notulen" class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100/50 dark:border-surface-700/20">
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">{{ meeting.notulen }}</p>
            </div>
            <div v-else class="p-6 text-center">
              <FileText :size="28" class="mx-auto text-surface-300 mb-2" />
              <p class="text-sm text-surface-400">Belum ada notulen untuk meeting ini</p>
            </div>
          </div>
        </div>

        <!-- Right: Participants -->
        <div class="card p-5 sm:p-6 h-fit">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-rose-500"></span>
            <Users :size="16" />
            Peserta
            <span class="text-[10px] font-medium text-surface-400 ml-1">({{ meeting.participants?.length || 0 }})</span>
          </h3>
          <div v-if="meeting.participants?.length" class="space-y-2">
            <div v-for="(p, pi) in meeting.participants" :key="pi"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400 shrink-0">
                {{ participantInitial(p) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{{ p.name || p.full_name || p.email || 'Peserta' }}</p>
                <p v-if="p.email" class="text-[11px] text-surface-400 truncate">{{ p.email }}</p>
              </div>
            </div>
          </div>
          <div v-else class="p-4 text-center">
            <Users :size="24" class="mx-auto text-surface-300 mb-2" />
            <p class="text-sm text-surface-400">Belum ada peserta</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Edit Modal -->
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
                <input v-model="editForm.title" type="text" placeholder="Masukkan judul meeting" class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                  <input v-model="editForm.date" type="date" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Waktu</label>
                  <input v-model="editForm.time" type="time" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Lokasi</label>
                <input v-model="editForm.location" type="text" placeholder="Masukkan lokasi meeting" class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
                <select v-model="editForm.status" class="input-field">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Notulen</label>
                <textarea v-model="editForm.notulen" rows="4" placeholder="Tulis notulen meeting..." class="input-field resize-none"></textarea>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeEdit" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="saving">Batal</button>
              <button @click="handleUpdate" :disabled="!canUpdate || saving"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="saving" :size="16" class="animate-spin" />
                <Pencil v-else :size="16" />
                {{ saving ? 'Menyimpan...' : 'Update' }}
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
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CalendarDays, Clock, MapPin, Pencil, Trash2, Loader2, X, Users, FileText } from 'lucide-vue-next'
import { useMeetingStore } from '@/stores/meetings'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const meetingStore = useMeetingStore()
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const showEditModal = ref(false)

const meetingId = computed(() => route.params.id as string)

const meeting = computed(() => meetingStore.currentMeeting)

const editForm = reactive({
  title: '',
  date: '',
  time: '',
  location: '',
  status: 'SCHEDULED',
  notulen: '',
})

const canUpdate = computed(() =>
  editForm.title && editForm.date && editForm.time && editForm.location
)

onMounted(async () => {
  const id = meetingId.value
  if (id) {
    await meetingStore.fetchMeeting(id)
  }
})

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

function openEdit() {
  if (!meeting.value) return
  editForm.title = meeting.value.title
  editForm.date = meeting.value.date
  editForm.time = meeting.value.time
  editForm.location = meeting.value.location
  editForm.status = meeting.value.status
  editForm.notulen = meeting.value.notulen || ''
  showEditModal.value = true
}

function closeEdit() {
  showEditModal.value = false
}

async function handleUpdate() {
  if (!canUpdate.value || saving.value || !meetingId.value) return
  saving.value = true
  const res = await meetingStore.updateMeeting(meetingId.value, { ...editForm })
  if (res?.success || res?.data) {
    toast.success('Berhasil', 'Meeting berhasil diupdate')
    await meetingStore.fetchMeeting(meetingId.value)
    closeEdit()
  } else {
    toast.error('Gagal', res?.message || 'Gagal mengupdate meeting')
  }
  saving.value = false
}

function confirmDelete() {
  if (!meeting.value) return
  if (confirm(`Hapus meeting "${meeting.value.title}"?`)) {
    handleDelete()
  }
}

async function handleDelete() {
  if (!meetingId.value) return
  const res = await meetingStore.deleteMeeting(meetingId.value)
  if (res?.success || res?.status === 200 || res?.status === 204) {
    toast.success('Berhasil', 'Meeting berhasil dihapus')
    router.push('/meetings')
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
