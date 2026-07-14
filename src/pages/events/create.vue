<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-7">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex items-center gap-4">
        <RouterLink to="/events" class="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
          <ArrowLeft :size="20" class="text-white/70" />
        </RouterLink>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Buat Event Baru</h1>
          <p class="text-sm text-white/60 mt-0.5 font-medium">Isi detail event dan siapkan form absensi</p>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-0">
      <template v-for="(step, i) in steps" :key="i">
        <button @click="goToStep(i)" :disabled="i > currentStep"
          class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
          :class="[
            i === currentStep
              ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-500/10 cursor-pointer'
              : i < currentStep
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 cursor-pointer'
                : 'text-surface-400 dark:text-surface-500 cursor-not-allowed'
          ]"
        >
          <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            :class="[
              i === currentStep
                ? 'bg-primary-500 text-white'
                : i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
            ]"
          >
            <Check v-if="i < currentStep" :size="14" />
            <span v-else>{{ i + 1 }}</span>
          </span>
          <span class="text-sm font-semibold hidden sm:inline">{{ step.label }}</span>
        </button>
        <div v-if="i < steps.length - 1"
          class="w-8 sm:w-12 h-0.5 mx-1 rounded-full transition-colors duration-300"
          :class="i < currentStep ? 'bg-emerald-300 dark:bg-emerald-600' : 'bg-surface-200 dark:bg-surface-700'"
        />
      </template>
    </div>

    <!-- Step 1: Detail Event -->
    <div v-if="currentStep === 0" class="space-y-6">
      <div class="bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <span class="w-1 h-5 rounded-full bg-emerald-500"></span>
          <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">Detail Event</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <!-- Left: Title + Description (wider) -->
          <div class="lg:col-span-3 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Judul Event <span class="text-red-500">*</span>
              </label>
              <input v-model="form.title" type="text" placeholder="Contoh: Workshop Python untuk Pemula"
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Deskripsi
              </label>
              <textarea v-model="form.description" rows="5" placeholder="Deskripsi detail tentang event ini..."
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all resize-none" />
            </div>
          </div>

          <!-- Right: Meta fields -->
          <div class="lg:col-span-2 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Status
              </label>
              <div class="relative">
                <select v-model="form.status"
                  class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Visibilitas
              </label>
              <div class="relative">
                <Globe :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10" />
                <select v-model="form.visibility"
                  class="w-full pl-9 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
                  <option value="private">Private — hanya saya</option>
                  <option value="staff">Staff — semua staff</option>
                  <option value="division">Divisi — staff satu divisi</option>
                  <option value="public">Publik — semua orang</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Tanggal Event
              </label>
              <div class="relative">
                <Calendar :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10" />
                <input v-model="form.event_date" type="date"
                  class="w-full pl-9 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Lokasi
              </label>
              <div class="relative">
                <MapPin :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10" />
                <input v-model="form.location" type="text" placeholder="Ruang Meeting, Online, dll."
                  class="w-full pl-9 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Google Form URL <span class="font-normal normal-case tracking-normal">(opsional)</span>
              </label>
              <div class="relative">
                <Link2 :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none z-10" />
                <input v-model="form.google_form_url" type="url" placeholder="https://docs.google.com/forms/d/..."
                  class="w-full pl-9 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
              </div>
              <p class="text-[11px] text-surface-400 mt-1.5">Isi jika sudah punya Google Form. Backend auto-extract Form ID.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <RouterLink to="/events"
          class="px-4 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
          Batal
        </RouterLink>
        <button @click="nextStep"
          :disabled="!form.title.trim()"
          class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-600/20 cursor-pointer">
          Lanjut ke Form
          <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Step 2: Form Builder -->
    <div v-if="currentStep === 1" class="space-y-6">
      <!-- Template Selector -->
      <div class="bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-1 h-5 rounded-full bg-emerald-500"></span>
          <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">Pilih Template Form</h2>
        </div>
        <p class="text-xs text-surface-400 dark:text-surface-500 mb-4">Pilih template yang sudah ada atau buat form kustom dari nol.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button v-for="tpl in templates" :key="tpl.id" @click="selectTemplate(tpl)"
            class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[96px] cursor-pointer"
            :class="selectedTemplateId === tpl.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 shadow-sm shadow-primary-500/10'
              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-800'">
            <FileText :size="24" class="mb-2 shrink-0" :class="selectedTemplateId === tpl.id ? 'text-primary-500' : 'text-surface-400'" />
            <span class="text-xs font-semibold text-surface-700 dark:text-surface-300 text-center leading-tight">{{ tpl.name }}</span>
            <span class="text-[10px] text-surface-400 mt-1">{{ questionsCount(tpl.config) }} pertanyaan</span>
          </button>
          <button @click="selectTemplate(null)"
            class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[96px] cursor-pointer"
            :class="selectedTemplateId === null
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 shadow-sm shadow-primary-500/10'
              : 'border-dashed border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-800'">
            <Plus :size="24" class="mb-2 shrink-0" :class="selectedTemplateId === null ? 'text-primary-500' : 'text-surface-400'" />
            <span class="text-xs font-semibold text-surface-700 dark:text-surface-300">Kustom</span>
            <span class="text-[10px] text-surface-400 mt-1">Buat sendiri</span>
          </button>
        </div>
      </div>

      <!-- Question Editor + Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Editor (left, wider) -->
        <div class="lg:col-span-3 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-1 h-5 rounded-full bg-primary-500"></span>
            <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">Form Builder</h2>
          </div>
          <QuestionEditor v-model="questions" />
        </div>

        <!-- Preview (right, narrower) -->
        <div class="lg:col-span-2">
          <div class="sticky top-24">
            <div class="bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-surface-800/30 p-4 sm:p-5">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-1 h-5 rounded-full bg-amber-500"></span>
                <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">Preview</h2>
              </div>
              <FormPreview :title="form.title || 'Judul Event'" :questions="questions" />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <button @click="prevStep"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors cursor-pointer">
          <ArrowLeft :size="16" />
          Kembali
        </button>
        <button @click="handleSubmit"
          :disabled="submitting"
          class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer">
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ submitting ? 'Menyimpan...' : 'Simpan Event' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check, FileText, Plus, Loader2, Save, Calendar, MapPin, Globe, ChevronDown, Link2 } from 'lucide-vue-next'
import type { Question } from '@/stores/events'
import { useEventsStore } from '@/stores/events'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import { useToast } from '@/composables/useToast'
import QuestionEditor from '@/components/events/QuestionEditor.vue'
import FormPreview from '@/components/events/FormPreview.vue'

