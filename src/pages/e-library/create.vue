<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 mb-4">
      <button @click="router.back()" class="btn-ghost p-2 rounded-lg">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="text-lg font-bold text-surface-900 dark:text-surface-100">Tambah Dokumen Baru</h1>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between mb-8">
        <div v-for="(step, index) in steps" :key="index" class="flex items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              :class="currentStep > index
                ? 'bg-green-500 text-white'
                : currentStep === index
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'"
            >
              <Check v-if="currentStep > index" :size="16" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              class="text-sm font-medium hidden sm:block"
              :class="currentStep >= index ? 'text-surface-900 dark:text-surface-100' : 'text-surface-400'"
            >
              {{ step.title }}
            </span>
          </div>
          <div v-if="index < steps.length - 1" class="w-8 sm:w-16 h-0.5 mx-2" :class="currentStep > index ? 'bg-green-500' : 'bg-surface-200 dark:bg-surface-700'" />
        </div>
      </div>

      <div v-if="currentStep === 0" class="space-y-4">
        <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Informasi Dasar</h2>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Dokumen *</label>
          <input v-model="form.title" type="text" class="input-field" placeholder="Masukkan judul dokumen" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Penulis *</label>
          <input v-model="form.author" type="text" class="input-field" placeholder="Masukkan nama penulis" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">ISBN</label>
            <input v-model="form.isbn" type="text" class="input-field" placeholder="ISBN" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Penerbit</label>
            <input v-model="form.publisher" type="text" class="input-field" placeholder="Nama penerbit" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tahun Terbit</label>
            <input v-model.number="form.published_year" type="number" class="input-field" placeholder="2024" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Bahasa</label>
            <select v-model="form.language" class="input-field">
              <option value="id">Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi</label>
          <textarea v-model="form.description" rows="3" class="input-field" placeholder="Deskripsi dokumen..." />
        </div>
      </div>

      <div v-if="currentStep === 1" class="space-y-4">
        <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Kategori & Akses</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Dokumen</label>
            <select v-model="form.book_type" class="input-field">
              <option v-for="type in bookTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kategori</label>
            <select v-model="form.category_id" class="input-field">
              <option value="">Pilih kategori (opsional)</option>
              <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <div class="mt-2 flex items-center gap-2">
              <input
                v-model="newCategoryName"
                type="text"
                class="input-field flex-1 text-sm"
                placeholder="Atau buat kategori baru..."
                @keyup.enter="handleCreateCategory"
              />
              <button
                @click="handleCreateCategory"
                :disabled="!newCategoryName.trim() || creatingCategory"
                class="btn-ghost px-3 py-2 text-sm font-medium"
              >
                <Plus v-if="!creatingCategory" :size="14" />
                <Loader2 v-else :size="14" class="animate-spin" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Akses</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              v-for="access in accessTypes"
              :key="access.value"
              @click="form.access_type = access.value"
              class="p-3 rounded-xl border-2 transition-all text-left"
              :class="form.access_type === access.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'"
            >
              <p class="text-sm font-bold" :class="form.access_type === access.value ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-surface-300'">{{ access.label }}</p>
              <p class="text-xs text-surface-500 mt-1">{{ access.desc }}</p>
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Penyimpanan</label>
          <select v-model="form.storage_provider" class="input-field">
            <option value="">Pilih penyimpanan</option>
            <option value="google_drive">Google Drive</option>
            <option value="s3">AWS S3</option>
            <option value="minio">MinIO</option>
            <option value="cloudflare_r2">Cloudflare R2</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tags (pisahkan dengan koma)</label>
          <input v-model="tagsInput" type="text" class="input-field" placeholder="leadership, management, training" />
        </div>
      </div>

      <div v-if="currentStep === 2" class="space-y-4">
        <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Upload File</h2>
        <div
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="onDrop"
          @click="fileInput?.click()"
          class="relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200"
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
            accept=".pdf,.docx,.doc,.xls,.xlsx,.ppt,.pptx,.txt"
            @change="onFileSelect"
          />
          <div v-if="!selectedFile" class="space-y-3">
            <Upload :size="48" class="mx-auto text-surface-400" />
            <div>
              <p class="text-base font-semibold text-surface-600 dark:text-surface-400">Klik atau taruh file di sini</p>
              <p class="text-sm text-surface-400 mt-1">PDF, DOCX, XLS, PPT, TXT (max 50MB)</p>
            </div>
          </div>
          <div v-else class="space-y-3">
            <FileCheck :size="48" class="mx-auto text-green-500" />
            <div>
              <p class="text-base font-semibold text-surface-900 dark:text-surface-100">{{ selectedFile.name }}</p>
              <p class="text-sm text-surface-400 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <button @click.stop="selectedFile = null" class="btn-ghost text-sm text-red-500">Hapus file</button>
          </div>
        </div>

        <div v-if="selectedFile" class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/30">
          <h4 class="text-sm font-bold text-surface-700 dark:text-surface-300 mb-2">Preview Konversi</h4>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <FileText :size="16" />
              <span>File akan diupload ke {{ form.storage_provider || 'Google Drive' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <Image :size="16" />
              <span>Preview halaman akan dibuat otomatis</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <Sparkles :size="16" />
              <span>AI summary akan di-generate</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 3" class="space-y-4">
        <div v-if="uploading" class="text-center py-12">
          <div class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Mengupload Dokumen...</h3>
          <p class="text-sm text-surface-500">Mohon tunggu, file sedang diproses</p>
          <div class="mt-6 max-w-xs mx-auto">
            <div class="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="text-xs text-surface-400 mt-2">{{ uploadProgress }}%</p>
          </div>
        </div>

        <div v-else-if="uploadSuccess" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle :size="32" class="text-green-500" />
          </div>
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Berhasil!</h3>
          <p class="text-sm text-surface-500 mb-6">Dokumen berhasil diupload dan sedang diproses</p>
          <div class="flex items-center justify-center gap-3">
            <button @click="router.push({ name: 'e-library' })" class="btn-primary">
              Kembali ke E-Library
            </button>
            <button @click="resetForm" class="btn-secondary">
              Upload Lagi
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <AlertCircle :size="32" class="text-surface-400" />
          </div>
          <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Konfirmasi</h3>
          <p class="text-sm text-surface-500 mb-6">Pastikan semua informasi sudah benar sebelum mengupload</p>
          <div class="max-w-md mx-auto text-left space-y-2 mb-6">
            <div class="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
              <span class="text-sm text-surface-500">Judul</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ form.title }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
              <span class="text-sm text-surface-500">Penulis</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ form.author }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
              <span class="text-sm text-surface-500">Tipe</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ bookTypeLabel }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
              <span class="text-sm text-surface-500">File</span>
              <span class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ selectedFile?.name || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 border-t border-surface-200/50 dark:border-surface-700/30 mt-6">
        <button
          v-if="currentStep > 0 && !uploading && !uploadSuccess"
          @click="currentStep--"
          class="btn-ghost inline-flex items-center gap-2"
        >
          <ArrowLeft :size="16" />
          Kembali
        </button>
        <div v-else></div>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="btn-primary inline-flex items-center gap-2"
        >
          Lanjut
          <ArrowRight :size="16" />
        </button>
        <button
          v-else-if="!uploading && !uploadSuccess"
          @click="handleUpload"
          :disabled="!selectedFile || uploading"
          class="btn-primary inline-flex items-center gap-2"
        >
          <Upload :size="16" />
          Upload Dokumen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, ArrowRight, Check, Upload, FileCheck, FileText, Image,
  Sparkles, CheckCircle, AlertCircle, Plus, Loader2
} from 'lucide-vue-next'
import { useElibraryStore } from '@/stores/e-library'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const store = useElibraryStore()
const toast = useToast()

