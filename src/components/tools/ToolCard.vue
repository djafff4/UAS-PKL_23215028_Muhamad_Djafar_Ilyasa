<template>
  <RouterLink
    :to="to"
    class="group block p-5 rounded-2xl bg-white/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/40 backdrop-blur-sm hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
  >
    <div class="flex items-start gap-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        :class="iconBgClass"
      >
        <component :is="icon" :size="22" :class="iconClass" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {{ title }}
        </h3>
        <p class="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2 leading-relaxed">
          {{ description }}
        </p>
      </div>
      <ArrowRight :size="16" class="text-surface-300 dark:text-surface-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  description: string
  icon: Component
  to: string
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'cyan'
}>(), {
  color: 'blue'
})

const colorMap = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    icon: 'text-rose-600 dark:text-rose-400',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    icon: 'text-cyan-600 dark:text-cyan-400',
  },
}

const iconBgClass = colorMap[props.color]?.bg || colorMap.blue.bg
const iconClass = colorMap[props.color]?.icon || colorMap.blue.icon
</script>
