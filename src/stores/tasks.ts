import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStaffApi } from '@/composables/useStaffApi'
import type { Task, TaskStatus } from '@/types'

const LOCAL_KEY = 'staff_akman_tasks'

function loadLocal(): Task[] {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? JSON.parse(raw) : []
    }
  } catch {}
  return []
}

function saveLocal(data: Task[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    }
  } catch {}
}

function genLocalId() {
  return 'local_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const is403 = ref(false)

  const tasksByStatus = computed(() => {
    const grouped: Record<string, Task[]> = {}
    for (const task of tasks.value) {
      if (!grouped[task.status]) grouped[task.status] = []
      grouped[task.status].push(task)
    }
    return grouped
  })

  const taskStats = computed(() => ({
    total: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'PENDING').length,
    progress: tasks.value.filter(t => t.status === 'PROGRESS').length,
    review: tasks.value.filter(t => t.status === 'REVIEW').length,
    done: tasks.value.filter(t => t.status === 'DONE').length,
    cancelled: tasks.value.filter(t => t.status === 'CANCELLED').length,
  }))

  function mapTask(t: any): Task {
    return {
      id: t.id,
      title: t.title || '',
      description: t.description || '',
      status: t.status || 'PENDING',
      priority: t.priority || 'SEDANG',
      assignee: {
        id: t.assignee_id || t.assignee?.id || '',
        name: t.assignee_name || t.assignee?.name || t.assignee?.full_name || 'Belum ditugaskan',
        email: t.assignee?.email || '',
        role: t.assignee?.role || 'STAFF',
        divisi: t.assignee?.divisi || t.assignee?.department || '',
      },
      deadline: t.deadline || '',
      progress: t.progress || 0,
      createdAt: t.created_at || t.createdAt,
      updatedAt: t.updated_at || t.updatedAt,
    }
  }

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      const res: any = await useStaffApi('/staff/tasks')
      if (res.success) {
        const list = (res.data || []).map(mapTask)
        if (list.length) {
          is403.value = false
          tasks.value = list
          saveLocal(tasks.value)
        }
      }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        is403.value = true
        tasks.value = loadLocal()
      } else {
        error.value = err.message || 'Gagal memuat task'
        // Fallback to local storage if API fails
        tasks.value = loadLocal()
      }
    } finally {
      loading.value = false
    }
  }

  async function createTask(task: Partial<Task>) {
    loading.value = true
    error.value = null
    try {
      const res: any = await useStaffApi('/staff/tasks', {
        method: 'POST',
        body: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          deadline: task.deadline,
          assignee_id: task.assignee?.id || null,
        },
      })
      if (res.success) {
        const mapped = mapTask(res.data)
        tasks.value.unshift(mapped)
        saveLocal(tasks.value)
        return { success: true }
      }
      return { success: false, message: res.message || 'Gagal membuat task' }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        // Create locally
        const newTask: Task = {
          id: genLocalId(),
          title: task.title || '',
          description: task.description || '',
          status: 'PENDING',
          priority: task.priority || 'SEDANG',
          assignee: task.assignee || { id: '', name: 'Belum ditugaskan', email: '', role: 'STAFF', divisi: '' },
          deadline: task.deadline || '',
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        tasks.value.unshift(newTask)
        saveLocal(tasks.value)
        return { success: true, local: true }
      }
      error.value = err.message || 'Gagal membuat task'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, data: Partial<Task>) {
    loading.value = true
    error.value = null
    try {
      const res: any = await useStaffApi(`/staff/tasks/${id}`, {
        method: 'PUT',
        body: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          deadline: data.deadline,
          status: data.status,
          progress: data.progress,
          assignee_id: data.assignee?.id || null,
        },
      })
      if (res.success) {
        const idx = tasks.value.findIndex(t => t.id === id)
        if (idx !== -1) {
          tasks.value[idx] = mapTask(res.data)
        }
        saveLocal(tasks.value)
        return { success: true }
      }
      return { success: false, message: res.message || 'Gagal update task' }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        // Update locally
        const idx = tasks.value.findIndex(t => t.id === id)
        if (idx !== -1) {
          tasks.value[idx] = { ...tasks.value[idx], ...data, updatedAt: new Date().toISOString() }
          saveLocal(tasks.value)
        }
        return { success: true, local: true }
      }
      error.value = err.message || 'Gagal update task'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const res: any = await useStaffApi(`/staff/tasks/${id}`, {
        method: 'PUT',
        body: { status },
      })
      if (res.success) {
        const task = tasks.value.find(t => t.id === id)
        if (task) task.status = status
        saveLocal(tasks.value)
        return { success: true }
      }
      return { success: false, message: res.message || 'Gagal update status' }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
          task.status = status
          saveLocal(tasks.value)
        }
        return { success: true, local: true }
      }
      return { success: false, message: err.message || 'Gagal update status' }
    }
  }

  async function updateTaskProgress(id: string, progress: number) {
    try {
      const res: any = await useStaffApi(`/staff/tasks/${id}`, {
        method: 'PUT',
        body: { progress },
      })
      if (res.success) {
        const task = tasks.value.find(t => t.id === id)
        if (task) task.progress = progress
        saveLocal(tasks.value)
        return { success: true }
      }
      return { success: false, message: res.message || 'Gagal update progress' }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
          task.progress = progress
          saveLocal(tasks.value)
        }
        return { success: true, local: true }
      }
      return { success: false, message: err.message || 'Gagal update progress' }
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null
    try {
      const res: any = await useStaffApi(`/staff/tasks/${id}`, {
        method: 'DELETE',
      })
      if (res.success || res.status === 200) {
        tasks.value = tasks.value.filter(t => t.id !== id)
        saveLocal(tasks.value)
        return { success: true }
      }
      return { success: false, message: res.message || 'Gagal hapus task' }
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      if (status === 403) {
        tasks.value = tasks.value.filter(t => t.id !== id)
        saveLocal(tasks.value)
        return { success: true, local: true }
      }
      error.value = err.message || 'Gagal hapus task'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    tasks, loading, error, is403, tasksByStatus, taskStats,
    fetchTasks, createTask, updateTask, updateTaskStatus, updateTaskProgress, deleteTask
  }
})
