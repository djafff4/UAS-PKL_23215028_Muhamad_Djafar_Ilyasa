<template>
  <div class="flex flex-col items-center">
    <!-- Empty state -->
    <div v-if="!segments.length" class="flex flex-col items-center py-4">
      <svg :width="size" :height="size" viewBox="0 0 40 40" class="mb-2">
        <circle cx="20" cy="20" r="15.915" fill="none"
          class="stroke-surface-200 dark:stroke-surface-700"
          :stroke-width="strokeWidth / (size / 40)" />
      </svg>
      <span class="text-xs text-surface-400">Tidak ada data</span>
    </div>

    <!-- Donut Chart -->
    <div v-else class="relative" :style="{ width: size + 'px', height: size + 'px' }">
      <svg
        :width="size"
        :height="size"
        viewBox="0 0 40 40"
        class="transform -rotate-90"
      >
        <!-- Background circle -->
        <circle
          cx="20" cy="20" r="15.915"
          fill="none"
          class="stroke-surface-200 dark:stroke-surface-700"
          :stroke-width="strokeWidth / (size / 40)"
        />
        <!-- Segments - each has its own dasharray for its percentage -->
        <circle
          v-for="(seg, i) in sortedSegments"
          :key="i"
          cx="20" cy="20" r="15.915"
          fill="none"
          :stroke="seg.color"
          :stroke-width="strokeWidth / (size / 40)"
          :stroke-dasharray="dashLen(seg.percentage)"
          :stroke-dashoffset="dashOffset(i)"
          class="transition-all duration-1000 ease-out"
          stroke-linecap="butt"
        />
      </svg>
      <!-- Center Text -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-sm font-bold text-surface-900 dark:text-surface-100">
          {{ centerText }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div v-if="segments.length" class="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-3">
      <div
        v-for="(seg, i) in segments"
        :key="i"
        class="flex items-center gap-1.5"
      >
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ backgroundColor: seg.color }"
        ></span>
        <span class="text-xs font-medium text-surface-600 dark:text-surface-400">
          {{ seg.label }}
          <span class="text-surface-400 dark:text-surface-500">({{ seg.value }})</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DonutSegment } from '@/types'

const props = withDefaults(defineProps<{
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  centerText?: string
}>(), {
  size: 160,
  strokeWidth: 28,
  centerText: '',
})

const C = 2 * Math.PI * 15.915

const sortedSegments = computed(() =>
  [...props.segments].sort((a, b) => b.percentage - a.percentage)
)

function dashLen(pct: number): string {
  return String((pct / 100) * C)
}

function dashOffset(index: number): number {
  let cum = 0
  for (let i = 0; i <= index; i++) {
    cum += sortedSegments.value[i].percentage
  }
  return C - (cum / 100) * C
}
</script>
