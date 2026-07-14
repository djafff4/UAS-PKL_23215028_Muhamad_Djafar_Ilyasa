<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 h-14 sm:h-16 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 flex items-center justify-around px-1 sm:px-2 z-50">
    <RouterLink
      v-for="item in primaryItems" :key="item.to" :to="item.to"
      class="flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-14 sm:w-16 h-full text-surface-500 dark:text-surface-400 transition-colors duration-150 relative"
      :class="{ 'text-primary-600 dark:text-primary-400': isActive(item.to) }"
    >
      <div class="relative">
        <component :is="item.icon" :size="18" class="sm:size-20" />
        <span v-if="item.badge" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{{ item.badge }}</span>
      </div>
      <span class="text-[9px] sm:text-[10px] font-medium">{{ item.label }}</span>
      <span v-if="isActive(item.to)" class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary-500" />
    </RouterLink>

    <!-- More Menu Button -->
    <button @click="showMore = !showMore"
      class="flex flex-col items-center justify-center gap-0.5 sm:gap-1 w-14 sm:w-16 h-full text-surface-500 dark:text-surface-400 transition-colors duration-150"
      :class="{ 'text-primary-600 dark:text-primary-400': showMore }">
      <MoreHorizontal :size="18" class="sm:size-20 transition-transform duration-200" :class="showMore ? 'rotate-90' : ''" />
      <span class="text-[9px] sm:text-[10px] font-medium">Lainnya</span>
    </button>

    <!-- More Menu Overlay -->
    <Teleport to="body">
      <transition name="more-overlay">
        <div v-if="showMore" @click.self="showMore = false"
          class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[100] flex flex-col justify-end">
          <div class="bg-white dark:bg-surface-900 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
            </div>
            <div class="flex items-center justify-between px-5 mb-2">
              <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Menu</h3>
              <button @click="showMore = false" class="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full text-surface-500 transition-colors">
                <X :size="18" />
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1 px-4 pb-8 max-h-[50vh] overflow-y-auto">
              <RouterLink
                v-for="item in moreItems" :key="item.to" :to="item.to"
                @click="showMore = false"
                class="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                :class="{ 'text-primary-600 dark:text-primary-400': isActive(item.to) }"
              >
                <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"
                  :class="{ 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400': isActive(item.to) }">
                  <component :is="item.icon" :size="18" />
                </div>
                <span class="text-[10px] font-medium text-center leading-tight text-surface-700 dark:text-surface-300">{{ item.label }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, CheckSquare, BarChart3, FileText, Building2,
  Map, CalendarDays, StickyNote, Trophy, User, Users, MoreHorizontal, X
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const showMore = ref(false)

const primaryItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, badge: 0 },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare, badge: 0 },
  { label: 'Dokumen', to: '/documents', icon: FileText, badge: 0 },
]

const moreItems = computed(() => {
  const items: { label: string; to: string; icon: any }[] = [
    { label: 'KPI', to: '/kpi', icon: BarChart3 },
    { label: 'Workspace', to: '/workspace', icon: Building2 },
    { label: 'Roadmap', to: '/roadmap', icon: Map },
    { label: 'Meeting', to: '/meetings', icon: CalendarDays },
    { label: 'Notes', to: '/notes', icon: StickyNote },
    { label: 'Prestasi', to: '/achievements', icon: Trophy },
    { label: 'Profil', to: '/profile', icon: User },
  ]
  if (auth.canManageStaff) {
    items.push({ label: 'Staff', to: '/workspace/staff', icon: Users })
  }
  return items
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function openMore() {
  showMore.value = true
}

defineExpose({ openMore })
</script>

<style scoped>
.more-overlay-enter-active,
.more-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.more-overlay-enter-active > div:last-child,
.more-overlay-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.more-overlay-enter-from,
.more-overlay-leave-to {
  opacity: 0;
}
.more-overlay-enter-from > div:last-child,
.more-overlay-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
