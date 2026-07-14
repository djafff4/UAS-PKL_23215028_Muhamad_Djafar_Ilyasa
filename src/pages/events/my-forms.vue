<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">My Google Forms</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Semua Google Form yang telah dibuat</p>
        </div>
        <RouterLink to="/events/create" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          New Event
        </RouterLink>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat forms...</p>
    </div>

    <div v-else-if="store.events.length === 0" class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-12 text-center">
      <FileText :size="40" class="mx-auto text-surface-300 mb-3" />
      <p class="text-sm text-surface-500 font-medium">Belum ada Google Form</p>
      <p class="text-xs text-surface-400 mt-1">Buat event baru dan generate form untuk memulai</p>
      <RouterLink to="/events/create" class="inline-flex items-center gap-2 mt-4 px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all">
        <Plus :size="16" />
        Buat Event Baru
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="ev in store.events" :key="ev.id"
        class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-5 hover:shadow-lg transition-all duration-200 flex flex-col">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{{ ev.title }}</h3>
            <p class="text-xs text-surface-400 mt-0.5 font-mono truncate">{{ ev.short_code }}</p>
          </div>
          <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2"
            :class="statusBadge(ev.status)">{{ ev.status }}</span>
        </div>

        <div v-if="ev.google_form_url" class="mb-3 flex-1">
          <p class="text-[10px] text-surface-400 uppercase tracking-wider font-semibold mb-1">Form URL</p>
          <a :href="ev.google_form_url" target="_blank" rel="noopener noreferrer"
            class="text-xs text-primary-600 dark:text-primary-400 hover:underline truncate block break-all">
            {{ ev.google_form_url }}
          </a>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
          <RouterLink :to="`/events/${ev.id}`" class="flex-1 text-center px-3 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
            Detail
          </RouterLink>
          <button @click="copyUrl(ev)" class="flex-1 px-3 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
            Salin URL
          </button>
          <a :href="ev.google_form_url" target="_blank" class="flex-1 text-center px-3 py-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl transition-colors">
            Buka
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Plus, FileText } from 'lucide-vue-next'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'

const store = useEventsStore()
const toast = useToast()

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    archived: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

async function copyUrl(ev: any) {
  try {
    await navigator.clipboard.writeText(ev.google_form_url)
    toast.success('Tersalin', 'URL form berhasil disalin')
  } catch {
    toast.error('Gagal', 'Gagal menyalin URL')
  }
}

onMounted(() => {
  store.fetchEvents({ scope: 'mine', page: 1, has_form: 'true' })
})
</script>
