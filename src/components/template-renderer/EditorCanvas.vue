<template>
  <div
    class="editor-canvas"
    @mousedown="onCanvasMouseDown"
  >
    <!-- Zoom controls -->
    <div class="zoom-controls">
      <button
        title="Perkecil"
        :disabled="zoom <= 0.25"
        @click="zoomOut"
      >
        −
      </button>
      <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
      <button
        title="Perbesar"
        :disabled="zoom >= 3"
        @click="zoomIn"
      >
        +
      </button>
      <button
        title="Reset zoom"
        class="zoom-reset"
        @click="zoom = 1"
      >
        Reset
      </button>
    </div>

    <!-- Page container with zoom transform -->
    <div
      class="editor-page"
      :style="pageStyle"
    >
      <TemplateRenderer
        v-bind="renderProps"
        :key="renderKey"
      />

      <!-- Element selection overlays -->
      <div
        v-for="el in template.elements"
        :key="`overlay-${el.id}`"
        v-show="selectedIds.has(el.id) && el.visible !== false"
        class="element-overlay"
        :class="{ 'is-highlighted': el.visible !== false }"
        :style="overlayStyle(el)"
        @mousedown.stop="onElementMouseDown($event, el.id)"
      >
        <!-- Drag handle (top-left) -->
        <div
          class="handle handle-move"
          title="Seret untuk memindahkan"
          @mousedown.stop="onMoveStart($event, el.id)"
        />

        <!-- Resize handles -->
        <div
          v-for="pos in resizeHandlePositions"
          :key="pos"
          class="handle handle-resize"
          :class="`resize-${pos}`"
          @mousedown.stop="onResizeStart($event, el.id, pos)"
        />

        <!-- Delete button (top-right) -->
        <button
          class="handle-delete"
          title="Hapus elemen"
          @click.stop="emit('delete', el.id)"
        >
          &times;
        </button>

        <!-- Duplicate button (top-right, offset) -->
        <button
          class="handle-duplicate"
          title="Duplikat elemen"
          @click.stop="emit('duplicate', el.id)"
        >
          ⧉
        </button>
      </div>

      <!-- Grid overlay (visible when enabled) -->
      <svg
        v-if="showGrid"
        class="grid-overlay"
        :style="{ width: `${pageWidthPx}px`, height: `${pageHeightPx}px` }"
      >
        <defs>
          <pattern
            id="editor-grid"
            :width="gridSize"
            :height="gridSize"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="0.5"
              cy="0.5"
              r="0.5"
              fill="#CBD5E1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#editor-grid)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import TemplateRenderer from './TemplateRenderer.vue'
import type { LetterTemplate, TemplateElement, PageSettings } from '@/types/template'

// ── Properties ──
const props = defineProps<{
  template: LetterTemplate
  resolvableBindings?: Record<string, string>
  zoom?: number
  showGrid?: boolean
  gridSizePx?: number
}>()

const emit = defineEmits<{
  select: [ids: Set<string>]
  move: [id: string, x: number, y: number]
  resize: [id: string, x: number, y: number, w: number, h: number]
  delete: [id: string]
  duplicate: [id: string]
  add: [type: TemplateElement['type']]
  'update:template': [template: LetterTemplate]
}>()

// ── Constants ──
const MM_TO_PX = 3.7795275591

function mmPx(mm: number): number {
  return Math.round(mm * MM_TO_PX)
}

// ── Internal state ──
const zoom = ref(props.zoom ?? 1)
const selectedIds = reactive(new Set<string>())
const renderKey = ref(0)

// ── Computed page dimensions ──
const ps = computed<PageSettings>(() => props.template.page_settings)
const pageWidthPx = computed(() => mmPx(ps.value.width))
const pageHeightPx = computed(() => mmPx(ps.value.height))

const pageStyle = computed(() => ({
  width: `${pageWidthPx.value}px`,
  minHeight: `${pageHeightPx.value}px`,
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left',
}))

// Render props for the embedded TemplateRenderer
const renderProps = computed(() => ({
  template: props.template,
  bindings: props.resolvableBindings ?? {},
}))

// ── Resize handle positions ──
const resizeHandlePositions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const

