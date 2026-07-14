<template>
  <div class="card group hover:shadow-lg transition-all duration-200 cursor-pointer" @click="$emit('click', book)">
    <div class="relative overflow-hidden rounded-t-xl">
      <div class="aspect-[3/4] bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 flex items-center justify-center">
        <img
          v-if="book.cover_image_url"
          :src="book.cover_image_url"
          :alt="book.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <BookOpen v-else :size="48" class="text-surface-300 dark:text-surface-600" />
      </div>
      <div class="absolute top-2 right-2">
        <span class="px-2 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
          {{ bookTypeLabel }}
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 line-clamp-2 mb-1">
        {{ book.title }}
      </h3>
      <p class="text-xs text-surface-500 dark:text-surface-400 mb-2">
        {{ book.author }}
      </p>
      <div class="flex items-center justify-between">
        <span class="text-xs text-surface-400">
          {{ book.published_year || '-' }}
        </span>
        <span v-if="book.category" class="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
          {{ book.category.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen } from 'lucide-vue-next'
import type { EBook } from '@/types'

const props = defineProps<{
  book: EBook
}>()

defineEmits<{
  click: [book: EBook]
}>()

const bookTypes: Record<string, string> = {
  book: 'Buku',
  module: 'Modul',
  sop: 'SOP',
  policy: 'Kebijakan',
  research: 'Penelitian',
  journal: 'Jurnal',
  template: 'Template',
  guide: 'Panduan',
}

const bookTypeLabel = computed(() => {
  return bookTypes[props.book.book_type || 'book'] || 'Buku'
})
</script>
