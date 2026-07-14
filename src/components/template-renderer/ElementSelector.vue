<template>
  <aside class="element-selector">
    <h3 class="panel-title">Elemen Template</h3>

    <div class="element-grid">
      <button
        v-for="item in elementTypes"
        :key="item.type"
        class="element-btn"
        :title="item.description"
        @click="$emit('add', item.type)"
      >
        <span class="element-icon" v-html="item.icon" />
        <span class="element-label">{{ item.label }}</span>
      </button>
    </div>

    <hr class="divider" />

    <!-- Layer ordering -->
    <h4 class="sub-title">Urutan Lapisan</h4>
    <div class="layer-list">
      <div
        v-for="(el, idx) in reversedElements"
        :key="el.id"
        class="layer-item"
        :class="{ 'is-selected': selectedIds.has(el.id) }"
        @click="$emit('select', el.id)"
      >
        <span class="layer-icon">{{ layerIcon(el.type) }}</span>
        <span class="layer-name">{{ el.type }} #{{ elements.length - idx }}</span>
        <span class="layer-z">z:{{ el.z_index ?? 0 }}</span>
      </div>
      <p
        v-if="elements.length === 0"
        class="empty-hint"
      >
        Belum ada elemen. Klik salah satu di atas untuk menambahkan.
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TemplateElement } from '@/types/template'

const props = defineProps<{
  elements: TemplateElement[]
  selectedIds: Set<string>
}>()

defineEmits<{
  add: [type: TemplateElement['type']]
  select: [id: string]
}>()

const reversedElements = computed(() => [...props.elements].reverse())

interface ElementTypeDef {
  type: TemplateElement['type']
  label: string
  description: string
  icon: string
}

const elementTypes: ElementTypeDef[] = [
  {
    type: 'text',
    label: 'Teks',
    description: 'Teks statis atau dinamis dengan binding {{key}}',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  },
  {
    type: 'table',
    label: 'Tabel',
    description: 'Tabel dengan header dan baris dinamis',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  },
  {
    type: 'image',
    label: 'Gambar',
    description: 'Logo, foto, atau gambar tandatangan',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  },
  {
    type: 'line',
    label: 'Garis',
    description: 'Garis horizontal atau vertikal untuk pemisah',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
  },
  {
    type: 'rectangle',
    label: 'Kotak',
    description: 'Kotak dengan warna isian untuk background/header',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" fill="#E2E8F0"/></svg>',
  },
  {
    type: 'signature',
    label: 'Tanda Tangan',
    description: 'Area tandatangan dengan garis dan label',
    icon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17c3.333-3.333 5-6 5-8 0-1.5-1-2-2-2S4 7 4 8.5 6 13 9 16c2 2 4 3 6 2s2-3 1-5c-1-1.5-2-2-3-2"/></svg>',
  },
]

function layerIcon(type: TemplateElement['type']): string {
  const map: Record<string, string> = {
    text: 'T',
    table: '▦',
    image: '🖼',
    line: '—',
    rectangle: '▭',
    signature: '🖊',
  }
  return map[type] ?? '?'
}
</script>

<style scoped>
.element-selector {
  width: 220px;
  background: white;
  border-right: 1px solid #E2E8F0;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

.element-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.element-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.element-btn:hover {
  border-color: #3B82F6;
  background: #EFF6FF;
  box-shadow: 0 1px 3px rgba(59,130,246,0.2);
}

.element-icon {
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
}

.element-btn:hover .element-icon {
  color: #3B82F6;
}

.element-label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  line-height: 1.2;
}

.element-btn:hover .element-label {
  color: #1E293B;
}

.divider {
  border: none;
  border-top: 1px solid #E2E8F0;
  margin: 4px 0;
}

.sub-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 4px 0;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.1s;
}

.layer-item:hover {
  background: #F1F5F9;
}

.layer-item.is-selected {
  background: #DBEAFE;
  color: #1E40AF;
}

.layer-icon {
  font-size: 13px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.layer-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #334155;
}

.layer-z {
  font-size: 10px;
  color: #94A3B8;
  font-family: monospace;
}

.empty-hint {
  font-size: 11px;
  color: #94A3B8;
  font-style: italic;
  text-align: center;
  margin: 12px 0 0;
}
</style>
