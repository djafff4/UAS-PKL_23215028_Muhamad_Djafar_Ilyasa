<template>
  <div class="fixed bottom-4 right-2 sm:right-4 left-2 sm:left-auto z-[100] flex flex-col gap-3 pointer-events-none items-stretch sm:items-end">
    <TransitionGroup name="toast">
      <div
        v-for="notif in activeToasts"
        :key="notif.id"
        class="pointer-events-auto group relative w-full sm:w-80 overflow-hidden rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border border-surface-200/50 dark:border-surface-700/50 shadow-2xl p-4 transition-all duration-300 hover:scale-[1.02]"
      >
        <!-- Type-specific indicator -->
        <div 
          class="absolute top-0 left-0 bottom-0 w-1.5"
          :class="{
            'bg-green-500': notif.type === 'success',
            'bg-red-500': notif.type === 'error',
            'bg-amber-500': notif.type === 'warning',
            'bg-blue-500': notif.type === 'info',
          }"
        />

        <div class="flex items-start gap-3">
          <div class="mt-0.5">
            <CheckCircle2 v-if="notif.type === 'success'" :size="20" class="text-green-500" />
            <AlertCircle v-else-if="notif.type === 'error'" :size="20" class="text-red-500" />
            <AlertTriangle v-else-if="notif.type === 'warning'" :size="20" class="text-amber-500" />
            <Info v-else :size="20" class="text-blue-500" />
          </div>
          
          <div class="flex-1">
            <h4 class="text-xs font-black uppercase tracking-widest text-surface-900 dark:text-surface-100">
              {{ notif.title }}
            </h4>
            <p class="text-[11px] font-medium text-surface-500 dark:text-surface-400 leading-relaxed mt-1">
              {{ notif.message }}
            </p>
          </div>

          <button @click="store.markAsRead(notif.id)" class="text-surface-300 hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
            <X :size="16" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'

const store = useNotificationStore()

const activeToasts = computed(() => {
  // Show last 5 unread notifications as toasts
  return store.notifications.filter(n => !n.read).slice(0, 5)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
