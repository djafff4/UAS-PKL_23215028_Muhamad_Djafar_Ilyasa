<template>
  <div class="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900">
    <Sidebar :collapsed="sidebarCollapsed" />
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <Navbar
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
      <main class="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-16 sm:pb-20 lg:pb-6">
        <RouterView />
      </main>
      <BottomNav ref="bottomNavRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useKpiStore } from '@/stores/kpi'
import { useDepartmentFilterStore } from '@/stores/departmentFilter'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import BottomNav from '@/components/BottomNav.vue'

const auth = useAuthStore()
const bottomNavRef = ref<InstanceType<typeof BottomNav> | null>(null)
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  const isLg = window.innerWidth >= 1024
  if (isLg) {
    sidebarCollapsed.value = !sidebarCollapsed.value
  } else {
    bottomNavRef.value?.openMore()
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) return
  const taskStore = useTaskStore()
  const kpiStore = useKpiStore()
  const deptFilter = useDepartmentFilterStore()
  deptFilter.initFilter()
  await Promise.all([
    taskStore.fetchTasks(),
    kpiStore.fetchKpis(),
  ])
})
</script>
