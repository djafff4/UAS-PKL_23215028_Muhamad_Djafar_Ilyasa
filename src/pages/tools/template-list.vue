<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-teal-800 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="relative z-10 flex items-center gap-3">
        <RouterLink to="/tools" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <ArrowLeft :size="18" class="text-white" />
        </RouterLink>
        <div class="flex-1">
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Template Surat</h1>
          <p class="text-sm text-white/60 mt-0.5">Kelola template surat karyawan (penunjukan, kontrak, keterangan kerja, dll)</p>
        </div>
        <RouterLink
          to="/tools/template-builder"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl transition-all backdrop-blur-sm"
        >
          <Plus :size="14" />
          Buat Baru
        </RouterLink>
      </div>
    </div>

          <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari template..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/40 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 backdrop-blur-sm transition-all"
          />
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="tab in categoryTabs"
          :key="tab.key"
          @click="activeCategory = tab.key"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          :class="activeCategory === tab.key
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
            : 'bg-white/80 dark:bg-surface-800/80 text-surface-500 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700/40 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'"
        >
          <component :is="tab.icon" :size="14" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Template Cards -->
      <div v-if="filteredTemplates.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="group bg-white/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/40 rounded-xl backdrop-blur-sm hover:shadow-lg hover:border-primary-300/50 dark:hover:border-primary-600/50 transition-all duration-200 overflow-hidden"
        >
          <!-- Card header -->
          <div
            class="h-2 shrink-0"
            :class="categoryColor[tpl.category] || 'bg-surface-300'"
          />

          <div class="p-4 flex flex-col gap-3">
            <!-- Title + badge -->
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 leading-snug line-clamp-2">
                {{ tpl.name }}
              </h3>
              <span
                class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                :class="statusBadge[tpl.status ?? 'draft']"
              >
                {{ statusLabel[tpl.status ?? 'draft'] || tpl.status }}
              </span>
            </div>

            <!-- Category -->
            <p class="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
              <component :is="categoryIcon[tpl.category]" :size="13" class="shrink-0" />
              {{ categoryLabel[tpl.category] || tpl.category }}
            </p>

            <!-- Description -->
            <p v-if="tpl.metadata?.description" class="text-xs text-surface-400 dark:text-surface-500 line-clamp-2 leading-relaxed">
              {{ tpl.metadata.description }}
            </p>

            <!-- Meta -->
            <div class="flex items-center justify-between text-[10px] text-surface-400 dark:text-surface-500 mt-auto pt-2 border-t border-surface-100/80 dark:border-surface-700/30">
              <span class="flex items-center gap-1">
                <Calendar :size="11" />
                {{ formatDate(tpl.metadata?.updated_at || tpl.metadata?.created_at) }}
              </span>
              <span>
                {{ tpl.elements?.length || 0 }} elemen · v{{ tpl.metadata?.version || 1 }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 pt-1">
              <RouterLink
                :to="`/tools/template-builder?id=${tpl.id}`"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Edit3 :size="13" />
                Edit
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <FileText :size="48" class="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
        <h3 class="text-base font-bold text-surface-700 dark:text-surface-300 mb-1">
          {{ searchQuery ? 'Tidak ada hasil' : 'Belum ada template' }}
        </h3>
        <p class="text-sm text-surface-500 mb-4">
          {{ searchQuery ? 'Coba kata kunci lain' : 'Buat template surat pertama Anda' }}
        </p>
        <RouterLink
          v-if="!searchQuery"
          to="/tools/template-builder"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-all"
        >
          <Plus :size="14" />
          Buat Template Baru
        </RouterLink>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowLeft, Plus, Search,
  Edit3, FileText, Calendar,
  UserCheck, FileSignature, XCircle, FileText as FileContract,
} from 'lucide-vue-next'
import { letterTemplates } from '@/data/letters_templates'
import type { LetterTemplate } from '@/types/template'

// ── State ──
const searchQuery = ref('')
const activeCategory = ref('all')

// ── Category helpers ──
const categoryTabs = [
  { key: 'all', label: 'Semua', icon: FileText },
  { key: 'appointment', label: 'Penunjukan', icon: UserCheck },
  { key: 'contract', label: 'Kontrak', icon: FileContract },
  { key: 'work_certificate', label: 'Keterangan Kerja', icon: FileSignature },
  { key: 'termination', label: 'Berhenti', icon: XCircle },
]

const categoryLabel: Record<string, string> = {
  appointment: 'Surat Penunjukan',
  work_certificate: 'Surat Keterangan Kerja',
  termination: 'Surat Berhenti / Paklaring',
  contract: 'Surat Perjanjian Kerja',
}

const categoryIcon: Record<string, any> = {
  appointment: UserCheck,
  work_certificate: FileSignature,
  termination: XCircle,
  contract: FileContract,
}

const categoryColor: Record<string, string> = {
  appointment: 'bg-blue-500',
  work_certificate: 'bg-emerald-500',
  termination: 'bg-rose-500',
  contract: 'bg-purple-500',
}

const statusLabel: Record<string, string> = {
  draft: 'Draf',
  active: 'Aktif',
  archived: 'Arsip',
}

const statusBadge: Record<string, string> = {
  draft: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  active: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  archived: 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400',
}

// ── Filter ──
const filteredTemplates = computed(() => {
  let result = [...letterTemplates] as LetterTemplate[]

  if (activeCategory.value !== 'all') {
    result = result.filter(t => t.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.metadata?.description?.toLowerCase() || '').includes(q) ||
      (categoryLabel[t.category] || '').toLowerCase().includes(q)
    )
  }

  // Sort: active first, then by updated_at desc
  return [...result].sort((a, b) => {
    const order = { active: 0, draft: 1, archived: 2 }
    const aOrd = order[a.status ?? 'draft'] ?? 99
    const bOrd = order[b.status ?? 'draft'] ?? 99
    if (aOrd !== bOrd) return aOrd - bOrd
    return (b.metadata?.updated_at || '').localeCompare(a.metadata?.updated_at || '')
  })
})

// ── Utils ──
function formatDate(iso: string | undefined): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

</script>
