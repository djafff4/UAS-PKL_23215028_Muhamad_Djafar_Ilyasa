<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Document Center</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Pusat arsip dokumen internal perusahaan</p>
        </div>
        <button @click="showUploadModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Upload :size="16" />
          Upload Dokumen
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="cat in categories" :key="cat"
        @click="activeCategory = cat"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
        :class="activeCategory === cat
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 border border-surface-200/50 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'">
        {{ cat }}
      </button>
    </div>

    <!-- Search & List -->
    <div class="card overflow-hidden">
      <div class="p-4 border-b border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div class="relative flex-1">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input v-model="search" type="text" placeholder="Cari dokumen..." class="input-field pl-9" />
          </div>
          <select v-model="sortBy" class="input-field w-full sm:w-40">
            <option value="name">Nama</option>
            <option value="date">Tanggal</option>
            <option value="type">Tipe</option>
          </select>
        </div>
      </div>
      <div class="divide-y divide-surface-100/50 dark:divide-surface-800/20">
        <div v-for="doc in filteredDocs" :key="doc.id"
          class="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
            :class="doc.type === 'PDF' ? 'bg-gradient-to-br from-red-500 to-red-600' : doc.type === 'DOCX' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-surface-500 to-surface-600'">
            {{ doc.type }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ doc.title }}</p>
            <p class="text-xs text-surface-500 mt-0.5">{{ doc.divisi }} &bull; {{ doc.fileSize }}</p>
          </div>
          <span class="text-xs text-surface-400 font-medium shrink-0">{{ formatDate(doc.uploadedAt) }}</span>
          <div class="flex items-center gap-1 shrink-0">
            <button @click="handlePreview(doc)" class="btn-ghost p-1.5 rounded-lg" title="Preview">
              <Eye :size="16" />
            </button>
            <button class="btn-ghost p-1.5 rounded-lg">
              <Download :size="16" />
            </button>
            <button @click="handleDeleteClick(doc.id)" class="btn-ghost p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" title="Hapus">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showUploadModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Upload Dokumen</h2>
              <button @click="closeModal" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-4">
              <!-- File Drop Zone -->
              <div
                @click="fileInput?.click()"
                @dragover.prevent="dragOver = true"
                @dragleave="dragOver = false"
                @drop.prevent="onDrop"
                class="relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200"
                :class="dragOver
                  ? 'border-primary-500 bg-primary-500/5'
                  : selectedFile
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500'"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  accept=".pdf,.docx,.doc,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip"
                  @change="onFileSelect"
                />
                <div v-if="!selectedFile" class="space-y-2">
                  <Upload :size="32" class="mx-auto text-surface-400" />
                  <p class="text-sm font-semibold text-surface-600 dark:text-surface-400">Klik atau taruh file di sini</p>
                  <p class="text-xs text-surface-400">PDF, DOCX, XLS, PPT, JPG, ZIP (max 10MB)</p>
                </div>
                <div v-else class="space-y-2">
                  <FileText :size="32" class="mx-auto text-green-500" />
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ selectedFile.name }}</p>
                  <p class="text-xs text-surface-400">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>

              <!-- Title Input -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Dokumen</label>
                <input
                  v-model="docTitle"
                  type="text"
                  placeholder="Masukkan judul dokumen"
                  class="input-field"
                />
              </div>

              <!-- Category Selection -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
                <select v-model="docCategory" class="input-field">
                  <option value="" disabled>Pilih kategori</option>
                  <option v-for="cat in uploadCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closeModal" class="btn-ghost px-4 py-2 text-sm font-semibold" :disabled="docStore.uploading">
                Batal
              </button>
              <button
                @click="handleUpload"
                :disabled="!canUpload || docStore.uploading"
                class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="docStore.uploading" :size="16" class="animate-spin" />
                <Upload v-else :size="16" />
                {{ docStore.uploading ? 'Mengupload...' : 'Upload' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="cancelDelete">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <div class="p-6 text-center">
              <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <AlertTriangle :size="28" class="text-red-500" />
              </div>
              <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Hapus Dokumen?</h3>
              <p class="text-sm text-surface-500 dark:text-surface-400 mb-6">Dokumen ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</p>
              <div class="flex items-center justify-center gap-3">
                <button @click="cancelDelete" class="btn-ghost px-5 py-2 text-sm font-semibold" :disabled="deleting">
                  Batal
                </button>
                <button
                  @click="confirmDelete"
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
        </div>
      </Transition>
    </Teleport>

    <!-- Preview Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPreviewModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4" @click.self="closePreview">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div class="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
              <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">Detail Dokumen</h2>
              <button @click="closePreview" class="btn-ghost p-1.5 rounded-lg">
                <X :size="18" />
              </button>
            </div>

            <!-- Modal Body -->
            <div v-if="previewDoc" class="p-5 space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                  :class="previewDoc.type === 'PDF' ? 'bg-gradient-to-br from-red-500 to-red-600' : previewDoc.type === 'DOCX' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-surface-500 to-surface-600'">
                  {{ previewDoc.type }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{{ previewDoc.title }}</p>
                  <p class="text-xs text-surface-500 mt-0.5">{{ previewDoc.divisi }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-1">Tipe</p>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ previewDoc.type }}</p>
                </div>
                <div class="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-1">Ukuran</p>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ previewDoc.fileSize }}</p>
                </div>
                <div class="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-1">Divisi</p>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ previewDoc.divisi }}</p>
                </div>
                <div class="rounded-xl bg-surface-50 dark:bg-surface-800/50 p-3">
                  <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-1">Tanggal Upload</p>
                  <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ formatDate(previewDoc.uploadedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-5 border-t border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
              <button @click="closePreview" class="btn-ghost px-4 py-2 text-sm font-semibold">
                Tutup
              </button>
              <button class="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all duration-200">
                <Download :size="16" />
                Download
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Upload, Download, Search, X, FileText, Loader2, Eye, Trash2, AlertTriangle } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documents'
import { useToast } from '@/composables/useToast'

