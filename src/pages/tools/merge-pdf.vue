<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="relative z-10 flex items-center gap-3">
        <RouterLink to="/tools" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <ArrowLeft :size="18" class="text-white" />
        </RouterLink>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Gabung PDF & Gambar</h1>
          <p class="text-sm text-white/60 mt-0.5">Gabungkan file PDF dan gambar menjadi satu dokumen</p>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer"
      :class="isDragging
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
        : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput?.click()"
    >
      <input ref="fileInput" type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple @change="handleFileSelect" />
      <Upload :size="32" class="mx-auto text-surface-400 mb-3" />
      <p class="text-sm font-semibold text-surface-700 dark:text-surface-300">
        Seret file PDF atau gambar ke sini
      </p>
      <p class="text-xs text-surface-400 mt-1">Format: PDF, JPG, PNG, WebP (Maks 50MB per file)</p>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          Urutan File ({{ files.length }})
          <span class="text-xs font-normal text-surface-400">(Tarik untuk ubah urutan)</span>
        </h3>
        <button @click="clearAll" class="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
          Hapus Semua
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="(file, index) in files"
          :key="file.id"
          draggable="true"
          @dragstart="onDragStart(index, $event)"
          @dragover.prevent="onDragOver(index)"
          @drop.prevent="onDrop"
          @dragend="onDragEnd"
          class="group relative flex flex-col justify-between p-3 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200/80 dark:border-surface-700/60 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500/50"
          :class="{ 'opacity-40 scale-95 border-primary-500': dragSourceIndex === index }"
        >
          <!-- Thumbnail -->
          <div class="relative w-full aspect-[3/4] rounded-lg bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-800 overflow-hidden flex items-center justify-center shrink-0">
            <img v-if="file.thumbnail" :src="file.thumbnail" class="w-full h-full object-contain pointer-events-none" />
            <div v-else class="flex flex-col items-center gap-1.5 text-surface-400 dark:text-surface-600">
              <FileImage v-if="file.type === 'image'" :size="24" />
              <FileText v-else :size="24" />
              <span class="text-[10px]">Memuat...</span>
            </div>

            <!-- Badge -->
            <div class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
              <template v-if="file.type === 'image'">Gambar</template>
              <template v-else>{{ file.pageCount }} Hal</template>
            </div>

            <!-- Type Badge -->
            <div class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-xs"
              :class="file.type === 'image' ? 'bg-blue-500/80 text-white' : 'bg-rose-500/80 text-white'">
              {{ file.type === 'image' ? 'IMG' : 'PDF' }}
            </div>

            <!-- Hover Grip -->
            <div class="absolute inset-0 bg-surface-900/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div class="p-1.5 rounded-lg bg-white/90 dark:bg-surface-800/90 shadow-sm text-surface-600 dark:text-surface-300">
                <GripVertical :size="16" />
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-3 min-w-0">
            <p class="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" :title="file.name">
              {{ file.name }}
            </p>
            <p class="text-[10px] text-surface-400 mt-0.5">{{ formatSize(file.size) }}</p>
          </div>

          <!-- Remove Button -->
          <button
            @click.stop="removeFile(index)"
            class="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-600 dark:text-red-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X :size="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- Merge Button -->
    <div v-if="files.length >= 2" class="flex justify-end pt-2">
      <button
        @click="mergeFiles"
        :disabled="merging"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 disabled:shadow-none w-full sm:w-auto justify-center"
      >
        <Loader2 v-if="merging" :size="18" class="animate-spin" />
        <Merge v-else :size="18" />
        {{ merging ? 'Menggabungkan...' : 'Gabungkan Semua' }}
      </button>
    </div>

    <!-- Success -->
    <div v-if="downloadUrl" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-3 flex-1">
          <CheckCircle :size="20" class="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Berhasil digabungkan!</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{{ files.length }} file → 1 PDF</p>
          </div>
        </div>
        <a
          :href="downloadUrl"
          :download="downloadName"
          class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <Download :size="14" />
          Unduh PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { PDFDocument } from 'pdf-lib'
import {
  ArrowLeft, Upload, FileText, FileImage, X, Merge, Loader2,
  Download, CheckCircle, GripVertical
} from 'lucide-vue-next'

interface MergeFile {
  id: string
  name: string
  size: number
  type: 'pdf' | 'image'
  data: ArrayBuffer
  pageCount: number
  thumbnail: string | null
}

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<MergeFile[]>([])
const isDragging = ref(false)
const merging = ref(false)
const downloadUrl = ref<string | null>(null)
const downloadName = ref('merged.pdf')
const dragSourceIndex = ref<number | null>(null)

let fileIdCounter = 0

const isPdf = (f: File) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
const isImage = (f: File) => f.type.startsWith('image/')

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
    target.value = ''
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    addFiles(Array.from(e.dataTransfer.files))
  }
}

