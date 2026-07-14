<template>
  <div class="card p-5 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
        <component :is="icon" :size="16" class="text-primary-500" />
        {{ title }}
        <span v-if="items.length > 0" class="text-[10px] font-medium text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full">{{ items.length }}</span>
      </h3>
      <button @click="$emit('add')" class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
        <Plus :size="14" />
        Tambah
      </button>
    </div>

    <div v-if="items.length === 0" class="text-center py-6">
      <p class="text-sm text-surface-400">Belum ada data {{ title.toLowerCase() }}</p>
      <p class="text-xs text-surface-300 mt-1">Klik "Tambah" untuk menambahkan</p>
    </div>

    <draggable
      v-if="items.length > 0"
      :list="items"
      item-key="id"
      handle=".drag-handle"
      ghost-class="opacity-40"
      animation="200"
      class="space-y-0"
    >
      <template #item="{ element: item, index: idx }">
        <div class="group relative">
          <div v-if="idx > 0" class="h-px bg-surface-100 dark:bg-surface-800 my-4"></div>

          <div class="flex items-start justify-between gap-2">
            <!-- Drag Handle -->
            <div class="drag-handle shrink-0 mt-1 p-1 rounded cursor-grab text-surface-300 hover:text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title="Geser untuk mengatur urutan">
              <GripVertical :size="16" />
            </div>

            <!-- Fields -->
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <slot name="fields" :item="item" :idx="idx" />
            </div>

            <!-- Delete -->
            <button @click="$emit('remove', item.id)" class="shrink-0 p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all" title="Hapus">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Plus, Trash2, GripVertical } from 'lucide-vue-next'
import draggable from 'vuedraggable'

defineProps<{
  title: string
  icon: Component
  items: any[]
}>()

defineEmits<{
  add: []
  remove: [id: string]
}>()
</script>
