<template>
  <div class="space-y-6">
    <div v-if="store.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat detail buku...</p>
    </div>

    <template v-else-if="store.currentBook">
      <div class="flex items-center gap-2 mb-4">
        <button @click="router.back()" class="btn-ghost p-2 rounded-lg">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-lg font-bold text-surface-900 dark:text-surface-100">Detail Buku</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1 space-y-6">
          <div class="card overflow-hidden sticky top-6">
            <div class="aspect-[3/4] bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 flex items-center justify-center">
              <img
                v-if="store.currentBook.cover_image_url"
                :src="store.currentBook.cover_image_url"
                :alt="store.currentBook.title"
                class="w-full h-full object-cover"
              />
              <BookOpen v-else :size="64" class="text-surface-300 dark:text-surface-600" />
            </div>
            <div class="p-4 space-y-3">
              <button
                v-if="store.currentBook.storage_file_id"
                @click="downloadBook"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all duration-200"
              >
                <Download :size="16" />
                Unduh File
              </button>
              <button
                @click="showViewer = !showViewer"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                <Eye :size="16" />
                {{ showViewer ? 'Tutup Preview' : 'Preview Dokumen' }}
              </button>
            </div>
          </div>

          <div class="card p-4 space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {{ store.currentBook.title }}
                </h2>
                <p class="text-sm text-surface-600 dark:text-surface-400">
                  {{ store.currentBook.author }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                {{ bookTypeLabel }}
              </span>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                {{ accessTypeLabel }}
              </span>
            </div>

            <div v-if="store.currentBook.category" class="pt-3 border-t border-surface-200/50 dark:border-surface-700/30">
              <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-1">Kategori</p>
              <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
                {{ store.currentBook.category.name }}
              </span>
            </div>

            <div class="pt-3 border-t border-surface-200/50 dark:border-surface-700/30 space-y-2">
              <div v-if="store.currentBook.isbn" class="flex justify-between">
                <span class="text-xs text-surface-500">ISBN</span>
                <span class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ store.currentBook.isbn }}</span>
              </div>
              <div v-if="store.currentBook.publisher" class="flex justify-between">
                <span class="text-xs text-surface-500">Penerbit</span>
                <span class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ store.currentBook.publisher }}</span>
              </div>
              <div v-if="store.currentBook.published_year" class="flex justify-between">
                <span class="text-xs text-surface-500">Tahun</span>
                <span class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ store.currentBook.published_year }}</span>
              </div>
              <div v-if="store.currentBook.page_count" class="flex justify-between">
                <span class="text-xs text-surface-500">Halaman</span>
                <span class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ store.currentBook.page_count }}</span>
              </div>
              <div v-if="store.currentBook.file_size" class="flex justify-between">
                <span class="text-xs text-surface-500">Ukuran</span>
                <span class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ formatFileSize(store.currentBook.file_size) }}</span>
              </div>
            </div>

            <div v-if="store.currentBook.tags && store.currentBook.tags.length > 0" class="pt-3 border-t border-surface-200/50 dark:border-surface-700/30">
              <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mb-2">Tags</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in store.currentBook.tags" :key="tag.id" class="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <div class="pt-3 border-t border-surface-200/50 dark:border-surface-700/30 flex items-center gap-2">
              <button @click="showEditModal = true" class="btn-secondary flex-1 inline-flex items-center justify-center gap-1.5 text-xs py-2">
                <Pencil :size="14" />
                Edit
              </button>
              <button @click="handleDelete" class="btn-ghost flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 inline-flex items-center justify-center gap-1.5 text-xs py-2">
                <Trash2 :size="14" />
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <div v-if="showViewer" class="card overflow-hidden" style="height: calc(100vh - 180px);">
            <DocumentViewer
              v-if="documentContent"
              :content="documentContent"
              :loading="loadingContent"
              :total-pages="store.currentBook.page_count || 1"
              :initial-page="1"
              @page-change="handlePageChange"
              @search="handleSearch"
            />
            <div v-else-if="previewImages.length > 0" class="h-full overflow-auto bg-surface-100 dark:bg-surface-950 p-6">
              <div class="max-w-3xl mx-auto space-y-4">
                <div v-for="preview in previewImages" :key="preview.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img :src="preview.image_url" :alt="`Halaman ${preview.page_number}`" class="w-full h-auto" />
                  <div class="p-3 text-center border-t border-surface-200 dark:border-surface-700">
                    <span class="text-sm font-medium text-surface-600 dark:text-surface-400">
                      Halaman {{ preview.page_number }} dari {{ previewImages.length }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="h-full flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p class="text-sm text-surface-500">Memuat preview...</p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div v-if="store.currentBook.description" class="card p-6">
              <h3 class="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">Deskripsi</h3>
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ store.currentBook.description }}</p>
            </div>

            <div v-if="store.currentBook.ai_summary" class="card p-6">
              <h3 class="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">AI Summary</h3>
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ store.currentBook.ai_summary }}</p>
            </div>

            <div v-if="store.currentBook.keywords && store.currentBook.keywords.length > 0" class="card p-6">
              <h3 class="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">Keywords</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="keyword in store.currentBook.keywords" :key="keyword" class="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                  {{ keyword }}
                </span>
              </div>
            </div>

            <div v-if="store.currentBook.previews && store.currentBook.previews.length > 0" class="card p-6">
              <h3 class="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">Preview Halaman</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div
                  v-for="preview in store.currentBook.previews"
                  :key="preview.id"
                  class="rounded-lg overflow-hidden border border-surface-200/50 dark:border-surface-700/30 cursor-pointer hover:border-primary-500 transition-colors"
                  @click="showViewer = true"
                >
                  <img :src="preview.image_url" :alt="`Halaman ${preview.page_number}`" class="w-full h-auto" />
                  <div class="p-2 text-center bg-surface-50 dark:bg-surface-800/50">
                    <p class="text-xs font-medium text-surface-600 dark:text-surface-400">Halaman {{ preview.page_number }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!store.currentBook.description && !store.currentBook.ai_summary && (!store.currentBook.previews || store.currentBook.previews.length === 0) && !showViewer" class="card p-12 text-center">
              <FileText :size="48" class="mx-auto text-surface-300 dark:text-surface-600 mb-3" />
              <p class="text-sm text-surface-500 dark:text-surface-400">Belum ada konten untuk ditampilkan</p>
              <p class="text-xs text-surface-400 mt-1">Upload file untuk melihat preview</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="card p-8 text-center">
      <BookX :size="48" class="mx-auto text-surface-300 dark:text-surface-600 mb-3" />
      <p class="text-sm font-semibold text-surface-500 dark:text-surface-400">Buku tidak ditemukan</p>
      <button @click="router.push({ name: 'e-library' })" class="btn-primary mt-4">
        Kembali ke E-Library
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, BookX, Download, Eye, Pencil, Trash2, FileText } from 'lucide-vue-next'
import { useElibraryStore } from '@/stores/e-library'
import { useToast } from '@/composables/useToast'
import DocumentViewer from '@/components/e-library/DocumentViewer.vue'