// ── Grid ──
const gridSize = computed(() => props.gridSizePx ?? 20)

// ── Zoom helpers ──
function zoomIn(): void {
  zoom.value = Math.min(3, zoom.value + 0.25)
}

function zoomOut(): void {
  zoom.value = Math.max(0.25, zoom.value - 0.25)
}

// ── Overlay style for selection ──
function overlayStyle(el: TemplateElement): Record<string, string> {
  return {
    position: 'absolute',
    left: `${mmPx(el.x ?? 0)}px`,
    top: `${mmPx(el.y ?? 0)}px`,
    width: getElementWidth(el),
    height: getElementHeight(el),
  }
}

function getElementWidth(el: TemplateElement): string {
  if ('width' in el && el.width) return `${mmPx(el.width as number)}px`
  if (el.type === 'line' && (el as any).direction !== 'horizontal') return 'auto'
  if (el.type === 'line') return `${mmPx((el as any).length ?? 50)}px`
  return '150px'
}

function getElementHeight(el: TemplateElement): string {
  if ('height' in el && el.height) return `${mmPx(el.height as number)}px`
  if (el.type === 'line' && (el as any).direction === 'horizontal') return `${(el as any).thickness ?? 1}px`
  if (el.type === 'line') return `${mmPx((el as any).length ?? 50)}px`
  return '40px'
}

// ── Drag state ──
interface DragState {
  type: 'move' | 'resize'
  elementId: string
  startX: number
  startY: number
  origX: number
  origY: number
  origW: number
  origH: number
  resizeCorner: string | null
}

const drag = ref<DragState | null>(null)

function onCanvasMouseDown(_e: MouseEvent): void {
  // Deselect when clicking empty canvas
  selectedIds.clear()
  emit('select', new Set(selectedIds))
}

function onElementMouseDown(e: MouseEvent, id: string): void {
  if (e.button !== 0) return

  if (!selectedIds.has(id)) {
    selectedIds.clear()
    selectedIds.add(id)
    emit('select', new Set(selectedIds))
  }
  // Click on overlay itself doesn't start drag—handles do
}

// ── Move ──
function onMoveStart(e: MouseEvent, id: string): void {
  const el = props.template.elements.find(el => el.id === id)
  if (!el) return

  drag.value = {
    type: 'move',
    elementId: id,
    startX: e.clientX,
    startY: e.clientY,
    origX: el.x ?? 0,
    origY: el.y ?? 0,
    origW: 0,
    origH: 0,
    resizeCorner: null,
  }

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', onDragEnd)
}

// ── Resize ──
function onResizeStart(e: MouseEvent, id: string, corner: string): void {
  const el = props.template.elements.find(el => el.id === id)
  if (!el) return

  const w = 'width' in el ? (el.width as number ?? 0) : 0
  const h = 'height' in el ? (el.height as number ?? 0) : 0

  drag.value = {
    type: 'resize',
    elementId: id,
    startX: e.clientX,
    startY: e.clientY,
    origX: el.x ?? 0,
    origY: el.y ?? 0,
    origW: w,
    origH: h,
    resizeCorner: corner,
  }

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', onDragEnd)
}

function onDrag(e: MouseEvent): void {
  if (!drag.value) return

  const dx = (e.clientX - drag.value.startX) / zoom.value
  const dy = (e.clientY - drag.value.startY) / zoom.value

  if (drag.value.type === 'move') {
    const newX = Math.round(drag.value.origX + dx)
    const newY = Math.round(drag.value.origY + dy)
    emit('move', drag.value.elementId, newX, newY)
    // Live update clone
    updateElementPosition(drag.value.elementId, newX, newY)
  } else if (drag.value.type === 'resize') {
    resizeElement(drag.value, dx, dy)
  }
}

function onDragEnd(): void {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', onDragEnd)
  drag.value = null
}

// ── Live position update on the prop template ──
function updateElementPosition(id: string, x: number, y: number): void {
  const idx = props.template.elements.findIndex(el => el.id === id)
  if (idx === -1) return

  const clone = { ...props.template }
  const updated = [...clone.elements]
  updated[idx] = { ...updated[idx], x, y }
  clone.elements = updated
  emit('update:template', clone)
}

