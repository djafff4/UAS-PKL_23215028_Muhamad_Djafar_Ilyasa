<script setup lang="ts">
import { onMounted } from 'vue'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import { FileText, Plus } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string | null }>()
const emit = defineEmits<{ 'update:modelValue': [string | null] }>()

const store = useFormTemplatesStore()
onMounted(() => store.fetchTemplates())

function select(id: string | null) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div>
    <h3 class="text-sm font-semibold text-surface-700 mb-3">Pilih Template</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button v-for="tpl in store.templates" :key="tpl.id" @click="select(tpl.id)"
        class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[88px]"
        :class="modelValue === tpl.id ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-200 hover:border-surface-300 bg-white'">
        <FileText :size="28" class="mb-2" :class="modelValue === tpl.id ? 'text-primary-500' : 'text-surface-400'" />
        <span class="text-sm font-medium text-surface-700">{{ tpl.name }}</span>
      </button>
      <button @click="select(null)"
        class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed transition-all duration-200 min-h-[88px]"
        :class="modelValue === null ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-200 hover:border-surface-300 bg-white'">
        <Plus :size="28" class="mb-2" :class="modelValue === null ? 'text-primary-500' : 'text-surface-400'" />
        <span class="text-sm font-medium text-surface-700">Kustom</span>
      </button>
    </div>
  </div>
</template>
