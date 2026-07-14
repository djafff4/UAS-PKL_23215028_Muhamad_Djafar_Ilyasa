<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-400/10 blur-[60px]"></div>
      <div class="relative z-10">
        <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Standar Kompetensi</h1>
        <p class="text-sm text-white/60 mt-1 font-medium">Daftar program yang memiliki standar kompetensi</p>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Award :size="18" class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ programsWithStandard.length }}</p>
            <p class="text-xs text-surface-500 font-medium">Total Standar</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Flag :size="18" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ skkniCount }}</p>
            <p class="text-xs text-surface-500 font-medium">SKKNI</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Shield :size="18" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ skkiCount }}</p>
            <p class="text-xs text-surface-500 font-medium">SKKI</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Globe :size="18" class="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">{{ intlCount }}</p>
            <p class="text-xs text-surface-500 font-medium">Internasional</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input v-model="search" @input="debouncedSearch" type="text" placeholder="Cari program..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
      </div>
      <select v-model="typeFilter" @change="refresh"
        class="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all">
        <option value="">Semua Tipe</option>
        <option value="SKKNI">SKKNI</option>
        <option value="SKKI">SKKI</option>
        <option value="INTERNATIONAL">Internasional</option>
      </select>
      <button @click="refresh" class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
        <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in filteredPrograms" :key="p.id"
        class="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
              :class="typeColor(p.standard_type)">
              {{ p.title.slice(0, 3).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ p.title }}</h3>
              <p class="text-xs text-surface-400">{{ p.standard_issuer || '-' }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              :class="typeBadge(p.standard_type)">
              {{ p.standard_type }}
            </span>
            <span v-if="p.status" class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-medium"
              :class="p.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'">
              {{ p.status === 'published' ? 'Published' : p.status }}
            </span>
          </div>
        </div>

        <p v-if="p.short_description" class="text-xs text-surface-500 line-clamp-2 mb-4">{{ p.short_description }}</p>

        <div class="flex items-center gap-4 pt-3 border-t border-surface-100/50 dark:border-surface-700/20 text-xs text-surface-400">
          <span v-if="p.code" class="flex items-center gap-1">
            <BookOpen :size="12" />
            {{ p.code }}
          </span>
          <span v-if="p.level" class="flex items-center gap-1">
            <BarChart :size="12" />
            {{ p.level }}
          </span>
        </div>

        <div class="flex items-center gap-2 mt-3">
          <router-link :to="`/programs/${p.id}`"
            class="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors text-center">
            Detail Program
          </router-link>
        </div>
      </div>

      <div v-if="!filteredPrograms.length && !loading"
        class="col-span-full rounded-2xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-surface-200/50 dark:border-surface-700/30 p-12 text-center">
        <Award :size="40" class="mx-auto text-surface-300 mb-3" />
        <p class="text-sm font-semibold text-surface-500">{{ search || typeFilter ? 'Tidak ada program yang cocok' : 'Belum ada program dengan standar kompetensi' }}</p>
      </div>

      <div v-if="loading" class="col-span-full text-center py-12">
        <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p class="text-sm text-surface-400">Memuat data...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshCw, Award, Flag, Shield, Globe, BookOpen, BarChart } from 'lucide-vue-next'
import { useProgramStore } from '@/stores/programs'

const programStore = useProgramStore()

const search = ref('')
const typeFilter = ref('')

const loading = computed(() => programStore.loading)

const programsWithStandard = computed(() =>
  programStore.programs.filter(p => p.standard_type)
)

const filteredPrograms = computed(() => {
  let list = programsWithStandard.value
  if (typeFilter.value) {
    list = list.filter(p => p.standard_type === typeFilter.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.standard_issuer?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q)
    )
  }
  return list
})

const skkniCount = computed(() =>
  programsWithStandard.value.filter(p => p.standard_type === 'SKKNI').length
)
const skkiCount = computed(() =>
  programsWithStandard.value.filter(p => p.standard_type === 'SKKI').length
)
const intlCount = computed(() =>
  programsWithStandard.value.filter(p => p.standard_type === 'INTERNATIONAL').length
)

onMounted(() => {
  programStore.fetchPrograms()
})

function typeColor(type: string) {
  const colors: Record<string, string> = {
    SKKNI: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    SKKI: 'bg-gradient-to-br from-amber-500 to-amber-600',
    INTERNATIONAL: 'bg-gradient-to-br from-purple-500 to-purple-600',
  }
  return colors[type] || 'bg-gradient-to-br from-surface-500 to-surface-600'
}

function typeBadge(type: string) {
  const badges: Record<string, string> = {
    SKKNI: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    SKKI: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    INTERNATIONAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return badges[type] || 'bg-surface-100 text-surface-600'
}

function refresh() {
  programStore.fetchPrograms()
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}
</script>


