<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">E-Library</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Perpustakaan digital internal AKMAN</p>
        </div>
        <button @click="router.push({ name: 'e-library-create' })" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          Tambah Dokumen
        </button>
      </div>
    </div>

    <div class="flex gap-2 flex-wrap">
      <button
        v-for="cat in [{ id: '', name: 'Semua' }, ...store.categories]"
        :key="cat.id"
        @click="activeCategory = cat.id"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
        :class="activeCategory === cat.id
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 border border-surface-200/50 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/50 backdrop-blur-sm'"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="card overflow-hidden">
      <div class="p-4 border-b border-surface-200/50 dark:border-surface-700/30 bg-surface-50/50 dark:bg-surface-800/30">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari buku berdasarkan judul, penulis, atau ISBN..."
            class="input-field pl-9"
          />
        </div>
      </div>
    </div>

    <div v-if="store.loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat buku...</p>
    </div>

    <div v-else-if="filteredBooks.length === 0" class="card p-8 text-center">
      <BookOpen :size="48" class="mx-auto text-surface-300 dark:text-surface-600 mb-3" />
      <p class="text-sm font-semibold text-surface-500 dark:text-surface-400">Tidak ada buku ditemukan</p>
      <p class="text-xs text-surface-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
        @click="router.push({ name: 'e-library-detail', params: { id: book.id } })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, BookOpen } from 'lucide-vue-next'
import { useElibraryStore } from '@/stores/e-library'
import BookCard from '@/components/e-library/BookCard.vue'

const router = useRouter()
const store = useElibraryStore()

const search = ref('')
const activeCategory = ref('')

const filteredBooks = computed(() => {
  let result = store.books
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter((b: any) =>
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s) ||
      b.isbn.toLowerCase().includes(s) ||
      b.ai_summary.toLowerCase().includes(s)
    )
  }
  return result
})

onMounted(async () => {
  await Promise.all([
    store.fetchBooks(),
    store.fetchCategories(),
  ])
})
</script>
