<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-vue-next'
import QuestionForm, { type QuestionFormData } from './QuestionForm.vue'
import type { Question } from '@/stores/events'

const props = defineProps<{ modelValue: Question[] }>()
const emit = defineEmits<{ 'update:modelValue': [Question[]] }>()

const showForm = ref(false)
const editIdx = ref<number | null>(null)

function moveUp(i: number) {
  if (i <= 0) return
  const qs = [...props.modelValue]; [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]]
  emit('update:modelValue', qs)
}
function moveDown(i: number) {
  const qs = [...props.modelValue]
  if (i >= qs.length - 1) return; [qs[i + 1], qs[i]] = [qs[i], qs[i + 1]]
  emit('update:modelValue', qs)
}
function removeQ(i: number) {
  const qs = [...props.modelValue]; qs.splice(i, 1)
  emit('update:modelValue', qs)
}
function openAdd() { editIdx.value = null; showForm.value = true }
function openEdit(i: number) { editIdx.value = i; showForm.value = true }

function onSave(data: QuestionFormData) {
  const qs = [...props.modelValue]
  if (editIdx.value !== null) { qs[editIdx.value] = data }
  else { qs.push(data) }
  emit('update:modelValue', qs); showForm.value = false
}

const typeLabel: Record<string, string> = {
  short_answer: 'Short Answer', paragraph: 'Paragraph', multiple_choice: 'Pilihan Ganda',
  checkbox: 'Checkbox', dropdown: 'Dropdown', linear_scale: 'Linear Scale',
  date: 'Date', time: 'Time', file_upload: 'File Upload'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-surface-700">Pertanyaan ({{ modelValue.length }})</h3>
      <button @click="openAdd" class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg">
        <Plus :size="14" /> Tambah
      </button>
    </div>
    <div class="space-y-2">
        <div v-for="(q, i) in modelValue" :key="q.id"
          class="flex items-center gap-3 p-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl group hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
          <span class="text-xs font-bold text-surface-300 dark:text-surface-600 w-5 text-right shrink-0">{{ i + 1 }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{{ q.title }}</span>
              <span v-if="q.required" class="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded shrink-0">Wajib</span>
            </div>
            <span class="text-xs text-surface-400">{{ typeLabel[q.type] || q.type }}</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button @click="moveUp(i)" :disabled="i === 0" class="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg disabled:opacity-30"><ArrowUp :size="14" /></button>
            <button @click="moveDown(i)" :disabled="i === modelValue.length - 1" class="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg disabled:opacity-30"><ArrowDown :size="14" /></button>
            <button @click="openEdit(i)" class="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"><Pencil :size="14" /></button>
            <button @click="removeQ(i)" class="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-400"><Trash2 :size="14" /></button>
          </div>
        </div>
        <div v-if="modelValue.length === 0" class="text-center py-8 text-surface-400 dark:text-surface-500 text-sm">Belum ada pertanyaan.</div>
    </div>
    <QuestionForm v-if="showForm" :question="editIdx !== null ? (modelValue[editIdx] as any) : null" @save="onSave" @cancel="showForm = false" />
  </div>
</template>
