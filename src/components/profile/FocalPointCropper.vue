<template>
  <div class="instagram-cropper">
    <div class="relative overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800 aspect-square w-full">
      <div
        ref="containerRef"
        class="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        @mousedown="startDrag"
        @touchstart.prevent="startDragTouch"
      >
        <img
          ref="imgRef"
          :src="imageUrl"
          class="absolute w-full h-full object-contain select-none pointer-events-none origin-center"
          :style="imgStyle"
          draggable="false"
          @load="onImgLoad"
        />
      </div>

      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-black/40" style="clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, var(--cb-left) var(--cb-top), var(--cb-left) calc(var(--cb-top) + var(--cb-size)), calc(var(--cb-left) + var(--cb-size)) calc(var(--cb-top) + var(--cb-size)), calc(var(--cb-left) + var(--cb-size)) var(--cb-top), var(--cb-left) var(--cb-top));" />
        <div class="absolute border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0)]" :style="cropBoxStyle" />
      </div>

      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
        <p class="text-[10px] text-white font-medium">{{ Math.round(zoom * 100) }}%</p>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-4">
      <div class="flex items-center gap-3 flex-1">
        <ZoomOut :size="14" class="text-surface-400 shrink-0" />
        <input
          v-model.number="zoom"
          type="range"
          :min="1"
          :max="4"
          :step="0.01"
          @input="updatePreview"
          class="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full appearance-none cursor-pointer accent-primary-500"
        />
        <ZoomIn :size="14" class="text-surface-400 shrink-0" />
      </div>

      <div class="flex items-center gap-2">
        <p v-if="previewDataUrl" class="text-[10px] text-surface-400">Preview:</p>
        <div v-if="previewDataUrl" class="w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-surface-600 shadow-md shrink-0">
          <img :src="previewDataUrl" class="w-full h-full object-cover" />
        </div>
        <button @click="reset" class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ZoomIn, ZoomOut } from 'lucide-vue-next'

const props = defineProps<{
  imageUrl: string
  outputSize?: number
}>()

const emit = defineEmits<{
  (e: 'update:croppedBlob', value: Blob | null): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const previewDataUrl = ref('')

const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const dragging = ref(false)

const dragStart = ref({ x: 0, y: 0 })
const panStart = ref({ x: 0, y: 0 })

const outSize = computed(() => props.outputSize || 400)

// Menggunakan ukuran kontainer responsif (asumsi square 1:1)
const containerPx = ref(300)
// Kotak crop diatur sebesar 85% dari ukuran kontainer
const cropBoxPx = computed(() => containerPx.value * 0.85)

const cropBoxStyle = computed(() => {
  const size = cropBoxPx.value
  const offset = (containerPx.value - size) / 2
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${offset}px`,
    top: `${offset}px`,
    '--cb-left': `${offset}px`,
    '--cb-top': `${offset}px`,
    '--cb-size': `${size}px`,
  } as Record<string, string>
})

const imgStyle = computed(() => {
  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
  }
})

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

// Menghitung batasan drag (bounding box) agar gambar tidak lepas dari kotak crop
function clampPan() {
  if (!imgRef.value || !containerRef.value) return

  const size = cropBoxPx.value
  const imgBoundedWidth = containerPx.value * zoom.value
  const imgBoundedHeight = containerPx.value * zoom.value

  // Batas maksimum pergeseran dari titik tengah
  const maxPanX = Math.max(0, (imgBoundedWidth - size) / 2)
  const maxPanY = Math.max(0, (imgBoundedHeight - size) / 2)

  panX.value = clamp(panX.value, -maxPanX, maxPanX)
  panY.value = clamp(panY.value, -maxPanY, maxPanY)
}

function onImgLoad() {
  initDimensions()
  reset()
}

function initDimensions() {
  if (containerRef.value) {
    containerPx.value = containerRef.value.clientWidth
  }
}

function startDrag(e: MouseEvent) {
  dragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  panStart.value = { x: panX.value, y: panY.value }
}

function startDragTouch(e: TouchEvent) {
  if (e.touches.length !== 1) return
  dragging.value = true
  dragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  panStart.value = { x: panX.value, y: panY.value }
}

function onDrag(e: MouseEvent) {
  if (!dragging.value) return
  panX.value = panStart.value.x + (e.clientX - dragStart.value.x)
  panY.value = panStart.value.y + (e.clientY - dragStart.value.y)
  clampPan()
  updatePreview()
}

function onDragTouch(e: TouchEvent) {
  if (!dragging.value || e.touches.length !== 1) return
  panX.value = panStart.value.x + (e.touches[0].clientX - dragStart.value.x)
  panY.value = panStart.value.y + (e.touches[0].clientY - dragStart.value.y)
  clampPan()
  updatePreview()
}

function stopDrag() {
  dragging.value = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const lastZoom = zoom.value
  zoom.value = clamp(zoom.value + (e.deltaY > 0 ? -0.1 : 0.1), 1, 4)
  if (lastZoom !== zoom.value) {
    clampPan()
    updatePreview()
  }
}

function reset() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
  updatePreview()
}

// Watcher untuk mendeteksi perubahan nilai zoom slider
watch(zoom, () => {
  clampPan()
})

function updatePreview() {
  const img = imgRef.value
  if (!img || !img.complete || img.naturalWidth === 0) return

  const canvas = document.createElement('canvas')
  canvas.width = outSize.value
  canvas.height = outSize.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Tentukan dimensi tampilan gambar sebenarnya berdasarkan object-contain
  const natW = img.naturalWidth
  const natH = img.naturalHeight
  const containerSize = containerPx.value
  
  let displayedWidth = containerSize

  const aspect = natW / natH
  if (aspect > 1) {
    // Landscape: width fills container, height scales down
    displayedWidth = containerSize
  } else {
    // Portrait: height fills container, width scales down
    displayedWidth = containerSize * aspect
  }

  // 2. Hitung rasio konversi dari koordinat layar ke piksel asli gambar
  const scaleRatio = natW / displayedWidth

  // 3. Posisi kotak crop relatif terhadap tengah kontainer
  const cropBoxSize = cropBoxPx.value
  
  // Hitung koordinat source x & y pada gambar asli
  // Konsep: Bawa posisi ke origin tengah gambar asli, lalu sesuaikan geseran pan & ukuran crop box
  const srcSize = (cropBoxSize / zoom.value) * scaleRatio
  const srcX = (natW / 2) - (panX.value / zoom.value) * scaleRatio - (srcSize / 2)
  const srcY = (natH / 2) - (panY.value / zoom.value) * scaleRatio - (srcSize / 2)

  ctx.clearRect(0, 0, outSize.value, outSize.value)
  
  // Gambar ke canvas dengan interpolasi tinggi (image smoothing)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  
  ctx.drawImage(
    img,
    srcX, srcY, srcSize, srcSize, // Source crop area
    0, 0, outSize.value, outSize.value // Destination canvas area
  )

  previewDataUrl.value = canvas.toDataURL('image/jpeg', 0.9)

  canvas.toBlob((blob) => {
    emit('update:croppedBlob', blob)
  }, 'image/jpeg', 0.92)
}

// Gunakan ResizeObserver untuk menangani ukuran layar yang fluid/responsif
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDragTouch, { passive: false })
  window.addEventListener('touchend', stopDrag)
  containerRef.value?.addEventListener('wheel', onWheel, { passive: false })

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      initDimensions()
      clampPan()
      updatePreview()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDrag)
  containerRef.value?.removeEventListener('wheel', onWheel)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>