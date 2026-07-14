<template>
  <div class="relative">
    <div class="absolute left-[17px] top-3 bottom-3 w-px bg-surface-200 dark:bg-surface-700/50"></div>

    <div v-if="items.length === 0" class="py-8 text-center">
      <p class="text-sm text-surface-400">Belum ada aktivitas terbaru</p>
    </div>

    <div v-else class="space-y-0">
      <div v-for="activity in items" :key="activity.id"
        class="relative flex items-start gap-4 pb-5 last:pb-0 group">
        <div class="relative z-10 mt-1 shrink-0">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
            :class="dotBg(activity.target_type)">
            <component :is="activityIcon(activity.target_type)" :size="15" :class="dotColor(activity.target_type)" />
          </div>
        </div>

        <div class="flex-1 min-w-0 pt-0.5">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
              <span class="font-semibold text-surface-900 dark:text-surface-100">{{ activity.user_name }}</span>
              {{ activity.action }}
              <span class="font-semibold text-surface-900 dark:text-surface-100">{{ activity.target }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[11px] font-medium text-surface-400 dark:text-surface-500">{{ formatTime(activity.timestamp) }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              :class="activityBadge(activity.target_type)">{{ typeLabels[activity.target_type] || activity.target_type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, BarChart3, Map, FileText, CalendarDays } from 'lucide-vue-next'
import type { StaffActivityItem } from '@/types'

const props = defineProps<{
  items: StaffActivityItem[]
}>()

function activityIcon(type: string) {
  const icons: Record<string, any> = { task: CheckSquare, kpi: BarChart3, roadmap: Map, document: FileText, meeting: CalendarDays }
  return icons[type] || CheckSquare
}

function dotBg(type: string) {
  const bgs: Record<string, string> = {
    task: 'bg-primary-100 dark:bg-primary-900/30',
    kpi: 'bg-emerald-100 dark:bg-emerald-900/30',
    roadmap: 'bg-violet-100 dark:bg-violet-900/30',
    document: 'bg-amber-100 dark:bg-amber-900/30',
    meeting: 'bg-rose-100 dark:bg-rose-900/30',
  }
  return bgs[type] || 'bg-surface-100 dark:bg-surface-800'
}

function dotColor(type: string) {
  const colors: Record<string, string> = {
    task: 'text-primary-600 dark:text-primary-400',
    kpi: 'text-emerald-600 dark:text-emerald-400',
    roadmap: 'text-violet-600 dark:text-violet-400',
    document: 'text-amber-600 dark:text-amber-400',
    meeting: 'text-rose-600 dark:text-rose-400',
  }
  return colors[type] || 'text-surface-500'
}

const typeLabels: Record<string, string> = {
  task: 'Task',
  kpi: 'KPI',
  roadmap: 'Roadmap',
  document: 'Dokumen',
  meeting: 'Meeting',
}

function activityBadge(type: string) {
  const badgeStyles: Record<string, string> = {
    task: 'bg-primary-100/70 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    kpi: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    roadmap: 'bg-violet-100/70 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
    document: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    meeting: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  }
  return badgeStyles[type] || 'bg-surface-100 text-surface-600'
}

function formatTime(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 0) return 'baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.activity-enter-active, .activity-leave-active {
  transition: all 0.3s ease;
}
.activity-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
