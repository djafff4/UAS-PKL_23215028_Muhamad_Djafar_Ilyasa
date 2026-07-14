<template>
  <div class="relative">
    <!-- Avatar -->
    <div
      @click="fileInput?.click()"
      class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/20 shadow-xl cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <img v-if="previewUrl || auth.user?.profile?.avatar_url" :src="previewUrl || auth.user?.profile?.avatar_url" class="w-full h-full object-cover" />
      <span v-else class="select-none">{{ initials }}</span>
      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-[1px]">
        <Camera :size="22" class="text-white drop-shadow-lg" />
      </div>
    </div>

    <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/jpg,image/webp" @change="onFileSelect" />

    <!-- Upload Dialog (floating below avatar) -->
    <transition name="fade-slide">
      <div v-if="selectedFile" class="absolute top-full left-0 mt-3 w-72 z-50">
        <div class="card p-4 shadow-xl border border-surface-200/60 dark:border-surface-700/40">
          <p class="text-xs text-surface-500 truncate mb-3">{{ selectedFile.name }}</p>

          <div v-if="showCropper" class="mb-3">
            <FocalPointCropper
              :image-url="previewUrl!"
              :output-size="400"
              @update:cropped-blob="onCroppedBlob"
            />
          </div>

          <div v-else class="flex gap-2 mb-3">
            <button @click="showCropper = true" class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
              <Crop :size="12" />
              Atur Posisi Foto
            </button>
          </div>

          <div class="flex gap-2">
            <button @click="saveAvatar" :disabled="saving || !croppedBlob" class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-200 dark:disabled:bg-surface-700 disabled:text-surface-400 text-white text-xs font-bold rounded-xl transition-all disabled:cursor-not-allowed">
              <Loader2 v-if="saving" :size="14" class="animate-spin" />
              <Save v-else :size="14" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button @click="cancelFile" :disabled="saving" class="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 text-xs font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all disabled:cursor-not-allowed">
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Remove button -->
    <transition name="fade">
      <button v-if="auth.user?.profile?.avatar_url && !selectedFile" @click.stop="removeAvatar" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg ring-2 ring-surface-900">
        <X :size="12" />
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Camera, Save, Loader2, Crop, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useApi } from '@/composables/useApi'
import FocalPointCropper from './FocalPointCropper.vue'

const auth = useAuthStore()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const saving = ref(false)
const showCropper = ref(false)
const croppedBlob = ref<Blob | null>(null)



const initials = computed(() => {
  const name = auth.user?.profile?.full_name || auth.user?.name || auth.user?.email || ''
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'S'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Gagal', 'Ukuran foto maksimal 5 MB')
      return
    }
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    showCropper.value = true
    croppedBlob.value = null
  }
}

function onCroppedBlob(blob: Blob | null) {
  croppedBlob.value = blob
}

function cancelFile() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = null
  previewUrl.value = null
  showCropper.value = false
  croppedBlob.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function saveAvatar() {
  if (!croppedBlob.value || saving.value) return
  saving.value = true

  try {
    const formData = new FormData()
    const file = new File([croppedBlob.value], 'avatar.jpg', { type: 'image/jpeg' })
    formData.append('file', file)

    const res: any = await useApi('/auth/avatar', {
      method: 'POST',
      body: formData,
    })

    if (res.success && res.data?.avatar_url) {
      if (auth.user) {
        auth.setAuthData(
          {
            ...auth.user,
            profile: {
              ...auth.user?.profile,
              avatar_url: res.data.avatar_url,
            },
          },
          auth.token || '',
        )
      }
      toast.success('Berhasil', 'Foto profil berhasil diupload')
      cancelFile()
    } else {
      throw new Error(res.message || 'Gagal upload')
    }
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Gagal menyimpan foto profil')
  } finally {
    saving.value = false
  }
}

function removeAvatar() {
  if (auth.user) {
    auth.setAuthData(
      {
        ...auth.user,
        profile: { ...auth.user?.profile, avatar_url: null },
      },
      auth.token || '',
    )
  }
  toast.success('Berhasil', 'Foto profil berhasil dihapus')
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
