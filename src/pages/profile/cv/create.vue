<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex items-center gap-4">
        <RouterLink :to="'/profile/cv'" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
          <ArrowLeft :size="18" />
        </RouterLink>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">{{ isEditing ? 'Edit CV' : 'Buat CV Baru' }}</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Lengkapi data CV Anda dengan template Akman Academy</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Builder -->
      <div class="lg:col-span-3">
        <!-- Error Alert -->
        <div v-if="cvStore.apiError" class="mb-4 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <div class="shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-red-800 dark:text-red-300">Gagal menyimpan ke server</p>
            <p class="text-xs text-red-600 dark:text-red-400 mt-0.5">{{ cvStore.apiError }}</p>
          </div>
          <button @click="cvStore.clearError()" class="shrink-0 p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
            <X :size="14" />
          </button>
        </div>

        <CvBuilder :cv="cv" />

        <!-- Actions -->
        <div class="flex items-center gap-3 mt-6">
          <button @click="saveDraft" :disabled="saving" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white text-sm font-bold rounded-xl transition-all disabled:cursor-not-allowed">
            <Save :size="16" />
            {{ saving ? 'Menyimpan...' : 'Simpan CV' }}
          </button>
          <span class="text-xs text-surface-400 flex items-center gap-1">
            <span v-if="autoSaveStatus === 'saving'" class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span v-else-if="autoSaveStatus === 'saved'" class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span v-else-if="autoSaveStatus === 'error'" class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <template v-if="autoSaveStatus === 'saving'">Menyimpan...</template>
            <template v-else-if="autoSaveStatus === 'saved'">Tersimpan</template>
            <template v-else-if="autoSaveStatus === 'error'">Gagal simpan</template>
          </span>
          <RouterLink :to="'/profile/cv'" class="px-5 py-2.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-sm font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all">
            Batal
          </RouterLink>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="lg:col-span-2">
        <div class="lg:sticky lg:top-[88px] space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-surface-500">Live Preview</h3>
            <span class="text-[10px] font-medium text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">{{ cv.template === 'akman-academy' ? 'Akman Academy' : 'Modern' }}</span>
          </div>
          <CvPreview :cv="cv" @exported="saveDraft" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, X } from 'lucide-vue-next'
import { useCvStore } from '@/stores/cv'
import { useAuthStore } from '@/stores/auth'
import CvBuilder from '@/components/cv/CvBuilder.vue'
import CvPreview from '@/components/cv/CvPreview.vue'
import type { CV } from '@/types'

const route = useRoute()
const router = useRouter()
const cvStore = useCvStore()
const auth = useAuthStore()

const isEditing = ref(false)
const saving = ref(false)
const autoSaveStatus = ref<'saving' | 'saved' | 'error' | null>(null)
const hasUnsavedChanges = ref(false)

const cv = ref<CV>(cvStore.createBlankCv())

onMounted(async () => {
  const id = (route.query.id as string) || (route.params.id as string)
  if (id) {
    isEditing.value = true
    const existing = await cvStore.fetchCv(id)
    if (existing) {
      cv.value = { ...existing }
    }
  }

  // Prefill from auth profile (only for NEW CVs, not edit)
  if (!isEditing.value && auth.user) {
    cv.value.full_name = auth.user.profile?.full_name || auth.user.name || ''
    cv.value.email = auth.user.email || ''
    cv.value.phone = auth.user.phone || ''
    cv.value.position = auth.user.staff_detail?.position || ''
    cv.value.department = auth.user.staff_detail?.department || ''
  }
})

// ── Debounced auto-save (edit mode only) ──
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

watch(cv, () => {
  if (!isEditing.value) return
  hasUnsavedChanges.value = true

  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(async () => {
    await performSave()
  }, 3000)
}, { deep: true })

onUnmounted(() => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
})

async function performSave() {
  if (saving.value) return
  saving.value = true
  autoSaveStatus.value = 'saving'
  try {
    const saved = await cvStore.saveCv(cv.value)
    if (saved) {
      cv.value = { ...saved }
      hasUnsavedChanges.value = false
      autoSaveStatus.value = 'saved'
      setTimeout(() => { autoSaveStatus.value = null }, 3000)
    } else {
      // API returned null — show error
      autoSaveStatus.value = 'error'
      setTimeout(() => { autoSaveStatus.value = null }, 5000)
    }
  } finally {
    saving.value = false
  }
}

async function saveDraft() {
  // Cancel any pending auto-save
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  await performSave()

  // Redirect back to list if creating new
  if (!isEditing.value) {
    router.push('/profile/cv')
  }
}
</script>
