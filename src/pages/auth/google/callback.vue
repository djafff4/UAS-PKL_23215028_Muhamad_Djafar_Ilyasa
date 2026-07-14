<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
    <div class="text-center">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm font-medium text-surface-500">Memproses autentikasi Google...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

onMounted(async () => {
  const token = route.query.token as string
  const error = route.query.error as string

  if (error) {
    if (window.opener) {
      window.opener.postMessage({ type: 'google-auth-error', error }, '*')
      window.close()
    } else {
      toast.error('Error Google', error)
      router.push('/login')
    }
  } else if (!token) {
    if (window.opener) {
      window.opener.postMessage({ type: 'google-auth-error', error: 'Token tidak ditemukan' }, '*')
      window.close()
    } else {
      toast.error('Error', 'Token tidak ditemukan')
      router.push('/login')
    }
  } else {
    try {
      auth.token = token
      await auth.fetchMe()

      if (window.opener) {
        window.opener.postMessage({ type: 'google-auth-success' }, '*')
        window.close()
      } else {
        toast.success('Sukses', 'Autentikasi Google berhasil')
        router.push('/settings')
      }
    } catch {
      if (window.opener) {
        window.opener.postMessage({ type: 'google-auth-error', error: 'Gagal memproses autentikasi' }, '*')
        window.close()
      } else {
        toast.error('Error', 'Gagal memproses autentikasi Google')
        router.push('/login')
      }
    }
  }
})
</script>
