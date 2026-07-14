<template>
  <div class="space-y-2">
    <div v-for="task in tasks" :key="task.id"
      class="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group">
      <!-- Checkbox -->
      <button @click="toggleStatus(task)" class="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors"
        :class="task.status === 'DONE' ? 'bg-green-500 border-green-500 text-white' : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'">
        <Check v-if="task.status === 'DONE'" :size="12" />
      </button>
      
      <!-- Task Info -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-surface-900 dark:text-surface-100" :class="{ 'line-through text-surface-400': task.status === 'DONE' }">
          {{ task.title }}
        </p>
        <div class="flex flex-wrap items-center gap-2 mt-1">
          <span class="badge" :class="statusBadge(task.status)">{{ statusLabel(task.status) }}</span>
          <span class="badge" :class="priorityBadge(task.priority)">{{ priorityLabel(task.priority) }}</span>
          <span class="text-xs text-surface-400 truncate">{{ task.assignee.name }}</span>
          <span v-if="task.deadline" class="text-xs text-surface-400">{{ formatDate(task.deadline) }}</span>
        </div>
      </div>
      
      <!-- Progress -->
      <div class="flex items-center gap-2 shrink-0">
        <div class="w-16 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <div class="h-full rounded-full" :class="progressColor(task.progress)" :style="{ width: task.progress + '%' }"></div>
        </div>
        <span class="text-xs font-medium text-surface-500">{{ task.progress }}%</span>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click.stop="$emit('edit', task)" 
          class="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all"
          title="Edit task">
          <Pencil :size="14" />
        </button>
        <button @click.stop="$emit('delete', task)" 
          class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          title="Hapus task">
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Pencil, Trash2 } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/tasks'
import type { Task, TaskStatus } from '@/types'

defineProps<{ tasks: Task[] }>()
defineEmits<{ edit: [task: Task]; delete: [task: Task] }>()

const taskStore = useTaskStore()

function toggleStatus(task: Task) {
  const newStatus: TaskStatus = task.status === 'DONE' ? 'PENDING' : 'DONE'
  taskStore.updateTaskStatus(task.id, newStatus)
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
    CANCELLED: 'Cancelled',
  }
  return labels[status] || status
}

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    REVIEW: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function priorityLabel(priority: string) {
  const labels: Record<string, string> = {
    RENDAH: 'Rendah',
    SEDANG: 'Sedang',
    TINGGI: 'Tinggi',
    KRITIS: 'Kritis',
  }
  return labels[priority] || priority
}

function priorityBadge(priority: string) {
  const badges: Record<string, string> = {
    RENDAH: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
    SEDANG: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    TINGGI: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    KRITIS: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return badges[priority] || 'bg-surface-100 text-surface-600'
}

function progressColor(progress: number) {
  if (progress >= 100) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  return 'bg-yellow-500'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>
