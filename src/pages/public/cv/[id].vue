<template>
  <div class="min-h-screen bg-surface-100 dark:bg-surface-900 flex items-start justify-center p-4 sm:p-8">
    <div v-if="loading" class="text-center mt-16">
      <div class="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat CV...</p>
    </div>

    <div v-else-if="error" class="mt-16 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/30 p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-red-500">!</div>
      <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">CV Tidak Ditemukan</h2>
      <p class="text-sm text-surface-500 dark:text-surface-400">CV mungkin sudah tidak tersedia atau link yang digunakan tidak valid.</p>
    </div>

    <div v-else-if="cv" class="w-full max-w-[794px]">
      <!-- CV Preview -->
      <div class="shadow-2xl rounded-2xl overflow-hidden border border-surface-200/50 dark:border-surface-700/30">
        <CvPreview :cv="cv" />
      </div>

      <!-- Footer info -->
      <div class="text-center mt-4 mb-8">
        <p class="text-xs text-surface-400">
          <span class="font-medium text-surface-500">{{ cv.full_name || 'Staff' }}</span> &mdash; CV Digital
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import CvPreview from '@/components/cv/CvPreview.vue'
import type { CV } from '@/types'

const route = useRoute()
const cv = ref<CV | null>(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = true
    loading.value = false
    return
  }

  try {
    const res: any = await useApi(`/public/cv/${id}`)
    if (res.success && res.data) {
      cv.value = res.data as CV
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
