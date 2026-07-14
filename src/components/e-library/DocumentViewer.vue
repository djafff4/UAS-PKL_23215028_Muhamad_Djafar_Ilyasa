<template>
  <div class="document-viewer flex flex-col h-full bg-surface-100 dark:bg-surface-950">
    <div class="topbar flex items-center justify-between px-4 py-2 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 shadow-sm z-10">
      <div class="flex items-center gap-2">
        <button @click="zoomOut" class="btn-ghost p-2 rounded-lg" :disabled="zoom <= 50">
          <ZoomOut :size="18" />
        </button>
        <span class="text-sm font-medium text-surface-600 dark:text-surface-400 min-w-[3rem] text-center">{{ zoom }}%</span>
        <button @click="zoomIn" class="btn-ghost p-2 rounded-lg" :disabled="zoom >= 200">
          <ZoomIn :size="18" />
        </button>
        <div class="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1"></div>
        <button @click="fitWidth" class="btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium">
          Fit Width
        </button>
        <button @click="fitPage" class="btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium">
          Fit Page
        </button>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari..."
            class="input-field pl-9 w-48 text-sm"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1"></div>
        <button @click="prevPage" class="btn-ghost p-2 rounded-lg" :disabled="currentPage <= 1">
          <ChevronLeft :size="18" />
        </button>
        <div class="flex items-center gap-1">
          <input
            v-model.number="pageInput"
            type="number"
            min="1"
            :max="totalPages"
            class="w-12 text-center text-sm font-medium bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded px-1 py-0.5"
            @keyup.enter="goToPage"
            @blur="goToPage"
          />
          <span class="text-sm text-surface-500">/ {{ totalPages }}</span>
        </div>
        <button @click="nextPage" class="btn-ghost p-2 rounded-lg" :disabled="currentPage >= totalPages">
          <ChevronRight :size="18" />
        </button>
        <div class="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1"></div>
        <button @click="toggleDarkMode" class="btn-ghost p-2 rounded-lg">
          <Moon v-if="!isDark" :size="18" />
          <Sun v-else :size="18" />
        </button>
      </div>
    </div>

    <div class="canvas-container flex-1 overflow-auto flex justify-center p-4" ref="canvasContainer">
      <div
        class="a4-canvas bg-white shadow-lg"
        :style="{
          width: `${a4Width * (zoom / 100)}px`,
          minHeight: `${a4Height * (zoom / 100)}px`,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }"
      >
        <div class="a4-content" :style="{ padding: `${marginPx}px` }">
          <div class="text-boundary border border-dashed border-surface-300 dark:border-surface-600 p-6">
            <div v-if="loading" class="flex items-center justify-center h-64">
              <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
            <div v-else-if="content" class="document-content" v-html="content"></div>
            <div v-else class="flex flex-col items-center justify-center h-64 text-surface-400">
              <FileText :size="48" class="mb-4" />
              <p class="text-sm">Tidak ada konten untuk ditampilkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footbar flex items-center justify-between px-4 py-2 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 z-10">
      <div class="flex items-center gap-4">
        <span class="text-xs text-surface-500">
          {{ status }}
        </span>
        <div class="flex items-center gap-2">
          <div class="w-32 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
          <span class="text-xs text-surface-500">{{ progressPercent }}%</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-surface-500">
          <Clock :size="12" class="inline mr-1" />
          {{ readingTime }} menit baca
        </span>
        <span class="text-xs text-surface-400">
          {{ wordCount }} kata
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  ZoomIn, ZoomOut, Search, ChevronLeft, ChevronRight,
  Moon, Sun, FileText, Clock
} from 'lucide-vue-next'

const props = defineProps<{
  content?: string
  loading?: boolean
  totalPages?: number
  initialPage?: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
  search: [query: string]
}>()

const canvasContainer = ref<HTMLElement | null>(null)
const zoom = ref(100)
const currentPage = ref(props.initialPage || 1)
const pageInput = ref(currentPage.value)
const searchQuery = ref('')
const isDark = ref(false)

const a4Width = 794
const a4Height = 1123
const marginPx = 32

const totalPages = computed(() => props.totalPages || 1)

const progressPercent = computed(() => {
  return Math.round((currentPage.value / totalPages.value) * 100)
})

const wordCount = computed(() => {
  if (!props.content) return 0
  return props.content.split(/\s+/).filter(w => w.length > 0).length
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  return Math.max(1, Math.ceil(wordCount.value / wordsPerMinute))
})

const status = computed(() => {
  if (props.loading) return 'Memuat...'
  return `Halaman ${currentPage.value} dari ${totalPages.value}`
})

function zoomIn() {
  if (zoom.value < 200) zoom.value += 10
}

function zoomOut() {
  if (zoom.value > 50) zoom.value -= 10
}

function fitWidth() {
  if (!canvasContainer.value) return
  const containerWidth = canvasContainer.value.clientWidth - 64
  zoom.value = Math.round((containerWidth / a4Width) * 100)
}

function fitPage() {
  if (!canvasContainer.value) return
  const containerHeight = canvasContainer.value.clientHeight - 64
  zoom.value = Math.round((containerHeight / a4Height) * 100)
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    pageInput.value = currentPage.value
    emit('pageChange', currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    pageInput.value = currentPage.value
    emit('pageChange', currentPage.value)
  }
}

function goToPage() {
  const page = Math.max(1, Math.min(totalPages.value, pageInput.value))
  currentPage.value = page
  pageInput.value = page
  emit('pageChange', page)
}

function toggleDarkMode() {
  isDark.value = !isDark.value
}

function handleSearch() {
  if (searchQuery.value) {
    emit('search', searchQuery.value)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'ArrowRight') nextPage()
  if (e.key === '+' && e.ctrlKey) { e.preventDefault(); zoomIn() }
  if (e.key === '-' && e.ctrlKey) { e.preventDefault(); zoomOut() }
}

watch(() => props.initialPage, (newPage) => {
  if (newPage) {
    currentPage.value = newPage
    pageInput.value = newPage
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.document-viewer {
  height: 100%;
  min-height: 0;
}

.a4-canvas {
  aspect-ratio: 210 / 297;
  overflow: hidden;
}

.document-content {
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
}

.document-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.document-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.document-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.document-content :deep(p) {
  margin-bottom: 0.75rem;
}

.document-content :deep(ul),
.document-content :deep(ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.document-content :deep(li) {
  margin-bottom: 0.25rem;
}

.document-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.document-content :deep(th),
.document-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.document-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.document-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.document-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
  font-style: italic;
}

.document-content :deep(pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.document-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
}

.canvas-container {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.canvas-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-container::-webkit-scrollbar-track {
  background: transparent;
}

.canvas-container::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.input-field {
  @apply w-full px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none;
}
</style>