const route = useRoute()
const router = useRouter()
const store = useElibraryStore()
const toast = useToast()

const showEditModal = ref(false)
const showViewer = ref(false)
const loadingContent = ref(false)
const documentContent = ref('')

const previewImages = computed(() => {
  return store.currentBook?.previews || []
})

const bookTypes: Record<string, string> = {
  book: 'Buku',
  module: 'Modul',
  sop: 'SOP',
  policy: 'Kebijakan',
  research: 'Penelitian',
  journal: 'Jurnal',
  template: 'Template',
  guide: 'Panduan',
}

const accessTypes: Record<string, string> = {
  public: 'Publik',
  internal: 'Internal',
  restricted: 'Terbatas',
  private: 'Privat',
}

const bookTypeLabel = computed(() => {
  return bookTypes[store.currentBook?.book_type || 'book'] || 'Buku'
})

const accessTypeLabel = computed(() => {
  return accessTypes[store.currentBook?.access_type || 'internal'] || 'Internal'
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await store.fetchBookById(id)
  }
})

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function downloadBook() {
  if (store.currentBook?.storage_file_id) {
    window.open(`https://drive.google.com/file/d/${store.currentBook.storage_file_id}/view`, '_blank')
  }
}

function handlePageChange(page: number) {
  console.log('Page changed:', page)
}

function handleSearch(query: string) {
  console.log('Search:', query)
}

async function handleDelete() {
  if (!store.currentBook) return
  if (!confirm('Apakah Anda yakin ingin menghapus buku ini?')) return

  const res = await store.deleteBook(store.currentBook.id)
  if (res?.success) {
    toast.success('Berhasil', 'Buku berhasil dihapus')
    router.push({ name: 'e-library' })
  } else {
    toast.error('Gagal', res?.message || 'Gagal menghapus buku')
  }
}
</script>