const currentStep = ref(0)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadProgress = ref(0)
const tagsInput = ref('')
const newCategoryName = ref('')
const creatingCategory = ref(false)

const steps = [
  { title: 'Info Dasar' },
  { title: 'Kategori' },
  { title: 'Upload' },
  { title: 'Konfirmasi' },
]

const bookTypes = [
  { value: 'book', label: 'Buku' },
  { value: 'module', label: 'Modul' },
  { value: 'sop', label: 'SOP' },
  { value: 'policy', label: 'Kebijakan' },
  { value: 'research', label: 'Penelitian' },
  { value: 'journal', label: 'Jurnal' },
  { value: 'template', label: 'Template' },
  { value: 'guide', label: 'Panduan' },
]

const accessTypes = [
  { value: 'public', label: 'Publik', desc: 'Semua orang' },
  { value: 'internal', label: 'Internal', desc: 'Staff AKMAN' },
  { value: 'restricted', label: 'Terbatas', desc: 'Departemen tertentu' },
  { value: 'private', label: 'Privat', desc: 'Hanya Anda' },
]

const form = ref({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  published_year: new Date().getFullYear(),
  category_id: '',
  description: '',
  language: 'id',
  book_type: 'book',
  access_type: 'internal',
  storage_provider: 'google_drive',
})