function resizeElement(d: DragState, dx: number, dy: number): void {
  const el = props.template.elements.find(el => el.id === d.elementId)
  if (!el || !('width' in el)) return

  let newX = d.origX
  let newY = d.origY
  let newW = d.origW
  let newH = d.origH

  const corner = d.resizeCorner!

  if (corner.includes('e')) newW = Math.max(10, d.origW + dx)
  if (corner.includes('w')) {
    newW = Math.max(10, d.origW - dx)
    newX = d.origX + dx
  }
  if (corner.includes('s')) newH = Math.max(10, d.origH + dy)
  if (corner.includes('n')) {
    newH = Math.max(10, d.origH - dy)
    newY = d.origY + dy
  }

  const idx = props.template.elements.findIndex(el => el.id === d.elementId)
  if (idx === -1) return

  const clone = { ...props.template }
  const updated = [...clone.elements]
  updated[idx] = {
    ...updated[idx],
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.round(newW),
    height: Math.round(newH),
  } as TemplateElement
  clone.elements = updated
  emit('update:template', clone)
}

// ── Keyboard shortcuts ──
function onKeyDown(e: KeyboardEvent): void {
  // Delete / Backspace
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
    // Don't delete if an input is focused
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

    e.preventDefault()
    for (const id of selectedIds) {
      emit('delete', id)
    }
    selectedIds.clear()
    emit('select', new Set(selectedIds))
  }

  // Escape → deselect
  if (e.key === 'Escape') {
    selectedIds.clear()
    emit('select', new Set(selectedIds))
  }

  // Ctrl+D → duplicate
  if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedIds.size > 0) {
    e.preventDefault()
    for (const id of selectedIds) {
      emit('duplicate', id)
    }
  }
}

// ── Lifecycle ──
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', onDragEnd)
})

// Expose for parent access
defineExpose({ zoom, selectedIds, renderKey })
</script>

<style scoped>
.editor-canvas {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: #E2E8F0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-height: 100%;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.zoom-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-controls button:not(:disabled):hover {
  background: #F1F5F9;
}

.zoom-controls .zoom-reset {
  width: auto;
  padding: 0 10px;
  font-size: 12px;
}

.zoom-label {
  font-size: 13px;
  font-weight: 600;
  min-width: 44px;
  text-align: center;
  color: #1E293B;
}

.editor-page {
  position: relative;
  background: white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  margin: 0 auto;
}

/* ── Selection overlay ── */
.element-overlay {
  outline: 2px solid #3B82F6;
  outline-offset: 1px;
  pointer-events: all;
  z-index: 10;
}

.element-overlay.is-highlighted {
  outline-color: #2563EB;
}

/* ── Drag handle ── */
.handle-move {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 22px;
  height: 22px;
  cursor: move;
  z-index: 12;
  background: #3B82F6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 9l-3 3 3 3'/%3E%3Cpath d='M9 5l3-3 3 3'/%3E%3Cpath d='M15 19l-3 3-3-3'/%3E%3Cpath d='M19 9l3 3-3 3'/%3E%3C/svg%3E") center/12px no-repeat;
  border: 1px solid white;
  border-radius: 4px;
}

/* ── Resize handles ── */
.handle-resize {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #3B82F6;
  border: 2px solid white;
  border-radius: 2px;
  z-index: 12;
}

.resize-nw { top: -6px; left: -6px; cursor: nw-resize; }
.resize-n  { top: -6px; left: 50%; margin-left: -5px; cursor: n-resize; }
.resize-ne { top: -6px; right: -6px; cursor: ne-resize; }
.resize-e  { top: 50%; right: -6px; margin-top: -5px; cursor: e-resize; }
.resize-se { bottom: -6px; right: -6px; cursor: se-resize; }
.resize-s  { bottom: -6px; left: 50%; margin-left: -5px; cursor: s-resize; }
.resize-sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.resize-w  { top: 50%; left: -6px; margin-top: -5px; cursor: w-resize; }

/* ── Delete button ── */
.handle-delete {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #EF4444;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  z-index: 13;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.handle-duplicate {
  position: absolute;
  top: -10px;
  right: 16px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #6366F1;
  color: white;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  z-index: 13;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* ── Grid overlay ── */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}
</style>
