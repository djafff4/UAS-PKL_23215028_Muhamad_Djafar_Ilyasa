<template>
  <div class="flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12"
    :class="compact ? 'py-6' : ''">
    <!-- Illustration (hidden in compact mode) -->
    <div v-if="!compact" class="mb-6 animate-fade-in">
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-40 h-32 sm:w-48 sm:h-36 lg:w-52 lg:h-40">
        <!-- Desk -->
        <rect x="30" y="100" width="140" height="8" rx="4" class="fill-surface-300 dark:fill-surface-600" />
        <rect x="45" y="108" width="8" height="30" rx="2" class="fill-surface-300 dark:fill-surface-600" />
        <rect x="147" y="108" width="8" height="30" rx="2" class="fill-surface-300 dark:fill-surface-600" />

        <!-- Monitor -->
        <rect x="65" y="50" width="70" height="50" rx="6" class="fill-surface-200 dark:fill-surface-700 stroke-surface-400 dark:stroke-surface-500" stroke-width="2" />
        <rect x="70" y="55" width="60" height="35" rx="3" class="fill-primary-100 dark:fill-primary-900/40" />
        <!-- Screen content - chart bars -->
        <rect x="78" y="72" width="8" height="14" rx="1.5" class="fill-primary-400/60" />
        <rect x="90" y="64" width="8" height="22" rx="1.5" class="fill-primary-500/80" />
        <rect x="102" y="68" width="8" height="18" rx="1.5" class="fill-primary-400/60" />
        <rect x="114" y="60" width="8" height="26" rx="1.5" class="fill-emerald-400/80" />

        <!-- Monitor stand -->
        <rect x="95" y="100" width="10" height="8" rx="2" class="fill-surface-400 dark:fill-surface-500" />

        <!-- Keyboard -->
        <rect x="75" y="108" width="50" height="6" rx="2" class="fill-surface-200 dark:fill-surface-700" />
        <circle cx="82" cy="111" r="1.5" class="fill-surface-400 dark:fill-surface-500" />
        <circle cx="90" cy="111" r="1.5" class="fill-surface-400 dark:fill-surface-500" />
        <circle cx="98" cy="111" r="1.5" class="fill-surface-400 dark:fill-surface-500" />
        <circle cx="106" cy="111" r="1.5" class="fill-surface-400 dark:fill-surface-500" />
        <circle cx="114" cy="111" r="1.5" class="fill-surface-400 dark:fill-surface-500" />

        <!-- Plant pot -->
        <rect x="155" y="85" width="18" height="20" rx="3" class="fill-primary-300/60 dark:fill-primary-700/40" />
        <ellipse cx="164" cy="85" rx="9" ry="3" class="fill-primary-300/80 dark:fill-primary-700/50" />
        <path d="M158 82 Q160 65 164 60 Q168 65 170 82" class="fill-emerald-400/70 dark:fill-emerald-500/40" stroke="none" />
        <path d="M160 75 Q163 68 166 72 Q164 78 160 75Z" class="fill-emerald-500/60 dark:fill-emerald-400/30" />

        <!-- Coffee mug -->
        <rect x="35" y="75" width="14" height="16" rx="3" class="fill-amber-200 dark:fill-amber-800/50" />
        <path d="M49 80 Q55 80 55 85 Q55 90 49 90" class="fill-amber-200 dark:fill-amber-800/50" stroke="none" />
        <!-- Steam -->
        <path d="M40 72 Q42 68 40 64 Q38 60 40 56" class="stroke-surface-300 dark:stroke-surface-600" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6" />
        <path d="M45 73 Q47 69 45 65" class="stroke-surface-300 dark:stroke-surface-600" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4" />

        <!-- Floating sparkles -->
        <path d="M130 35 L132 30 L134 35 L139 37 L134 39 L132 44 L130 39 L125 37Z" class="fill-primary-400/50 dark:fill-primary-300/30" />
        <path d="M48 42 L49.5 38 L51 42 L55 43.5 L51 45 L49.5 49 L48 45 L44 43.5Z" class="fill-amber-400/50 dark:fill-amber-300/30" />
      </svg>
    </div>

    <!-- Text Content -->
    <div class="max-w-xs sm:max-w-sm">
      <h3 v-if="title" class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100 mb-1.5">
        {{ title }}
      </h3>
      <p class="text-sm sm:text-base text-surface-500 dark:text-surface-400 leading-relaxed">
        {{ message }}
      </p>
    </div>

    <!-- Quick Actions -->
    <div v-if="actions && actions.length" class="flex flex-wrap items-center justify-center gap-2.5 mt-5">
      <RouterLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        :class="action.primary !== false
          ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/20 hover:shadow-md hover:shadow-primary-500/30 active:scale-[0.97]'
          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'"
      >
        <component :is="action.icon" :size="16" />
        {{ action.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface ActionItem {
  label: string
  to: string
  icon: Component
  primary?: boolean
}

withDefaults(defineProps<{
  title?: string
  message?: string
  actions?: ActionItem[]
  compact?: boolean
}>(), {
  title: 'Belum ada aktivitas',
  message: 'Mulai hari dengan task pertama Anda!',
  compact: false,
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out;
}
</style>
