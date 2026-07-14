<template>
  <div v-if="!collapsed" class="flex items-center gap-2 px-3.5 pt-4 pb-1.5">
    <span class="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  collapsed: boolean
}>()
</script>
