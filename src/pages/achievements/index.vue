<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Achievement & Innovation</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Mencatat kontribusi tambahan dan inovasi tim</p>
        </div>
        <button @click="showCreateModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Buat Achievement
        </button>
      </div>
    </div>

    <!-- Category Filter -->
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

    <!-- Achievement Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div v-for="a in filteredAchievements" :key="a.id"
        class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="absolute -inset-x-20 -top-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          :class="achievementGlow(a.category)"></div>
        <div class="relative z-10 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
            :class="achievementColor(a.category)">
            <Trophy v-if="a.category === 'FITUR_BARU'" :size="18" />
            <Zap v-else-if="a.category === 'OPTIMASI'" :size="18" />
            <Lightbulb v-else-if="a.category === 'INOVASI'" :size="18" />
            <TrendingUp v-else :size="18" />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ a.title }}</h3>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="achievementBadge(a.category)">{{ a.category.replace('_', ' ') }}</span>
                <button @click.stop="openEditModal(a)" class="p-1 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all opacity-0 group-hover:opacity-100" title="Edit">
                  <Pencil :size="14" />
                </button>
                <button @click.stop="openDeleteModal(a)" class="p-1 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100" title="Hapus">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
            <p class="text-xs text-surface-500 mt-1.5 leading-relaxed">{{ a.description }}</p>
            <div class="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-medium text-surface-400">
              <span class="flex items-center gap-1.5"><CalendarDays :size="12" /> {{ formatDate(a.date) }}</span>
              <span class="flex items-center gap-1.5"><Zap :size="12" /> {{ a.impact }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Achievement Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Buat Achievement Baru</h2>
              <button @click="closeModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Achievement</label>
                <input v-model="form.title" type="text" placeholder="Masukkan judul achievement" class="input-field" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
                <textarea v-model="form.description" rows="3" placeholder="Deskripsikan achievement..." class="input-field resize-none"></textarea>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="form.category" class="input-field">
                  <option value="FITUR_BARU">Fitur Baru</option>
                  <option value="OPTIMASI">Optimasi</option>
                  <option value="INOVASI">Inovasi</option>
                  <option value="IMPROVEMENT">Improvement</option>
                </select>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                <input v-model="form.date" type="date" class="input-field" />
              </div>

              <!-- Impact -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Dampak / Impact</label>
                <input v-model="form.impact" type="text" placeholder="Contoh: Meningkatkan efisiensi 20%" class="input-field" />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="achievementStore.creating">
                Batal
              </button>
              <button
                @click="handleCreate"
                :disabled="!canCreate || achievementStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="achievementStore.creating" :size="16" class="animate-spin" />
                <Plus v-else :size="16" />
                {{ achievementStore.creating ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Achievement Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeEditModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Edit Achievement</h2>
              <button @click="closeEditModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Achievement</label>
                <input v-model="editForm.title" type="text" placeholder="Masukkan judul achievement" class="input-field" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
                <textarea v-model="editForm.description" rows="3" placeholder="Deskripsikan achievement..." class="input-field resize-none"></textarea>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="editForm.category" class="input-field">
                  <option value="FITUR_BARU">Fitur Baru</option>
                  <option value="OPTIMASI">Optimasi</option>
                  <option value="INOVASI">Inovasi</option>
                  <option value="IMPROVEMENT">Improvement</option>
                </select>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tanggal</label>
                <input v-model="editForm.date" type="date" class="input-field" />
              </div>

              <!-- Impact -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Dampak / Impact</label>
                <input v-model="editForm.impact" type="text" placeholder="Contoh: Meningkatkan efisiensi 20%" class="input-field" />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeEditModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="achievementStore.creating">
                Batal
              </button>
              <button
                @click="handleUpdate"
                :disabled="!canEdit || achievementStore.creating"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="achievementStore.creating" :size="16" class="animate-spin" />
                <Pencil v-else :size="16" />
                {{ achievementStore.creating ? 'Menyimpan...' : 'Update' }}
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
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Hapus Achievement</h2>
              <button @click="closeDeleteModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <Trash2 :size="18" class="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">Yakin ingin menghapus?</p>
                  <p class="text-xs text-surface-500 mt-1">Achievement <span class="font-bold">"{{ deletingAchievement?.title }}"</span> akan dihapus permanen.</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeDeleteModal" class="btn-ghost px-4 py-2 text-sm font-semibold">
                Batal
              </button>
              <button
                @click="handleDelete"
                class="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all duration-200"
              >
                <Trash2 :size="16" />
                Hapus
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
import { Trophy, Zap, Lightbulb, TrendingUp, CalendarDays, Plus, X, Loader2, Pencil, Trash2 } from 'lucide-vue-next'
import { useAchievementStore } from '@/stores/achievements'
import { useToast } from '@/composables/useToast'

const achievementStore = useAchievementStore()
const toast = useToast()
const activeCategory = ref('Semua')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingAchievement = ref<any>(null)
const deletingAchievement = ref<any>(null)

const categories = [
  { key: 'Semua', label: 'Semua' },
  { key: 'FITUR_BARU', label: 'Fitur Baru' },
  { key: 'OPTIMASI', label: 'Optimasi' },
  { key: 'INOVASI', label: 'Inovasi' },
  { key: 'IMPROVEMENT', label: 'Improvement' },
]

const form = reactive({
  title: '',
  description: '',
  category: 'FITUR_BARU',
  date: '',
  impact: '',
})

const canCreate = computed(() => form.title && form.description && form.date && form.impact)

const editForm = reactive({
  title: '',
  description: '',
  category: 'FITUR_BARU',
  date: '',
  impact: '',
})

const canEdit = computed(() => editForm.title && editForm.description && editForm.date && editForm.impact)

onMounted(() => achievementStore.fetchAchievements())

const filteredAchievements = computed(() => {
  if (activeCategory.value === 'Semua') return achievementStore.achievements
  return achievementStore.achievements.filter((a: any) => a.category === activeCategory.value)
})

function achievementGlow(category: string) {
  const glows: Record<string, string> = {
    FITUR_BARU: 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent',
    OPTIMASI: 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent',
    INOVASI: 'bg-gradient-to-br from-purple-500/10 via-transparent to-transparent',
    IMPROVEMENT: 'bg-gradient-to-br from-amber-500/10 via-transparent to-transparent',
  }
  return glows[category] || ''
}

function achievementColor(category: string) {
  const colors: Record<string, string> = {
    FITUR_BARU: 'bg-gradient-to-br from-blue-500 to-blue-600',
    OPTIMASI: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    INOVASI: 'bg-gradient-to-br from-purple-500 to-purple-600',
    IMPROVEMENT: 'bg-gradient-to-br from-amber-500 to-amber-600',
  }
  return colors[category] || 'bg-gradient-to-br from-surface-500 to-surface-600'
}

function achievementBadge(category: string) {
  const badges: Record<string, string> = {
    FITUR_BARU: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    OPTIMASI: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    INOVASI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    IMPROVEMENT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  }
  return badges[category] || ''
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function closeModal() {
  showCreateModal.value = false
  form.title = ''
  form.description = ''
  form.category = 'FITUR_BARU'
  form.date = ''
  form.impact = ''
}

async function handleCreate() {
  if (!canCreate.value || achievementStore.creating) return
  const res = await achievementStore.createAchievement({ ...form })
  if (res?.success || res?.data) {
    toast.success('Berhasil', 'Achievement berhasil dibuat')
    closeModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal membuat achievement')
  }
}

function openEditModal(achievement: any) {
  editingAchievement.value = achievement
  editForm.title = achievement.title
  editForm.description = achievement.description
  editForm.category = achievement.category
  editForm.date = achievement.date
  editForm.impact = achievement.impact
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingAchievement.value = null
  editForm.title = ''
  editForm.description = ''
  editForm.category = 'FITUR_BARU'
  editForm.date = ''
  editForm.impact = ''
}

async function handleUpdate() {
  if (!canEdit.value || !editingAchievement.value || achievementStore.creating) return
  const res = await achievementStore.updateAchievement(editingAchievement.value.id, { ...editForm })
  if (res?.success) {
    toast.success('Berhasil', 'Achievement berhasil diupdate')
    closeEditModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal mengupdate achievement')
  }
}

function openDeleteModal(achievement: any) {
  deletingAchievement.value = achievement
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deletingAchievement.value = null
}

async function handleDelete() {
  if (!deletingAchievement.value) return
  const res = await achievementStore.deleteAchievement(deletingAchievement.value.id)
  if (res?.success) {
    toast.success('Berhasil', 'Achievement berhasil dihapus')
    closeDeleteModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus achievement')
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
