<template>
  <aside
    class="hidden lg:flex flex-col shrink-0 bg-white/95 dark:bg-surface-950/95 border-r border-surface-200/50 dark:border-surface-800/30 transition-all duration-300 ease-in-out overflow-hidden"
    :class="collapsed ? 'w-[68px]' : 'w-64 xl:w-72'">
    <SidebarContent :collapsed="collapsed" />
  </aside>
</template>

<script setup lang="ts">
import SidebarContent from './SidebarContent.vue'

defineProps<{ collapsed?: boolean }>()
</script>
