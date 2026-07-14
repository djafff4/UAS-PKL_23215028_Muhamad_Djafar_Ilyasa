<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-500/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Task Management</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola task internal perusahaan</p>
        </div>
        <button @click="openCreateModal" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Buat Task
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3 sm:mx-0 px-3 sm:px-0">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0"
        :class="activeTab === tab.key
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 border border-surface-200/50 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'">
        {{ tab.label }}
        <span class="ml-1.5 text-xs opacity-75">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Search & List -->
    <div class="card overflow-hidden">
      <div class="p-4 border-b border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
        <div class="relative max-w-xs">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input v-model="search" type="text" placeholder="Cari task..." class="input-field pl-9" />
        </div>
      </div>
      <div class="p-4 sm:p-5">
        <!-- Empty State -->
        <div v-if="!taskStore.loading && taskStore.tasks.length === 0" class="text-center py-12">
          <div class="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <CheckSquare :size="28" class="text-surface-400" />
          </div>
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-1">Belum ada task</h3>
          <p class="text-xs text-surface-500 mb-4">Mulai dengan membuat task baru untuk tim Anda.</p>
          <button @click="openCreateModal" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all">
            <Plus :size="16" />
            Buat Task Pertama
          </button>
        </div>
        <!-- No search results -->
        <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
          <Search :size="28" class="mx-auto text-surface-300 mb-2" />
          <p class="text-sm text-surface-500">Tidak ada task yang cocok dengan pencarian</p>
        </div>
        <!-- Task List -->
        <TaskList v-else :tasks="filteredTasks" @edit="openEditModal" @delete="confirmDelete" />
      </div>
    </div>

    <!-- Create/Edit Task Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 bg-surface-900/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="closeModal">
        <div class="card p-5 sm:p-6 w-full sm:max-w-lg bg-white dark:bg-surface-900 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-bold text-surface-900 dark:text-surface-100">{{ editingTask ? 'Edit Task' : 'Buat Task Baru' }}</h2>
            <button @click="closeModal" class="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-surface-400 transition-colors">
              <X :size="18" />
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Judul Task *</label>
              <input v-model="formData.title" class="input-field" required placeholder="Masukkan judul task..." />
            </div>
            
            <div>
              <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Deskripsi</label>
              <textarea v-model="formData.description" rows="3" class="input-field" placeholder="Deskripsi task..."></textarea>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Prioritas</label>
                <select v-model="formData.priority" class="input-field">
                  <option value="RENDAH">Rendah</option>
                  <option value="SEDANG">Sedang</option>
                  <option value="TINGGI">Tinggi</option>
                  <option value="KRITIS">Kritis</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Deadline</label>
                <input v-model="formData.deadline" type="date" class="input-field" />
              </div>
            </div>
            
            <!-- Assignee Selection -->
            <div>
              <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Ditugaskan Ke</label>
              <select v-model="formData.assigneeId" class="input-field">
                <option value="">Pilih staff (opsional)</option>
                <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
                  {{ staff.full_name || staff.email }}
                </option>
              </select>
            </div>
            
            <!-- Status (only in edit mode) -->
            <div v-if="editingTask">
              <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Status</label>
              <select v-model="formData.status" class="input-field">
                <option value="PENDING">Pending</option>
                <option value="PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <!-- Progress (only in edit mode) -->
            <div v-if="editingTask">
              <label class="block text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-1.5">Progress ({{ formData.progress }}%)</label>
              <input v-model.number="formData.progress" type="range" min="0" max="100" step="5" class="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeModal" class="btn-secondary">Batal</button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                <div v-if="submitting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                {{ submitting ? 'Menyimpan...' : editingTask ? 'Simpan Perubahan' : 'Buat Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-surface-900/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="showDeleteModal = false">
        <div class="card p-5 sm:p-6 w-full sm:max-w-sm bg-white dark:bg-surface-900 rounded-t-2xl sm:rounded-2xl shadow-2xl">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 :size="20" class="text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-base font-bold text-surface-900 dark:text-surface-100 mb-1">Hapus Task?</h3>
            <p class="text-sm text-surface-500 mb-5">
              Task "<span class="font-medium text-surface-700 dark:text-surface-300">{{ taskToDelete?.title }}</span>" akan dihapus permanen.
            </p>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="flex-1 btn-secondary">Batal</button>
              <button @click="handleDelete" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all" :disabled="deleting">
                {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Search, X, CheckSquare, Trash2 } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/tasks'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useToast } from '@/composables/useToast'
