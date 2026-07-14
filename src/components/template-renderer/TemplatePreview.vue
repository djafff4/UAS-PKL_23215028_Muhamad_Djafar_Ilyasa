<template>
  <div class="preview-overlay">
    <!-- Toolbar -->
    <div class="preview-toolbar">
      <h3 class="preview-title">Pratinjau Cetak</h3>
      <div class="preview-actions">
        <button
          class="btn btn-secondary"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          &larr; Sebelumnya
        </button>
        <span class="page-indicator">
          Halaman {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          class="btn btn-secondary"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Berikutnya &rarr;
        </button>
        <button
          class="btn btn-primary"
          :disabled="totalPages === 0"
          @click="print"
        >
          Cetak
        </button>
        <button
          class="btn btn-ghost"
          @click="$emit('close')"
        >
          Tutup
        </button>
      </div>
    </div>

    <!-- Page display -->
    <div ref="previewContainer" class="preview-container">
      <div
        v-for="(_page, idx) in pages"
        :key="idx"
        class="preview-page"
        :style="pageStyle"
        :class="{ 'is-active': idx + 1 === currentPage }"
      >
        <div class="page-header">
          Halaman {{ idx + 1 }} dari {{ totalPages }}
        </div>

        <div class="page-body">
          <TemplateRenderer
            v-if="idx < paginatedRenders.length"
            :template="paginatedRenders[idx]"
            :bindings="resolvedBindings"
          />
        </div>

        <div class="page-footer">
          Dokumen {{ templateName }} &mdash; Hal. {{ idx + 1 }}
        </div>
      </div>

      <p v-if="totalPages === 0" class="empty-preview">
        Tidak ada halaman untuk ditampilkan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TemplateRenderer from './TemplateRenderer.vue'
import type { LetterTemplate, TemplateElement, PageSettings } from '@/types/template'
import { resolveBindings } from '@/composables/useTemplateBinding'

const props = defineProps<{
  template: LetterTemplate
  letterData?: Record<string, unknown>
  bindingContext?: Record<string, unknown>
  templateName?: string
}>()

defineEmits<{
  close: []
}>()

// ── Bindings ──
const resolvedBindings = computed(() => {
  return resolveBindings(props.template, props.letterData ?? {}, props.bindingContext ?? {})
})

// ── Page dimensions ──
const ps = computed<PageSettings>(() => props.template.page_settings)
const pageWidth = computed(() => `${ps.value.width}mm`)
const pageHeight = computed(() => `${ps.value.height}mm`)

const pageStyle = computed(() => ({
  width: pageWidth.value,
  minHeight: pageHeight.value,
}))

// ── Pagination ──
const currentPage = ref(1)
const MAX_HEIGHT_MM = 297 // default A4

/**
 * Simple pagination: split elements across pages if they exceed page height.
 * This is a basic implementation; a production version would use actual
 * element bounding-box calculations.
 */
function paginateTemplate(
  template: LetterTemplate,
  _maxHeight: number,
): LetterTemplate[] {
  const pageH = ps.value.height || MAX_HEIGHT_MM
  const pages: LetterTemplate[] = []
  let remaining: TemplateElement[] = [...template.elements]

  while (remaining.length > 0) {
    const pageElements: TemplateElement[] = []
    let pageId = 0

    for (const el of remaining) {
      const elBottom = (el.y ?? 0) + getElementHeightMM(el)
      if (elBottom <= pageH || pageElements.length === 0) {
        // Fits on current page or must start here
        pageElements.push(el)
        pageId++
      } else {
        // Element overflows → remaining stay for next page
        break
      }
    }

    if (pageElements.length === 0) break

    pages.push({
      ...template,
      elements: pageElements,
    } as LetterTemplate)

    remaining = remaining.slice(pageElements.length)
  }

  return pages.length > 0 ? pages : [template]
}

function getElementHeightMM(el: TemplateElement): number {
  if ('height' in el && (el as any).height) return (el as any).height as number
  if (el.type === 'line') return (el as any).thickness ?? 1
  // Default estimate for text/table elements
  return 10
}

const paginatedRenders = computed(() => {
  return paginateTemplate(props.template, MAX_HEIGHT_MM)
})

const totalPages = computed(() => paginatedRenders.value.length)

/**
 * Pages derived from paginated renders - includes header/footer wrappers
 */
const pages = computed(() => {
  return paginatedRenders.value.map((_, idx) => ({
    index: idx,
    label: `Halaman ${idx + 1}`,
  }))
})

// ── Print ──
function print(): void {
  window.print()
}

// ── Lifecycle ──
onMounted(() => {
  currentPage.value = 1
})
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #1E293B;
  display: flex;
  flex-direction: column;
  color: white;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #0F172A;
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
}

.preview-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #F1F5F9;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-indicator {
  font-size: 13px;
  color: #94A3B8;
  min-width: 120px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.btn-primary {
  background: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.btn-primary:hover {
  background: #2563EB;
}

.btn-secondary {
  background: #334155;
  color: #E2E8F0;
  border-color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #475569;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: #94A3B8;
  border-color: transparent;
}

.btn-ghost:hover {
  color: #F1F5F9;
  background: rgba(255,255,255,0.05);
}

/* ── Preview container ── */
.preview-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 24px;
}

.preview-page {
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  color: black;
  position: relative;
  display: none;
}

.preview-page.is-active {
  display: block;
}

.page-header {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: #94A3B8;
}

.page-body {
  padding: 0;
}

.page-footer {
  text-align: center;
  font-size: 10px;
  color: #94A3B8;
  padding: 6px 0 0;
  border-top: 1px solid #E2E8F0;
  margin-top: 4px;
}

.empty-preview {
  color: #94A3B8;
  font-style: italic;
  font-size: 14px;
  text-align: center;
  margin-top: 48px;
}

/* ── Print styles ── */
@media print {
  .preview-overlay {
    position: static;
    background: white;
    color: black;
  }

  .preview-toolbar {
    display: none;
  }

  .preview-container {
    padding: 0;
    gap: 0;
  }

  .preview-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }

  .preview-page.is-active {
    display: block;
  }

  .page-header,
  .page-footer {
    display: none;
  }
}
</style>
