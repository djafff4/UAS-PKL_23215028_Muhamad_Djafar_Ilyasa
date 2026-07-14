<template>
  <div class="group relative overflow-hidden rounded-2xl border border-surface-200/50 dark:border-surface-700/30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200/50 dark:hover:border-primary-800/30 hover:-translate-y-0.5">
    <!-- Glass gradient accent -->
    <div class="absolute -inset-x-32 -top-32 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      :class="glowAccent"></div>

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          :class="[iconBg, iconShadow]">
          <component :is="icon" :size="20" class="md:w-[22px] md:h-[22px]" :class="iconColor" />
        </div>
        <span v-if="trend !== undefined"
          class="inline-flex items-center gap-0.5 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full"
          :class="trend >= 0 ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'">
          <TrendingUp v-if="trend >= 0" :size="10" />
          <TrendingDown v-else :size="10" />
          {{ trend >= 0 ? '+' : '' }}{{ trend }}%
        </span>
      </div>
      <p class="text-2xl md:text-3xl font-bold tracking-tight" :class="valueMuted ? 'text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-surface-100'">{{ animatedValue }}</p>
      <p class="text-xs md:text-sm text-surface-400 dark:text-surface-500 mt-1 font-medium">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  icon: any
  label: string
  value: string | number
  trend?: number
  iconBg?: string
  iconColor?: string
  valueMuted?: boolean
}>()

const animatedValue = ref(props.value)

const glowAccent = computed(() => {
  const bgColors: Record<string, string> = {
    'bg-primary-500/10': 'bg-gradient-to-br from-primary-500/10 via-transparent to-transparent',
    'bg-emerald-500/10': 'bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent',
    'bg-amber-500/10': 'bg-gradient-to-br from-amber-500/10 via-transparent to-transparent',
    'bg-violet-500/10': 'bg-gradient-to-br from-violet-500/10 via-transparent to-transparent',
  }
  return bgColors[props.iconBg || ''] || 'bg-gradient-to-br from-primary-500/10 via-transparent to-transparent'
})

const iconShadow = computed(() => {
  const shadows: Record<string, string> = {
    'bg-primary-500/10': 'shadow-primary-500/10 group-hover:shadow-primary-500/20',
    'bg-emerald-500/10': 'shadow-emerald-500/10 group-hover:shadow-emerald-500/20',
    'bg-amber-500/10': 'shadow-amber-500/10 group-hover:shadow-amber-500/20',
    'bg-violet-500/10': 'shadow-violet-500/10 group-hover:shadow-violet-500/20',
  }
  return shadows[props.iconBg || ''] || ''
})

watch(() => props.value, (newVal) => {
  if (typeof newVal === 'number') {
    animateCounter(0, newVal, 600)
  } else {
    animatedValue.value = newVal
  }
}, { immediate: true })

function animateCounter(from: number, to: number, duration: number) {
  const start = performance.now()
  function step(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedValue.value = Math.round(from + (to - from) * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>
