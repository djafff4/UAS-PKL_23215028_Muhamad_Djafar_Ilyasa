<template>
  <div class="space-y-6">
    <div v-if="store.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat event...</p>
    </div>

    <template v-if="ev">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">{{ ev.title }}</h1>
              <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                :class="statusBadge(ev.status)">{{ ev.status }}</span>
            </div>
            <p class="text-sm text-white/60 mt-1 font-mono">Kode: {{ ev.short_code }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="copyShortUrl" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200">
              <ClipboardList :size="16" />
              Salin URL
            </button>
            <RouterLink :to="`/events/${ev.id}/edit`" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200">
              <Edit :size="16" />
              Edit
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div class="card p-5 flex flex-col items-center text-center">
          <h3 class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">QR Code</h3>
          <img :src="store.getQRUrl(ev.id)" alt="QR Code" class="w-40 h-40 rounded-xl bg-surface-100 dark:bg-surface-800 mb-3" />
          <p class="text-xs text-surface-400 font-mono break-all">{{ shortUrl }}</p>
        </div>

        <div class="card p-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-4">Stats</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-surface-600 dark:text-surface-400">Total Scan</span>
              <span class="text-2xl font-black text-surface-900 dark:text-surface-100">{{ ev.scan_count }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-surface-600 dark:text-surface-400">Total Hadir</span>
              <span class="text-2xl font-black text-surface-900 dark:text-surface-100">{{ ev.attendee_count }}</span>
            </div>
          </div>
        </div>

        <div class="card p-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-4">Info</h3>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-surface-400">Tanggal</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ ev.event_date ? formatDate(ev.event_date) : '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-surface-400">Lokasi</p>
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ ev.location || '-' }}</p>
            </div>
            <div v-if="ev.google_form_url">
              <p class="text-xs text-surface-400">Google Form</p>
              <a :href="ev.google_form_url" target="_blank" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1">
                Buka Form
                <ExternalLink :size="12" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between p-4 sm:p-5 border-b border-surface-200/50 dark:border-surface-700/30">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
              Attendees
            </h3>
            <div class="flex gap-2">
              <button @click="handleSync" :disabled="syncing" class="btn-ghost text-xs">
                <RefreshCw :size="14" :class="{ 'animate-spin': syncing }" />
                Sync Now
              </button>
              <a :href="store.getExportUrl(ev.id)" class="btn-ghost text-xs">
                <Download :size="14" />
                Export CSV
              </a>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-surface-50 dark:bg-surface-800/50">
                  <th class="text-left px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Nama</th>
                  <th class="text-left px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th class="text-center px-4 py-2.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Scan At</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100 dark:divide-surface-800/30">
                <tr v-for="att in store.attendees" :key="att.id" class="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                  <td class="px-4 py-2.5 text-sm text-surface-900 dark:text-surface-100">{{ att.name || '-' }}</td>
                  <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell">{{ att.email || '-' }}</td>
                  <td class="px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 text-center">{{ att.scanned_at ? formatDateTime(att.scanned_at) : '-' }}</td>
                </tr>
                <tr v-if="!store.attendees.length">
                  <td colspan="3" class="px-4 py-8 text-center text-sm text-surface-400">Belum ada attendees</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="store.attendeesTotal > 20" class="flex items-center justify-between px-4 py-2.5 border-t border-surface-200/50 dark:border-surface-800/30">
            <button @click="prevAttendees" :disabled="attendeePage <= 1" class="text-xs font-medium text-surface-600 hover:text-surface-900 dark:hover:text-surface-100 disabled:text-surface-300 disabled:cursor-not-allowed">Prev</button>
            <span class="text-xs text-surface-400">Page {{ attendeePage }}</span>
            <button @click="nextAttendees" :disabled="attendeePage * 20 >= store.attendeesTotal" class="text-xs font-medium text-surface-600 hover:text-surface-900 dark:hover:text-surface-100 disabled:text-surface-300 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>

        <div class="card p-4 sm:p-5">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-emerald-500"></span>
            Sync Logs
          </h3>
          <div class="space-y-3 max-h-[360px] overflow-y-auto">
            <div v-for="log in store.syncLogs" :key="log.id" class="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                :class="log.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                {{ log.status === 'success' ? 'OK' : '!!' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{{ log.message || 'Sync' }}</p>
                <p class="text-[10px] text-surface-400 mt-0.5">{{ log.created_at ? formatDateTime(log.created_at) : '' }}</p>
              </div>
            </div>
            <div v-if="!store.syncLogs.length" class="text-center py-6 text-sm text-surface-400">
              Belum ada sync log
            </div>
          </div>
        </div>
      </div>

      <!-- Form Management -->
      <div v-if="ev.google_form_created" class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-surface-900 flex items-center gap-2">
            <span class="w-1 h-4 rounded-full bg-primary-500"></span>
            Form Management
          </h3>
          <div class="flex gap-2">
            <button @click="syncFromGoogle" class="btn-ghost text-xs"><RefreshCw :size="14" /> Sync</button>
            <a :href="`https://docs.google.com/forms/d/${ev.google_form_id}/edit`" target="_blank" class="btn-ghost text-xs"><ExternalLink :size="14" /> Edit di Google</a>
          </div>
        </div>
        <div class="mb-3">
          <p class="text-xs text-surface-400 mb-1">Google Form</p>
          <a :href="ev.google_form_url" target="_blank" class="text-sm text-primary-500 hover:underline truncate block">{{ ev.google_form_url }}</a>
        </div>
        <div v-if="formQuestions.length > 0">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-surface-500">Pertanyaan ({{ formQuestions.length }})</p>
            <button @click="pushToGoogle" class="text-xs font-semibold text-primary-500 hover:text-primary-600">Push ke Google</button>
          </div>
          <div class="space-y-1">
            <div v-for="(q, i) in formQuestions" :key="q.id" class="flex items-center gap-2 py-1.5">
              <span class="text-xs font-bold text-surface-300 w-5 text-right">{{ i + 1 }}</span>
              <span class="text-sm text-surface-700">{{ q.title }}</span>
              <span v-if="q.required" class="text-[10px] text-red-400">*</span>
              <span class="text-[10px] text-surface-400 ml-auto">{{ q.type }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-6">
        <button @click="showGenerateModal = true" class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl">
          <FilePlus :size="16" />
          Generate Google Form
        </button>
      </div>
    </template>

    <!-- Generate Google Form Modal -->
    <Teleport to="body">
      <div v-if="showGenerateModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showGenerateModal = false"></div>
        <div class="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200/50 dark:border-surface-700/30 w-full max-w-2xl max-h-[85vh] flex flex-col">
          <div class="flex items-center justify-between p-5 border-b border-surface-200/50 dark:border-surface-700/30">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <FilePlus :size="16" class="text-primary-500" />
              Generate Google Form
            </h3>
            <button @click="showGenerateModal = false" class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
              <X :size="16" class="text-surface-400" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
                Pilih Template (opsional)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button v-for="tpl in templates" :key="tpl.id" @click="selectGenTemplate(tpl)"
                  class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer"
                  :class="genSelectedTemplateId === tpl.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'">
                  <FileText :size="20" class="mb-1" :class="genSelectedTemplateId === tpl.id ? 'text-primary-500' : 'text-surface-400'" />
                  <span class="text-[11px] font-semibold text-surface-700 dark:text-surface-300 text-center leading-tight">{{ tpl.name }}</span>
                  <span class="text-[10px] text-surface-400">{{ genQuestionsCount(tpl.config) }} pertanyaan</span>
                </button>
                <button @click="selectGenTemplate(null)"
                  class="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer"
                  :class="genSelectedTemplateId === null && genQuestions.length === 0
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'">
                  <Plus :size="20" class="mb-1 text-surface-400" />
                  <span class="text-[11px] font-semibold text-surface-500">Kustom</span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
                Pertanyaan Form
              </label>
              <QuestionEditor v-model="genQuestions" />
            </div>
          </div>
          <div class="flex items-center justify-between p-5 border-t border-surface-200/50 dark:border-surface-700/30">
            <button @click="showGenerateModal = false" class="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
              Batal
            </button>
            <button @click="handleGenerateForm" :disabled="generating"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl disabled:opacity-50 transition-all">
              <Loader2 v-if="generating" :size="16" class="animate-spin" />
              <span v-else>Generate Form</span>
              {{ generating ? 'Memproses...' : '' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { ClipboardList, Edit, Download, RefreshCw, ExternalLink, FilePlus, X, Loader2, Plus, FileText } from 'lucide-vue-next'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'
import { useFormTemplatesStore } from '@/stores/formTemplates'
import QuestionEditor from '@/components/events/QuestionEditor.vue'

const store = useEventsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const ev = computed(() => store.currentEvent)
const shortUrl = computed(() => {
  if (!ev.value?.short_code) return ''
  return `${window.location.origin}/e/${ev.value.short_code}`
})
const attendeePage = ref(1)
const syncing = ref(false)

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    archived: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function copyShortUrl() {
  try {
    await navigator.clipboard.writeText(shortUrl.value)
    toast.success('Tersalin', 'URL berhasil disalin')
  } catch {
    toast.error('Gagal', 'Gagal menyalin URL')
  }
}

async function handleSync() {
  syncing.value = true
  try {
    const res = await store.triggerSync(ev.value!.id)
    if (res?.success) {
      toast.success('Sukses', 'Sync berhasil dijalankan')
      await Promise.all([
        store.fetchSyncLogs(ev.value!.id),
        store.fetchStats(ev.value!.id),
        store.fetchAttendees(ev.value!.id)
      ])
    } else {
      toast.error('Gagal', res?.message || 'Sync gagal')
    }
  } finally {
    syncing.value = false
  }
}

function prevAttendees() {
  if (attendeePage.value > 1) {
    attendeePage.value--
    store.fetchAttendees(ev.value!.id, attendeePage.value)
  }
}

function nextAttendees() {
  if (attendeePage.value * 20 < store.attendeesTotal) {
    attendeePage.value++
    store.fetchAttendees(ev.value!.id, attendeePage.value)
  }
}

const formQuestions = ref<any[]>([])
const formConfigLoaded = ref(false)

// Generate Form Modal
const showGenerateModal = ref(false)
const genQuestions = ref<any[]>([])
const genSelectedTemplateId = ref<string | null>(null)
const generating = ref(false)
const templateStore = useFormTemplatesStore()
const templates = computed(() => templateStore.templates)

onMounted(() => {
  templateStore.fetchTemplates()
})

function selectGenTemplate(tpl: { id: string; config: string } | null) {
  genSelectedTemplateId.value = tpl?.id ?? null
  if (tpl) {
    try {
      genQuestions.value = JSON.parse(tpl.config).questions || []
    } catch {
      genQuestions.value = []
    }
  } else {
    genQuestions.value = []
  }
}

function genQuestionsCount(config: string) {
  try { return JSON.parse(config).questions?.length || 0 } catch { return 0 }
}

async function handleGenerateForm() {
  if (!ev.value?.id) return
  generating.value = true
  try {
    const res = await store.generateForm(ev.value.id, {
      template_id: genSelectedTemplateId.value || undefined,
      questions: genQuestions.value,
    })
    if (res?.success || res?.form_url) {
      toast.success('Berhasil', 'Google Form berhasil dibuat')
      showGenerateModal.value = false
      await store.fetchEvent(ev.value.id)
    } else {
      toast.error('Gagal', res?.message || 'Gagal membuat form')
    }
  } catch (err: any) {
    toast.error('Gagal', err?.message || 'Gagal membuat form')
  } finally {
    generating.value = false
  }
}

async function loadFormConfig() {
  if (!ev.value?.google_form_created || formConfigLoaded.value) return
  const cfg = await store.getFormConfig(ev.value.id)
  if (cfg?.config) {
    try {
      const parsed = JSON.parse(cfg.config)
      formQuestions.value = parsed.questions || parsed || []
    } catch { /* ignore parse errors */ }
  }
  formConfigLoaded.value = true
}

async function pushToGoogle() {
  const res = await store.pushQuestions(ev.value!.id, formQuestions.value)
  if (res?.success) toast.success('Sukses', 'Questions pushed to Google Form')
  else toast.error('Gagal', res?.message || 'Push failed')
}

async function syncFromGoogle() {
  const data = await store.syncFromGoogle(ev.value!.id)
  if (data) {
    formQuestions.value = Array.isArray(data) ? data : []
    toast.success('Sukses', 'Structure synced from Google Form')
  } else {
    toast.error('Gagal', 'Sync failed')
  }
}

onMounted(async () => {
  const id = route.params.id as string
  try {
    await store.fetchEvent(id)
    if (store.currentEvent) {
      await Promise.all([
        store.fetchStats(id),
        store.fetchAttendees(id),
        store.fetchSyncLogs(id)
      ])
      await loadFormConfig()
    } else {
      toast.error('Gagal', 'Event tidak ditemukan')
      router.push('/events')
    }
  } catch (err: any) {
    console.error('[Event Detail Error]', err)
    toast.error('Gagal', err?.message || 'Gagal memuat event')
    router.push('/events')
  }
})
</script>
