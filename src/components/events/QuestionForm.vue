<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

export interface QuestionFormData {
  id: string; type: string; title: string; description: string
  required: boolean; options: string[]
  scale: { min: number; max: number; minLabel: string; maxLabel: string }
  maxFileSize: number
}

const props = defineProps<{ question?: QuestionFormData | null }>()
const emit = defineEmits<{ save: [QuestionFormData]; cancel: [] }>()

const id = ref(props.question?.id || crypto.randomUUID())
const type = ref(props.question?.type || 'short_answer')
const title = ref(props.question?.title || '')
const description = ref(props.question?.description || '')
const required = ref(props.question?.required || false)
const options = ref<string[]>(props.question?.options?.length ? [...props.question.options] : [''])
const scaleMin = ref(props.question?.scale?.min ?? 1)
const scaleMax = ref(props.question?.scale?.max ?? 5)
const scaleMinLabel = ref(props.question?.scale?.minLabel || '')
const scaleMaxLabel = ref(props.question?.scale?.maxLabel || '')
const maxFileSize = ref(props.question?.maxFileSize || 10)

const needsOptions = ['multiple_choice', 'checkbox', 'dropdown']
const needsScale = ['linear_scale']
const needsFileSize = ['file_upload']

function addOption() { options.value.push('') }
function removeOption(i: number) { options.value.splice(i, 1) }
function save() {
  emit('save', {
    id: id.value, type: type.value, title: title.value, description: description.value,
    required: required.value,
    options: needsOptions.includes(type.value) ? options.value.filter(o => o.trim()) : [],
    scale: needsScale.includes(type.value) ? { min: scaleMin.value, max: scaleMax.value, minLabel: scaleMinLabel.value, maxLabel: scaleMaxLabel.value } : { min: 1, max: 5, minLabel: '', maxLabel: '' },
    maxFileSize: needsFileSize.includes(type.value) ? maxFileSize.value : 10,
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="emit('cancel')">
    <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-surface-200 dark:border-surface-700">
      <div class="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-800">
        <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100">{{ question ? 'Edit Pertanyaan' : 'Tambah Pertanyaan' }}</h3>
        <button @click="emit('cancel')" class="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg"><X :size="18" class="text-surface-500" /></button>
      </div>
      <div class="p-5 space-y-4">
        <div>
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Tipe</label>
          <select v-model="type" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm">
            <option value="short_answer">Short Answer</option>
            <option value="paragraph">Paragraph</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
            <option value="linear_scale">Linear Scale</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="file_upload">File Upload</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Judul</label>
          <input v-model="title" placeholder="Judul pertanyaan" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm" />
        </div>
        <div>
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Deskripsi (opsional)</label>
          <textarea v-model="description" rows="2" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm resize-none" />
        </div>
        <div class="flex items-center gap-2">
          <input v-model="required" type="checkbox" id="required" class="rounded" />
          <label for="required" class="text-sm font-medium text-surface-700 dark:text-surface-300">Wajib diisi</label>
        </div>
        <div v-if="needsOptions.includes(type)">
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Opsi</label>
          <div v-for="(_opt, i) in options" :key="i" class="flex items-center gap-2 mt-2">
            <input v-model="options[i]" :placeholder="`Opsi ${i + 1}`" class="flex-1 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm" />
            <button v-if="options.length > 1" @click="removeOption(i)" class="text-red-400 hover:text-red-600 text-xs cursor-pointer">Hapus</button>
          </div>
          <button @click="addOption" class="mt-2 text-xs font-semibold text-primary-500 cursor-pointer">+ Tambah opsi</button>
        </div>
        <div v-if="needsScale.includes(type)">
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Skala</label>
          <div class="flex items-center gap-3 mt-2">
            <div><span class="text-xs text-surface-400">Min</span><input v-model.number="scaleMin" type="number" class="w-16 px-2 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm text-center" /></div>
            <div><span class="text-xs text-surface-400">Max</span><input v-model.number="scaleMax" type="number" class="w-16 px-2 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm text-center" /></div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input v-model="scaleMinLabel" placeholder="Label min" class="flex-1 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm" />
            <input v-model="scaleMaxLabel" placeholder="Label max" class="flex-1 px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm" />
          </div>
        </div>
        <div v-if="needsFileSize.includes(type)">
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Max File (MB)</label>
          <input v-model.number="maxFileSize" type="number" class="w-24 mt-1 px-3 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm" />
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 p-5 border-t border-surface-100 dark:border-surface-800">
        <button @click="emit('cancel')" class="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl cursor-pointer">Batal</button>
        <button @click="save" class="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl disabled:opacity-50 cursor-pointer" :disabled="!title.trim()">Simpan</button>
      </div>
    </div>
  </div>
</template>
