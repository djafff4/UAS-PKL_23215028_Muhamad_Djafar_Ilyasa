<template>
  <MobileOptimized>
    <RouterView />
  </MobileOptimized>
  <Toaster />
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useCapacitor, useCapacitorStatusBar } from '@/composables/useCapacitor'
import Toaster from '@/components/ui/Toaster.vue'
import MobileOptimized from '@/components/MobileOptimized.vue'

const auth = useAuthStore()
const notif = useNotificationStore()
const { isNative } = useCapacitor()

watch(() => auth.isAuthenticated, (isAuth) => {
  if (isAuth) {
    notif.fetchNotifications()
  }
}, { immediate: true })

onMounted(async () => {
  if (isNative.value) {
    const { setDark } = await useCapacitorStatusBar()
    await setDark()
  }
})
</script>