import TaskList from '@/components/TaskList.vue'
import type { Task, TaskStatus, UserRole } from '@/types'

const taskStore = useTaskStore()
const staffStore = useStaffManagementStore()
const toast = useToast()

const activeTab = ref('ALL')
const search = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingTask = ref<Task | null>(null)
const taskToDelete = ref<Task | null>(null)
const submitting = ref(false)
const deleting = ref(false)

const formData = reactive({
  title: '',
  description: '',
  priority: 'SEDANG' as Task['priority'],
  deadline: '',
  assigneeId: '',
  status: 'PENDING' as TaskStatus,
  progress: 0,
})

const staffList = computed(() => staffStore.staffList)

onMounted(() => {
  taskStore.fetchTasks()
  staffStore.fetchStaff()
})

const tabs = computed(() => [
  { key: 'ALL', label: 'Semua', count: taskStore.taskStats.total },
  { key: 'PENDING', label: 'Pending', count: taskStore.taskStats.pending },
  { key: 'PROGRESS', label: 'In Progress', count: taskStore.taskStats.progress },
  { key: 'REVIEW', label: 'Review', count: taskStore.taskStats.review },
  { key: 'DONE', label: 'Done', count: taskStore.taskStats.done },
])

const filteredTasks = computed(() => {
  let result = taskStore.tasks
  if (activeTab.value !== 'ALL') {
    result = result.filter(t => t.status === activeTab.value)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(s) ||
      t.assignee.name.toLowerCase().includes(s)
    )
  }
  return result
})

function openCreateModal() {
  editingTask.value = null
  formData.title = ''
  formData.description = ''
  formData.priority = 'SEDANG'
  formData.deadline = ''
  formData.assigneeId = ''
  formData.status = 'PENDING'
  formData.progress = 0
  showModal.value = true
}

function openEditModal(task: Task) {
  editingTask.value = task
  formData.title = task.title
  formData.description = task.description
  formData.priority = task.priority
  formData.deadline = task.deadline
  formData.assigneeId = task.assignee?.id || ''
  formData.status = task.status
  formData.progress = task.progress
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTask.value = null
}

function confirmDelete(task: Task) {
  taskToDelete.value = task
  showDeleteModal.value = true
}

async function handleSubmit() {
  if (!formData.title.trim()) {
    toast.error('Judul task wajib diisi')
    return
  }

  submitting.value = true
  try {
    const selectedStaff = staffList.value.find((s: any) => s.id === formData.assigneeId)
    
    const payload: Partial<Task> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      deadline: formData.deadline,
      assignee: selectedStaff ? {
        id: selectedStaff.id,
        name: selectedStaff.full_name || selectedStaff.email,
        email: selectedStaff.email || '',
        role: (selectedStaff.roles?.[0] || 'STAFF') as UserRole,
        divisi: selectedStaff.department || '',
      } : undefined,
    }

    let result
    if (editingTask.value) {
      payload.status = formData.status
      payload.progress = formData.progress
      result = await taskStore.updateTask(editingTask.value.id, payload)
    } else {
      result = await taskStore.createTask(payload)
    }

    if (result?.success) {
      toast.success(editingTask.value ? 'Task berhasil diperbarui' : 'Task berhasil dibuat')
      closeModal()
    } else {
      toast.error(result?.message || 'Gagal menyimpan task')
    }
  } catch (err: any) {
    toast.error(err.message || 'Terjadi kesalahan')
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!taskToDelete.value) return

  deleting.value = true
  try {
    const result = await taskStore.deleteTask(taskToDelete.value.id)
    if (result?.success) {
      toast.success('Task berhasil dihapus')
      showDeleteModal.value = false
      taskToDelete.value = null
    } else {
      toast.error(result?.message || 'Gagal menghapus task')
    }
  } catch (err: any) {
    toast.error(err.message || 'Terjadi kesalahan')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .card, .modal-leave-to .card { transform: translateY(20px) scale(0.97); }
</style>
