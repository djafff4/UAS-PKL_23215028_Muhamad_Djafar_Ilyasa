<template>
  <div class="flex items-center gap-1.5 bg-surface-100 dark:bg-surface-800/50 p-0.5 rounded-xl">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      class="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
      :class="modelValue === option.value
        ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
        : 'text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'hari_ini' | 'minggu_ini' | 'bulan_ini'
}>()

defineEmits<{
  'update:modelValue': [value: 'hari_ini' | 'minggu_ini' | 'bulan_ini']
}>()

const options = [
  { label: 'Hari Ini', value: 'hari_ini' as const },
  { label: 'Minggu Ini', value: 'minggu_ini' as const },
  { label: 'Bulan Ini', value: 'bulan_ini' as const },
]
</script>
