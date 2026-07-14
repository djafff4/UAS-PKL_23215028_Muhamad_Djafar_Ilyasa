<template>
  <RouterLink
    v-if="!isLogout"
    :to="item.to"
    @click="mobile && $emit('navigate')"
    class="group flex items-center rounded-xl font-medium transition-all duration-200"
    :class="[
      collapsed ? 'justify-center h-11 w-11 mx-auto' : 'gap-3 px-3.5 py-2.5 relative',
      active
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20'
        : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60'
    ]"
  >
    <span v-if="active && !collapsed" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary-500" />
    <component :is="item.icon" :size="20" class="shrink-0 transition-transform group-hover:scale-105" />
    <transition name="fade-label">
      <span v-if="!collapsed" class="text-sm truncate">{{ item.label }}</span>
    </transition>
  </RouterLink>

  <!-- Logout is a button, not a router-link -->
  <button
    v-else
    @click="onLogout"
    class="group flex items-center rounded-xl font-medium transition-all duration-200 w-full"
    :class="collapsed
      ? 'justify-center h-11 w-11 mx-auto text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
      : 'gap-3 px-3.5 py-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'"
  >
    <component :is="item.icon" :size="20" class="shrink-0 transition-transform group-hover:scale-105" />
    <transition name="fade-label">
      <span v-if="!collapsed" class="text-sm">Keluar</span>
    </transition>
  </button>
</template>

<script setup lang="ts">
import type { NavItem } from '@/config/navigation'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  item: NavItem
  active: boolean
  collapsed: boolean
  mobile?: boolean
}>()

defineEmits<{ navigate: [] }>()

const auth = useAuthStore()
const isLogout = props.item.label === 'Keluar'

function onLogout() {
  auth.logout()
}
</script>

<style scoped>
.fade-label-enter-active, .fade-label-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-label-enter-from, .fade-label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
