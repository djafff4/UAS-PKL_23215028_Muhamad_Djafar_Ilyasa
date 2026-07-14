<template>
  <div>
    <!-- Collapsed: show a separator line -->
    <div v-if="collapsed" class="flex justify-center py-1">
      <div class="w-6 h-px bg-surface-200 dark:bg-surface-700/50 rounded-full" />
    </div>

    <!-- Expanded -->
    <template v-else>
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium transition-all duration-200"
        :class="active
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20'
          : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60'"
      >
        <component :is="icon" :size="18" />
        <span class="text-xs font-semibold uppercase tracking-wider flex-1 text-left">{{ label }}</span>
        <ChevronDown v-if="expanded" :size="14" class="transition-transform duration-200" />
        <ChevronRight v-else :size="14" class="transition-transform duration-200" />
      </button>

      <div v-if="expanded" class="space-y-0.5">
        <RouterLink
          v-for="child in children"
          :key="child.to"
          :to="child.to"
          @click="mobile && $emit('navigate')"
          class="group flex items-center rounded-xl font-medium transition-all duration-200"
          :class="[
            collapsed ? 'justify-center h-11 w-11 mx-auto' : 'gap-3 px-3.5 py-2 relative pl-10',
            isChildActive(child.to, child.exact)
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60'
          ]"
        >
          <span v-if="isChildActive(child.to, child.exact) && !collapsed" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary-500" />
          <component :is="child.icon" :size="18" class="shrink-0 transition-transform group-hover:scale-105" />
          <transition name="fade-label">
            <span v-if="!collapsed" class="text-sm truncate">{{ child.label }}</span>
          </transition>
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import type { NavItem } from '@/config/navigation'

const props = defineProps<{
  label: string
  icon: Component
  children: NavItem[]
  expanded: boolean
  active: boolean
  collapsed: boolean
  mobile?: boolean
}>()

defineEmits<{ toggle: []; navigate: [] }>()

const route = useRoute()

function isChildActive(to: string, exact?: boolean) {
  if (to === '/') return route.path === '/'
  if (exact) return route.path === to
  return route.path.startsWith(to)
}
</script>

<style scoped>
.fade-label-enter-active, .fade-label-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-label-enter-from, .fade-label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