const docStore = useDocumentStore()
const toast = useToast()
const search = ref('')
const activeCategory = ref('Semua')
const sortBy = ref('date')

const categories = ['Semua', 'RPS', 'SOP', 'Proposal', 'Timeline', 'Dokumen Rapat', 'Template']
const uploadCategories = ['RPS', 'SOP', 'Proposal', 'Timeline', 'Dokumen Rapat', 'Template']

const showUploadModal = ref(false)
const selectedFile = ref<File | null>(null)
const docTitle = ref('')
const docCategory = ref('')
const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const showDeleteModal = ref(false)
const deleteDocId = ref<string | null>(null)
const deleting = ref(false)
const showPreviewModal = ref(false)
const previewDoc = ref<any>(null)

const canUpload = computed(() => selectedFile.value && docTitle.value && docCategory.value)

onMounted(() => docStore.fetchDocuments())

const filteredDocs = computed(() => {
  let result = docStore.documents
  if (activeCategory.value !== 'Semua') {
    result = result.filter(d => d.type === activeCategory.value || d.title.toLowerCase().includes(activeCategory.value.toLowerCase()))
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(d => d.title.toLowerCase().includes(s) || d.divisi.toLowerCase().includes(s))
  }
  return result
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    selectedFile.value = target.files[0]
    if (!docTitle.value) {
      docTitle.value = target.files[0].name.replace(/\.[^.]+$/, '')
    }
  }
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    selectedFile.value = file
    if (!docTitle.value) {
      docTitle.value = file.name.replace(/\.[^.]+$/, '')
    }
  }
}

function closeModal() {
  showUploadModal.value = false
  selectedFile.value = null
  docTitle.value = ''
  docCategory.value = ''
  dragOver.value = false
}

async function handleUpload() {
  if (!canUpload.value || docStore.uploading) return
  const res = await docStore.uploadDocument(selectedFile.value!, docTitle.value, docCategory.value)
  if (res?.success) {
    toast.success('Berhasil', 'Dokumen berhasil diupload')
    closeModal()
  } else {
    toast.error('Gagal', res?.message || 'Upload dokumen gagal')
  }
}

function handleDeleteClick(id: string) {
  deleteDocId.value = id
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  deleteDocId.value = null
}

async function confirmDelete() {
  if (!deleteDocId.value) return
  deleting.value = true
  const res = await docStore.deleteDocument(deleteDocId.value)
  deleting.value = false
  if (res?.success) {
    toast.success('Berhasil', 'Dokumen berhasil dihapus')
    cancelDelete()
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus dokumen')
  }
}

function handlePreview(doc: any) {
  previewDoc.value = doc
  showPreviewModal.value = true
}

function closePreview() {
  showPreviewModal.value = false
  previewDoc.value = null
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
