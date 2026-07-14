<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Tools & Utilities</h1>
        <p class="text-sm text-white/60 mt-1 font-medium">Alat bantu untuk manajemen karyawan dan laporan</p>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari tools..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/40 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 backdrop-blur-sm transition-all"
      />
    </div>

    <!-- Category Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="activeCategory = cat.key"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
        :class="activeCategory === cat.key
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-500 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700/40 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'"
      >
        <component :is="cat.icon" :size="14" />
        {{ cat.label }}
      </button>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ToolCard
        v-for="tool in filteredTools"
        :key="tool.id"
        :title="tool.title"
        :description="tool.description"
        :icon="tool.icon"
        :to="tool.to"
        :color="tool.color"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredTools.length === 0" class="text-center py-12">
      <SearchX :size="40" class="mx-auto text-surface-300 dark:text-surface-600 mb-3" />
      <p class="text-sm text-surface-500">Tidak ada tools yang cocok dengan pencarian</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search, SearchX, Users, BarChart3, FileText, Merge, Calendar,
  ClipboardCheck, History, TrendingUp, PieChart, Download
} from 'lucide-vue-next'
import ToolCard from '@/components/tools/ToolCard.vue'

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { key: 'all', label: 'Semua', icon: Search },
  { key: 'karyawan', label: 'Karyawan', icon: Users },
  { key: 'laporan', label: 'Laporan', icon: FileText },
]

const tools: Array<{
  id: string
  title: string
  description: string
  icon: any
  to: string
  color: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'cyan'
  category: string
}> = [
  // Karyawan
  {
    id: 'staff-list',
    title: 'Daftar Karyawan',
    description: 'Lihat dan kelola data seluruh karyawan per divisi',
    icon: Users,
    to: '/workspace/staff',
    color: 'blue',
    category: 'karyawan',
  },
  {
    id: 'kpi',
    title: 'KPI Monitoring',
    description: 'Monitor target dan pencapaian KPI karyawan',
    icon: BarChart3,
    to: '/kpi',
    color: 'green',
    category: 'karyawan',
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Kelola tugas dan pekerjaan harian tim',
    icon: ClipboardCheck,
    to: '/tasks',
    color: 'purple',
    category: 'karyawan',
  },
  {
    id: 'cv',
    title: 'Curriculum Vitae',
    description: 'Buat, edit, dan download CV digital dengan berbagai template',
    icon: FileText,
    to: '/profile/cv',
    color: 'cyan',
    category: 'karyawan',
  },
  {
    id: 'attendance-recap',
    title: 'Rekap Absensi',
    description: 'Ringkasan kehadiran, cuti, dan sakit karyawan',
    icon: Calendar,
    to: '/tools/attendance-recap',
    color: 'amber',
    category: 'karyawan',
  },
  {
    id: 'work-history',
    title: 'Riwayat Aktivitas',
    description: 'Log aktivitas dan pencapaian karyawan',
    icon: History,
    to: '/tools/work-history',
    color: 'cyan',
    category: 'karyawan',
  },

  // Laporan
  {
    id: 'merge-pdf',
    title: 'Gabung PDF',
    description: 'Gabungkan beberapa file PDF menjadi satu dokumen',
    icon: Merge,
    to: '/tools/merge-pdf',
    color: 'rose',
    category: 'laporan',
  },
  {
    id: 'export-report',
    title: 'Export Laporan',
    description: 'Generate laporan PDF dari data tasks, KPI, atau meetings',
    icon: Download,
    to: '/tools/export-report',
    color: 'blue',
    category: 'laporan',
  },
  {
    id: 'performance-stats',
    title: 'Statistik Kinerja',
    description: 'Grafik dan analisis performa tim secara keseluruhan',
    icon: TrendingUp,
    to: '/tools/performance',
    color: 'green',
    category: 'laporan',
  },
  {
    id: 'weekly-summary',
    title: 'Rekap Mingguan',
    description: 'Ringkasan otomatis aktivitas dan pencapaian minggu ini',
    icon: PieChart,
    to: '/tools/weekly-summary',
    color: 'purple',
    category: 'laporan',
  },
]

const filteredTools = computed(() => {
  let result = tools

  if (activeCategory.value !== 'all') {
    result = result.filter(t => t.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  }

  return result
})
</script>