const bookTypeLabel = computed(() => {
  return bookTypes.find(t => t.value === form.value.book_type)?.label || 'Buku'
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return form.value.title && form.value.author
  }
  return true
})

onMounted(async () => {
  await store.fetchCategories()
})

function nextStep() {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

async function handleCreateCategory() {
  if (!newCategoryName.value.trim()) return
  creatingCategory.value = true
  try {
    const res = await store.createCategory({ name: newCategoryName.value.trim() })
    if (res?.success) {
      toast.success('Berhasil', 'Kategori berhasil dibuat')
      newCategoryName.value = ''
      await store.fetchCategories()
    } else {
      toast.error('Gagal', res?.message || 'Gagal membuat kategori')
    }
  } catch (err: any) {
    toast.error('Gagal', err?.message || 'Gagal membuat kategori')
  } finally {
    creatingCategory.value = false
  }
}

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    selectedFile.value = target.files[0]
  }
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function resetForm() {
  form.value = {
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    published_year: new Date().getFullYear(),
    category_id: '',
    description: '',
    language: 'id',
    book_type: 'book',
    access_type: 'internal',
    storage_provider: 'google_drive',
  }
  selectedFile.value = null
  tagsInput.value = ''
  currentStep.value = 0
  uploadSuccess.value = false
  uploading.value = false
  uploadProgress.value = 0
}

async function handleUpload() {
  if (!selectedFile.value) return
  
  uploading.value = true
  uploadProgress.value = 0

  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10
    }
  }, 500)

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('title', form.value.title)
    formData.append('author', form.value.author)
    formData.append('book_type', form.value.book_type)
    formData.append('access_type', form.value.access_type)
    formData.append('storage_provider', form.value.storage_provider)
    formData.append('language', form.value.language)
    formData.append('description', form.value.description)
    formData.append('isbn', form.value.isbn)
    formData.append('publisher', form.value.publisher)
    formData.append('published_year', form.value.published_year.toString())
    if (form.value.category_id) {
      formData.append('category_id', form.value.category_id)
    }

    const res = await store.uploadDocument(formData)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (res?.success) {
      uploadSuccess.value = true
      toast.success('Berhasil', 'Dokumen berhasil diupload')
    } else {
      toast.error('Gagal', res?.message || 'Gagal mengupload dokumen')
    }
  } catch (err: any) {
    clearInterval(progressInterval)
    toast.error('Gagal', err?.message || 'Gagal mengupload dokumen')
  } finally {
    uploading.value = false
  }
}
</script>
