<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Save, Loader2 } from 'lucide-vue-next'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import QuestionEditor from '@/components/events/QuestionEditor.vue'
import type { Question } from '@/stores/events'

const store = useFormTemplatesStore()
const route = useRoute()
const router = useRouter()

const name = ref('')
const questions = ref<Question[]>([])
const loaded = ref(false)
const notFound = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  if (!id || id === 'undefined') { notFound.value = true; loaded.value = true; return }
  const tpl = await store.fetchTemplate(id)
  if (!tpl) { notFound.value = true; loaded.value = true; return }
  name.value = tpl.name
  try { questions.value = JSON.parse(tpl.config).questions || [] } catch { questions.value = [] }
  loaded.value = true
})

const saving = ref(false)
async function save() {
  saving.value = true
  try {
    const id = route.params.id as string
    await store.updateTemplate(id, { name: name.value, config: JSON.stringify({ questions: questions.value }) })
    router.push('/events/form-templates')
  } finally { saving.value = false }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-6 px-4">
    <!-- Loading -->
    <div v-if="!loaded" class="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 :size="24" class="text-primary-500 animate-spin" />
      <p class="text-sm text-surface-400">Memuat template...</p>
    </div>

    <!-- Not found -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
        <span class="text-2xl">?</span>
      </div>
      <p class="text-sm font-medium text-surface-600 dark:text-surface-400">Template tidak ditemukan</p>
      <RouterLink to="/events/form-templates" class="text-sm font-semibold text-primary-500 hover:text-primary-600">Kembali ke daftar</RouterLink>
    </div>

    <!-- Edit form -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <RouterLink to="/events/form-templates"
          class="p-2 -ml-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
          <ArrowLeft :size="18" class="text-surface-500" />
        </RouterLink>
        <div>
          <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100">Edit Template</h2>
          <p class="text-xs text-surface-400 mt-0.5">Ubah nama dan pertanyaan template ini</p>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <!-- Template name -->
        <div class="p-5 sm:p-6 border-b border-surface-100 dark:border-surface-800">
          <label class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama Template</label>
          <input v-model="name" placeholder="Sosialisasi, Workshop..."
            class="w-full mt-2 px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
        </div>

        <!-- Questions -->
        <div class="p-5 sm:p-6">
          <QuestionEditor v-model="questions" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 mt-5">
        <RouterLink to="/events/form-templates"
          class="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
          Batal
        </RouterLink>
        <button @click="save" :disabled="saving || !name.trim()"
          class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl disabled:opacity-50 transition-all shadow-sm shadow-primary-500/20 cursor-pointer">
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </div>
  </div>
</template>