const store = useEventsStore()
const templateStore = useFormTemplatesStore()
const toast = useToast()
const router = useRouter()

const steps = [
  { label: 'Detail Event', icon: 'Calendar' },
  { label: 'Form Builder', icon: 'FileText' },
]
const currentStep = ref(0)
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  event_date: '',
  location: '',
  google_form_url: '',
  status: 'draft',
  visibility: 'private',
})

const selectedTemplateId = ref<string | null>(null)
const questions = ref<Question[]>([])

const templates = computed(() => templateStore.templates)

onMounted(() => {
  templateStore.fetchTemplates()
})

function questionsCount(config: string) {
  try { return JSON.parse(config).questions?.length || 0 } catch { return 0 }
}

function selectTemplate(tpl: { id: string; config: string } | null) {
  selectedTemplateId.value = tpl?.id ?? null
  if (tpl) {
    try {
      questions.value = JSON.parse(tpl.config).questions || []
    } catch {
      questions.value = []
    }
  } else {
    questions.value = []
  }
}

function nextStep() {
  if (!form.title.trim()) return
  currentStep.value = 1
}

function prevStep() {
  currentStep.value = 0
}

function goToStep(i: number) {
  if (i <= currentStep.value) currentStep.value = i
}

async function handleSubmit() {
  if (!form.title.trim()) return
  submitting.value = true
  if (import.meta.env.DEV) console.log('[Create Event] ===== HANDLE SUBMIT START =====')
  try {
    const payload: any = { ...form }
    if (!payload.event_date) payload.event_date = null
    if (import.meta.env.DEV) console.log('[Create Event] Payload:', JSON.stringify(payload, null, 2))

    if (import.meta.env.DEV) console.log('[Create Event] Calling store.createEvent...')
    const res = await store.createEvent(payload)
    if (import.meta.env.DEV) console.log('[Create Event] store.createEvent returned:', JSON.stringify(res))

    if (res?.success) {
      const eventId = res.data?.id
      if (import.meta.env.DEV) console.log('[Create Event] Success! eventId:', eventId, 'questions.length:', questions.value.length)

      if (eventId && questions.value.length > 0) {
        if (import.meta.env.DEV) console.log('[Create Event] Generating form for event', eventId, 'with', questions.value.length, 'questions')
        try {
          const genRes = await store.generateForm(eventId, {
            template_id: selectedTemplateId.value || undefined,
            questions: questions.value,
          })
          if (import.meta.env.DEV) console.log('[Create Event] Generate form response:', JSON.stringify(genRes))
        } catch (genErr: any) {
          if (import.meta.env.DEV) console.warn('[Create Event] Form generation failed (non-fatal):', genErr?.message || genErr)
        }
      }

      toast.success('Berhasil', 'Event berhasil dibuat')
      if (import.meta.env.DEV) console.log('[Create Event] Navigating to:', eventId ? `/events/${eventId}` : '/events')

      if (eventId) {
        await router.push(`/events/${eventId}`)
      } else {
        await router.push('/events')
      }
    } else {
      if (import.meta.env.DEV) console.warn('[Create Event] res.success is falsey:', res)
      toast.error('Gagal', res?.message || 'Gagal membuat event')
    }
  } catch (err: any) {
    const body = err?.data || err?.response?._data
    if (import.meta.env.DEV) console.error('[Create Event] CATCH block:', { error: err, body })
    const msg = body?.message || err?.message || 'Terjadi kesalahan saat menyimpan'
    toast.error('Gagal', msg)
  } finally {
    submitting.value = false
    if (import.meta.env.DEV) console.log('[Create Event] ===== HANDLE SUBMIT END =====')
  }
}
</script>
