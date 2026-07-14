<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import QuestionEditor from '@/components/events/QuestionEditor.vue'
import type { Question } from '@/stores/events'

const router = useRouter()
const store = useFormTemplatesStore()
const name = ref('')
const questions = ref<Question[]>([])
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await store.createTemplate({ name: name.value, config: JSON.stringify({ questions: questions.value }) })
    router.push('/events/form-templates')
  } finally { saving.value = false }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-6 px-4">
    <h2 class="text-xl font-bold text-surface-900 mb-6">Buat Template</h2>
    <div class="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
      <div>
        <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama</label>
        <input v-model="name" placeholder="Sosialisasi, Workshop..." class="w-full mt-1 px-3 py-2.5 rounded-xl border border-surface-200 text-sm" />
      </div>
      <QuestionEditor v-model="questions" />
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
        <RouterLink to="/events/form-templates" class="px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100 rounded-xl">Batal</RouterLink>
        <button @click="save" :disabled="saving || !name.trim()" class="px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl disabled:opacity-50">
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>
  </div>
</template>
