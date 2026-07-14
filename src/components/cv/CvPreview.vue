<template>
  <div class="space-y-3">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5">
        <select v-model="cv.template" class="px-2.5 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-[11px] font-medium text-surface-700 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
          <option value="modern">Modern Clean</option>
          <option value="akman-academy">Akman Academy</option>
          <option value="akman-corporate">Akman Corporate</option>
          <option value="executive">Executive</option>
          <option value="minimalist">Minimalist</option>
          <option value="creative">Creative</option>
        </select>
      </div>
      <div class="flex items-center gap-1.5">
        <button @click="showFullscreen = true" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all" title="Fullscreen Preview">
          <Maximize2 :size="14" />
        </button>
        <button @click="exportServerPdf" :disabled="serverExporting" class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white text-[11px] font-bold rounded-lg transition-all disabled:cursor-not-allowed" title="Download PDF (clickable links)">
          <FileText v-if="!serverExporting" :size="12" />
          <Loader2 v-else :size="12" class="animate-spin" />
          PDF
        </button>
        <button @click="exportImage" :disabled="exporting" class="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 text-[11px] font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Download :size="12" />
          PNG
        </button>
      </div>
    </div>

    <!-- ──────── Thumbnail Preview (scaled A4) ──────── -->
    <div ref="previewContainer" class="cv-thumb-wrap">
      <div class="cv-thumb-scaler" :style="{ transform: `scale(${scale})`, transformOrigin: 'top left' }">
        <CvTemplateModern v-if="cv.template === 'modern'" ref="templateRef" :cv="cv" />
        <CvTemplateAkman v-else-if="cv.template === 'akman-academy'" ref="templateRef" :cv="cv" />
        <CvTemplateAkmanCorporate v-else-if="cv.template === 'akman-corporate'" ref="templateRef" :cv="cv" />
        <CvTemplateExecutive v-else-if="cv.template === 'executive'" ref="templateRef" :cv="cv" />
        <CvTemplateMinimalist v-else-if="cv.template === 'minimalist'" ref="templateRef" :cv="cv" />
        <CvTemplateCreative v-else ref="templateRef" :cv="cv" />
      </div>
    </div>

    <!-- ──────── Fullscreen Modal ──────── -->
    <Teleport to="body">
      <div v-if="showFullscreen" class="cv-fs-overlay" @click.self="showFullscreen = false">
        <div class="cv-fs-container">
          <div class="cv-fs-header">
            <h3 class="cv-fs-title">Preview CV — {{ cv.full_name || 'Tanpa Nama' }}</h3>
            <div class="flex items-center gap-2">
              <button @click="exportServerPdf" :disabled="serverExporting" class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-400 text-white text-xs font-bold rounded-lg transition-all disabled:cursor-not-allowed">
                <FileText v-if="!serverExporting" :size="13" />
                <Loader2 v-else :size="13" class="animate-spin" />
                Export PDF
              </button>
              <button @click="showFullscreen = false" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                <X :size="18" />
              </button>
            </div>
          </div>
          <div class="cv-fs-body">
            <div class="cv-fs-center">
              <div ref="fsContentRef" class="cv-fs-content">
                <CvTemplateModern v-if="cv.template === 'modern'" :cv="cv" />
                <CvTemplateAkman v-else-if="cv.template === 'akman-academy'" :cv="cv" />
                <CvTemplateAkmanCorporate v-else-if="cv.template === 'akman-corporate'" :cv="cv" />
                <CvTemplateExecutive v-else-if="cv.template === 'executive'" :cv="cv" />
                <CvTemplateMinimalist v-else-if="cv.template === 'minimalist'" :cv="cv" />
                <CvTemplateCreative v-else :cv="cv" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FileText, Download, Loader2, Maximize2, X } from 'lucide-vue-next'
import CvTemplateAkman from './CvTemplateAkman.vue'
import CvTemplateAkmanCorporate from './CvTemplateAkmanCorporate.vue'
import CvTemplateModern from './CvTemplateModern.vue'
import CvTemplateExecutive from './CvTemplateExecutive.vue'
import CvTemplateMinimalist from './CvTemplateMinimalist.vue'
import CvTemplateCreative from './CvTemplateCreative.vue'
import type { CV } from '@/types'
import { useCvExport } from '@/composables/useCvExport'

const props = defineProps<{
  cv: CV
}>()

const emit = defineEmits<{
  exported: []
}>()

const previewContainer = ref<HTMLElement | null>(null)
const templateRef = ref<{ cvContent: HTMLElement | null } | null>(null)
const scale = ref(0.45)

let resizeObserver: ResizeObserver | null = null

function updateScale() {
  if (previewContainer.value) {
    const w = previewContainer.value.clientWidth
    scale.value = Math.min(w / 794, 0.6)
  }
}

onMounted(() => {
  updateScale()
  if (previewContainer.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(previewContainer.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const showFullscreen = ref(false)
const fsContentRef = ref<HTMLElement | null>(null)

function getTargetEl(): HTMLElement | null {
  if (showFullscreen.value && fsContentRef.value) {
    return (fsContentRef.value.firstElementChild as HTMLElement) ?? fsContentRef.value
  }
  if (templateRef.value?.cvContent) {
    return templateRef.value.cvContent
  }
  const scaler = previewContainer.value?.querySelector('.cv-thumb-scaler')
  return (scaler?.firstElementChild as HTMLElement) ?? null
}

// ─── Export composable ─────────────────────────────────
const {
  exporting,
  serverExporting,
  exportServerPdf: exportServerPdfFn,
  exportImage: exportImageFn,
} = useCvExport({
  cv: props.cv,
  getTargetEl,
})

/** Wrapper that emits 'exported' after success */
async function exportServerPdf() {
  await exportServerPdfFn()
  emit('exported')
}

/** Wrapper that emits 'exported' after success */
async function exportImage() {
  await exportImageFn()
  emit('exported')
}
</script>

<style scoped>
.cv-thumb-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  aspect-ratio: 210 / 297;
  max-height: 70vh;
}

.cv-thumb-scaler {
  position: absolute;
  top: 0;
  left: 0;
  width: 794px;
  transform-origin: top left;
}

.cv-fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.cv-fs-container {
  width: 100%;
  max-width: 900px;
  max-height: 95vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.cv-fs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.cv-fs-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.cv-fs-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #f1f5f9;
}

.cv-fs-center {
  display: flex;
  justify-content: center;
}

.cv-fs-content {
  width: 794px;
  height: 1123px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-radius: 8px;
  overflow: hidden;
}

:global(.dark) .cv-thumb-wrap {
  border-color: #334155;
}

:global(.dark) .cv-fs-container {
  background: #1e293b;
}

:global(.dark) .cv-fs-header {
  border-color: #334155;
}

:global(.dark) .cv-fs-title {
  color: #f1f5f9;
}

:global(.dark) .cv-fs-body {
  background: #0f172a;
}

@media print {
  .cv-fs-overlay {
    position: static;
    background: none;
    backdrop-filter: none;
    padding: 0;
  }
  .cv-fs-container {
    max-height: none;
    box-shadow: none;
    border-radius: 0;
  }
  .cv-fs-header {
    display: none;
  }
  .cv-fs-body {
    padding: 0;
    background: white;
  }
}
</style>
