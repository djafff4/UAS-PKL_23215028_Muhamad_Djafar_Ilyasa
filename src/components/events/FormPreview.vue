<script setup lang="ts">
import type { Question } from '@/stores/events'

defineProps<{ title: string; questions: Question[] }>()
</script>

<template>
  <div class="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
    <div class="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4">
      <h3 class="text-lg font-bold text-white">{{ title || 'Judul Event' }}</h3>
    </div>
    <div class="p-6 space-y-6">
      <div v-for="(q, i) in questions" :key="q.id" class="space-y-1">
        <label class="text-sm font-medium text-surface-800">{{ i + 1 }}. {{ q.title }}<span v-if="q.required" class="text-red-400 ml-0.5">*</span></label>
        <p v-if="q.description" class="text-xs text-surface-400">{{ q.description }}</p>

        <div v-if="q.type === 'short_answer'" class="border-b border-dashed border-surface-300 pb-1 w-full max-w-sm" />
        <div v-else-if="q.type === 'paragraph'" class="border border-surface-200 rounded-lg h-20 w-full" />
        <div v-else-if="q.type === 'multiple_choice'" class="space-y-1">
          <div v-for="opt in (q.options || [])" :key="opt" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full border-2 border-surface-300 shrink-0" />
            <span class="text-sm text-surface-600">{{ opt }}</span>
          </div>
        </div>
        <div v-else-if="q.type === 'checkbox'" class="space-y-1">
          <div v-for="opt in (q.options || [])" :key="opt" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded border-2 border-surface-300 shrink-0" />
            <span class="text-sm text-surface-600">{{ opt }}</span>
          </div>
        </div>
        <div v-else-if="q.type === 'dropdown'" class="border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-400 w-full max-w-xs">Pilih...</div>
        <div v-else-if="q.type === 'linear_scale'" class="flex items-center gap-2 mt-2">
          <span v-if="q.scale?.minLabel" class="text-xs text-surface-400">{{ q.scale.minLabel }}</span>
          <div v-for="n in (q.scale?.max || 5)" :key="n" class="flex flex-col items-center">
            <div class="w-7 h-7 rounded-full border-2 border-surface-300 flex items-center justify-center text-xs text-surface-500">{{ n }}</div>
          </div>
          <span v-if="q.scale?.maxLabel" class="text-xs text-surface-400">{{ q.scale.maxLabel }}</span>
        </div>
        <div v-else-if="q.type === 'date'" class="border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-400 w-36">Date</div>
        <div v-else-if="q.type === 'time'" class="border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-400 w-32">Time</div>
        <div v-else-if="q.type === 'file_upload'" class="border-2 border-dashed border-surface-200 rounded-lg p-4 text-center text-sm text-surface-400">Upload file</div>
      </div>
      <div v-if="questions.length === 0" class="text-center py-8 text-surface-400 text-sm">Preview muncul setelah pertanyaan ditambahkan.</div>
    </div>
  </div>
</template>