async function addFiles(newFiles: File[]) {
  console.log('[ADD FILES] Total files received:', newFiles.length)
  
  for (const file of newFiles) {
    console.log('[ADD FILES] Processing:', file.name, file.type, file.size)
    
    if (!isPdf(file) && !isImage(file)) {
      console.log('[ADD FILES] Skipped (not PDF/image):', file.name)
      continue
    }
    if (file.size > 50 * 1024 * 1024) {
      console.log('[ADD FILES] Skipped (too large):', file.name)
      continue
    }

    const id = `file_${++fileIdCounter}`
    console.log('[ADD FILES] Created ID:', id)

    if (isPdf(file)) {
      console.log('[ADD FILES] Reading PDF:', file.name)
      const arrayBuf = await file.arrayBuffer()
      console.log('[ADD FILES] ArrayBuffer size:', arrayBuf.byteLength)
      
      const uint8 = new Uint8Array(arrayBuf)
      console.log('[ADD FILES] Uint8Array length:', uint8.length)

      let pageCount = 0
      try {
        console.log('[ADD FILES] Loading PDF with pdf-lib...')
        const tempDoc = await PDFDocument.load(uint8.buffer.slice(0))
        pageCount = tempDoc.getPageCount()
        console.log('[ADD FILES] PDF page count:', pageCount)
      } catch (e) {
        console.error('[ADD FILES] PDF parse ERROR:', file.name, e)
        continue
      }

      const dataCopy = uint8.buffer.slice(0)
      console.log('[ADD FILES] Data copy size:', dataCopy.byteLength)

      const newItem = {
        id,
        name: file.name,
        size: file.size,
        type: 'pdf' as const,
        data: dataCopy,
        pageCount,
        thumbnail: null,
      }
      
      console.log('[ADD FILES] Pushing item:', newItem.name)
      files.value = [...files.value, newItem]
      console.log('[ADD FILES] Total files now:', files.value.length)

      const url = URL.createObjectURL(file)
      generatePdfThumbnail(url, id)

    } else {
      const arrayBuf = await file.arrayBuffer()
      const dataCopy = arrayBuf.slice(0)
      const thumbnail = await generateImageThumbnail(file)

      files.value = [...files.value, {
        id,
        name: file.name,
        size: file.size,
        type: 'image',
        data: dataCopy,
        pageCount: 1,
        thumbnail,
      }]
    }

    downloadUrl.value = null
  }
  
  console.log('[ADD FILES] Final files count:', files.value.length)
}

async function generatePdfThumbnail(url: string, fileId: string) {
  try {
    const pdfjsLib = await loadPdfJs()
    if (!pdfjsLib) return

    const doc = await pdfjsLib.getDocument(url).promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: 0.4 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise
      const file = files.value.find(f => f.id === fileId)
      if (file) file.thumbnail = canvas.toDataURL('image/jpeg', 0.7)
    }
  } catch (err) {
    console.warn('PDF thumbnail error:', err)
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function generateImageThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 200
      const ratio = Math.min(size / img.width, size / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      } else {
        resolve(url)
      }
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve('')
    }
    img.src = url
  })
}

let pdfjsPromise: Promise<any> | null = null
function loadPdfJs(): Promise<any> {
  if (pdfjsPromise) return pdfjsPromise
  pdfjsPromise = new Promise((resolve) => {
    if ((window as any)['pdfjs-dist/build/pdf']) {
      resolve((window as any)['pdfjs-dist/build/pdf'])
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      const lib = (window as any)['pdfjs-dist/build/pdf']
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(lib)
    }
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
  return pdfjsPromise
}

// Drag reorder
function onDragStart(index: number, e: DragEvent) {
  dragSourceIndex.value = index
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index: number) {
  if (dragSourceIndex.value === null || dragSourceIndex.value === index) return
  const item = files.value.splice(dragSourceIndex.value, 1)[0]
  files.value.splice(index, 0, item)
  dragSourceIndex.value = index
  downloadUrl.value = null
}

function onDrop() { dragSourceIndex.value = null }
function onDragEnd() { dragSourceIndex.value = null }

function removeFile(index: number) {
  files.value.splice(index, 1)
  downloadUrl.value = null
}

function clearAll() {
  files.value = []
  downloadUrl.value = null
}

async function mergeFiles() {
  if (files.value.length < 2) return
  merging.value = true
  downloadUrl.value = null

  try {
    const mergedPdf = await PDFDocument.create()

    for (const file of files.value) {
      if (file.type === 'pdf') {
        const pdf = await PDFDocument.load(file.data)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => mergedPdf.addPage(p))
      } else {
        // Image → embed as PDF page
        let img
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (ext === 'png') {
          img = await mergedPdf.embedPng(file.data)
        } else {
          img = await mergedPdf.embedJpg(file.data)
        }

        const page = mergedPdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
    }

    const bytes = await mergedPdf.save()
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })

    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = URL.createObjectURL(blob)
    downloadName.value = `merged_${new Date().toISOString().slice(0, 10)}.pdf`
  } catch (err) {
    console.error('Merge failed:', err)
  } finally {
    merging.value = false
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
