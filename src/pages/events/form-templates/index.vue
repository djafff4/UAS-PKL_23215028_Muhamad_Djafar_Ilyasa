<script setup lang="ts">
import { onMounted } from 'vue'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

const store = useFormTemplatesStore()
onMounted(() => store.fetchTemplates())

function questionsCount(config: string) {
  try {
    const parsed = JSON.parse(config)
    return `${parsed.questions?.length || 0}`
  } catch { return '0' }
}

async function remove(id: string) {
  if (confirm('Hapus template ini?')) await store.deleteTemplate(id)
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-6 px-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-surface-900">Form Templates</h2>
        <p class="text-sm text-surface-500 mt-0.5">Kelola template Google Form</p>
      </div>
      <RouterLink to="/events/form-templates/create" class="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl">
        <Plus :size="16" /> Baru
      </RouterLink>
    </div>
    <div class="space-y-2">
      <div v-for="tpl in store.templates" :key="tpl.id"
        class="flex items-center gap-4 p-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-surface-800 dark:text-surface-200">{{ tpl.name }}</h4>
          <p class="text-xs text-surface-400 mt-0.5 truncate">{{ questionsCount(tpl.config) }} pertanyaan</p>
        </div>
        <RouterLink :to="`/events/form-templates/${tpl.id}`" class="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg cursor-pointer"><Pencil :size="16" class="text-surface-400" /></RouterLink>
        <button @click="remove(tpl.id)" class="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"><Trash2 :size="16" class="text-red-400" /></button>
      </div>
      <div v-if="!store.templates.length" class="text-center py-12 text-surface-400 text-sm">Belum ada template.</div>
    </div>
  </div>
</template>
