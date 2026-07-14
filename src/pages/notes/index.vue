<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Catatan</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Catatan pribadi dan tim</p>
        </div>
        <button @click="openCreate"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Buat Catatan
        </button>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="notesStore.searchQuery" @input="notesStore.applyFilters" type="text" placeholder="Cari catatan..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap gap-2">
      <button @click="notesStore.categoryFilter = ''; notesStore.applyFilters()"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :class="!notesStore.categoryFilter
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-2 ring-purple-500/20'
          : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'">
        Semua
      </button>
      <button v-for="cat in notesStore.categories" :key="cat" @click="notesStore.categoryFilter = cat; notesStore.applyFilters()"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :class="notesStore.categoryFilter === cat
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-2 ring-purple-500/20'
          : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'">
        {{ cat }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="notesStore.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat catatan...</p>
    </div>

    <template v-else>
      <!-- Notes Grid -->
      <div v-if="notesStore.filteredNotes.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div v-for="note in notesStore.filteredNotes" :key="note.id"
          class="group relative rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          :class="{ 'ring-2 ring-purple-500/20 border-purple-300 dark:border-purple-700': note.pinned }"
          @click="openEdit(note)">
          <!-- Pin indicator -->
          <div class="absolute top-3 right-3 flex items-center gap-1">
            <button v-if="note.pinned" @click.stop="togglePin(note)" class="p-1 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all" title="Unpin">
              <Pin :size="14" />
            </button>
            <button v-else @click.stop="togglePin(note)" class="p-1 rounded-lg text-surface-300 opacity-0 group-hover:opacity-100 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all" title="Pin">
              <PinOff :size="14" />
            </button>
          </div>

          <!-- Accent bar -->
          <div class="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
            :class="categoryColor(note.category)"></div>

          <div class="pl-3">
            <!-- Category & Privacy badges -->
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold"
                :class="categoryBadge(note.category)">
                {{ note.category }}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                :class="note.is_personal
                  ? 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'">
                <User v-if="note.is_personal" :size="10" />
                <Users v-else :size="10" />
                {{ note.is_personal ? 'Pribadi' : 'Tim' }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-1.5 line-clamp-1">{{ note.title }}</h3>

            <!-- Content preview -->
            <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-4">{{ note.content }}</p>

            <!-- Tags -->
            <div v-if="note.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="tag in note.tags.slice(0, 3)" :key="tag"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                <Tag :size="10" />
                {{ tag }}
              </span>
              <span v-if="note.tags.length > 3"
                class="text-[10px] text-surface-400 font-medium">+{{ note.tags.length - 3 }}</span>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-surface-100/50 dark:border-surface-700/20">
              <p class="text-[10px] text-surface-400 font-medium">{{ formatDate(note.updated_at || note.created_at) }}</p>
              <button @click.stop="confirmDelete(note)"
                class="p-1 rounded-lg text-surface-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                <Trash2 :size="12" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card p-12 text-center">
        <StickyNote :size="40" class="mx-auto text-surface-300 mb-3" />
        <p class="text-sm font-semibold text-surface-500">
          {{ notesStore.searchQuery || notesStore.categoryFilter ? 'Tidak ada catatan yang cocok' : 'Belum ada catatan' }}
        </p>
        <p class="text-xs text-surface-400 mt-1">
          {{ notesStore.searchQuery || notesStore.categoryFilter ? 'Coba ubah kata kunci atau filter' : 'Buat catatan pertama anda' }}
        </p>
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">
                {{ editingId ? 'Edit Catatan' : 'Buat Catatan Baru' }}
              </h2>
              <button @click="closeModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul</label>
                <input v-model="form.title" type="text" placeholder="Masukkan judul catatan" class="input-field" />
              </div>

              <!-- Content -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Isi Catatan</label>
                <textarea v-model="form.content" rows="6" placeholder="Tulis catatan..." class="input-field resize-none"></textarea>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="form.category" class="input-field">
                  <option v-for="cat in notesStore.categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tags (pisahkan dengan koma)</label>
                <input v-model="form.tagsInput" type="text" placeholder="contoh: rapat, ide, teknis" class="input-field" />
              </div>

              <!-- Privacy Toggle -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center"
                    :class="form.is_personal
                      ? 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'">
                    <component :is="form.is_personal ? User : Users" :size="16" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {{ form.is_personal ? 'Catatan Pribadi' : 'Catatan Tim' }}
                    </p>
                    <p class="text-xs text-surface-400">
                      {{ form.is_personal ? 'Hanya anda yang bisa melihat' : 'Semua anggota divisi bisa melihat' }}
                    </p>
                  </div>
                </div>
                <button @click="form.is_personal = !form.is_personal"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200"
                  :class="form.is_personal ? 'bg-surface-300 dark:bg-surface-600' : 'bg-primary-500'">
                  <div class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="form.is_personal ? 'left-0.5' : 'left-[22px]'"></div>
                </button>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="notesStore.saving">
                Batal
              </button>
              <button @click="handleSave" :disabled="!canSave || notesStore.saving"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
                <Loader2 v-if="notesStore.saving" :size="16" class="animate-spin" />
                <Plus v-else :size="16" />
                {{ notesStore.saving ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan' }}
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
import {
  StickyNote, Plus, Search, Pin, PinOff, X, Trash2, Loader2, Tag, User, Users
} from 'lucide-vue-next'
import { useNotesStore } from '@/stores/notes'
import { useToast } from '@/composables/useToast'

const notesStore = useNotesStore()
const toast = useToast()

const showModal = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  title: '',
  content: '',
  category: 'Umum',
  is_personal: true,
  tagsInput: '',
})

const canSave = computed(() => form.title.trim() && form.content.trim())

onMounted(() => notesStore.fetchNotes())

function openCreate() {
  editingId.value = null
  form.title = ''
  form.content = ''
  form.category = 'Umum'
  form.is_personal = true
  form.tagsInput = ''
  showModal.value = true
}

function openEdit(note: any) {
  editingId.value = note.id
  form.title = note.title
  form.content = note.content
  form.category = note.category
  form.is_personal = note.is_personal
  form.tagsInput = note.tags?.join(', ') || ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

function parseTags(input: string): string[] {
  return input.split(',').map(t => t.trim()).filter(t => t.length > 0)
}

async function handleSave() {
  if (!canSave.value || notesStore.saving) return
  const payload = {
    title: form.title.trim(),
    content: form.content.trim(),
    category: form.category,
    is_personal: form.is_personal,
    tags: parseTags(form.tagsInput),
  }

  let res: any
  if (editingId.value) {
    res = await notesStore.updateNote(editingId.value, payload)
  } else {
    res = await notesStore.createNote(payload)
  }

  if (res?.success || res?.data) {
    toast.success('Berhasil', editingId.value ? 'Catatan berhasil diupdate' : 'Catatan berhasil dibuat')
    closeModal()
  } else {
    toast.error('Gagal', res?.message || 'Gagal menyimpan catatan')
  }
}

function confirmDelete(note: any) {
  if (confirm(`Hapus catatan "${note.title}"?`)) {
    handleDelete(note.id)
  }
}

async function handleDelete(id: string) {
  const res = await notesStore.deleteNote(id)
  if (res?.success || res?.status === 200 || res?.status === 204) {
    toast.success('Berhasil', 'Catatan berhasil dihapus')
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus catatan')
  }
}

async function togglePin(note: any) {
  await notesStore.togglePin(note.id)
  toast.success('Berhasil', note.pinned ? 'Catatan di-pin' : 'Catatan di-unpin')
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function categoryColor(cat: string) {
  const colors: Record<string, string> = {
    Umum: 'bg-purple-500',
    Rapat: 'bg-rose-500',
    Ide: 'bg-amber-500',
    'To-Do': 'bg-emerald-500',
    Technical: 'bg-blue-500',
    Lainnya: 'bg-surface-500',
  }
  return colors[cat] || 'bg-purple-500'
}

function categoryBadge(cat: string) {
  const badges: Record<string, string> = {
    Umum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Rapat: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    Ide: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'To-Do': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Technical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Lainnya: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[cat] || 'bg-surface-100 text-surface-600'
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
