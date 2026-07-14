<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200 dark:from-surface-900 dark:via-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
    <div v-if="loading" class="text-center">
      <div class="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat event...</p>
    </div>

    <div v-else-if="error" class="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/30 p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl">!</span>
      </div>
      <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Event Tidak Ditemukan</h2>
      <p class="text-sm text-surface-500 dark:text-surface-400">Event mungkin sudah tidak tersedia atau link yang digunakan tidak valid.</p>
    </div>

    <div v-else-if="event" class="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/30 overflow-hidden max-w-lg w-full">
      <!-- Hero -->
      <div class="bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-6 sm:p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
          <CalendarIcon :size="28" class="text-white" />
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white mb-2">{{ event.title }}</h1>
        <p v-if="event.event_date" class="text-sm text-white/70">
          {{ formatDate(event.event_date) }}
        </p>
      </div>

      <!-- Content -->
      <div class="p-6 sm:p-8 space-y-6">
        <div v-if="event.description" class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed whitespace-pre-line">
          {{ event.description }}
        </div>

        <div v-if="event.location" class="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400">
          <MapPin :size="16" class="mt-0.5 shrink-0" />
          <span>{{ event.location }}</span>
        </div>

        <div v-if="event.event_date" class="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400">
          <Clock :size="16" class="mt-0.5 shrink-0" />
          <span>{{ formatDate(event.event_date) }}</span>
        </div>

        <!-- CTA -->
        <a v-if="event.google_form_url"
          :href="event.google_form_url"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/25">
          Buka Google Form
        </a>
        <p v-else class="text-center text-sm text-surface-400">Tautan form belum tersedia</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const loading = ref(true)
const error = ref(false)
const event = ref<any>(null)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const shortCode = route.params.short_code as string
  if (!shortCode) {
    error.value = true
    loading.value = false
    return
  }

  try {
    const res = await useApi(`/e/${shortCode}/landing`)
    if (res?.success && res?.data) {
      event.value = res.data
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
