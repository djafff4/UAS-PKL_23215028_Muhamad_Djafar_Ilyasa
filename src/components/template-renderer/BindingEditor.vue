<template>
  <div class="binding-editor">
    <div class="be-header">
      <h3 class="be-title">Pemetaan Binding</h3>
      <span class="be-badge">{{ bindings.length }} binding</span>
    </div>

    <p class="be-desc">
      Petakan key binding template ke field data yang sesuai dengan record surat.
      Hasil pemetaan akan digunakan untuk mengisi konten dinamis saat render.
    </p>

    <!-- ── Binding list ── -->
    <div class="be-list">
      <div
        v-for="(binding, idx) in bindings"
        :key="binding.key"
        class="be-item"
        :class="{ 'has-value': !!resolvedValues[binding.key] }"
      >
        <div class="be-item-header">
          <code class="be-key">{{ binding.key }}</code>
          <span class="be-type">{{ binding.value_type || 'text' }}</span>
        </div>

        <div class="be-item-body">
          <!-- Data source selection -->
          <div class="be-field-row">
            <label :for="`src-${idx}`">Sumber Data</label>
            <select
              :id="`src-${idx}`"
              :value="getSource(binding.key)"
              @change="setSource(binding.key, ($event.target as HTMLSelectElement).value)"
            >
              <option value="auto">Auto (cari otomatis)</option>
              <option value="data">Letter Data</option>
              <option value="context">Context</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <!-- Source field (auto-filled or manual) -->
          <div class="be-field-row">
            <label :for="`field-${idx}`">
              {{ getSource(binding.key) === 'manual' ? 'Nilai Manual' : 'Field Data' }}
            </label>
            <input
              v-if="getSource(binding.key) === 'manual'"
              :id="`field-${idx}`"
              type="text"
              :value="getManualValue(binding.key)"
              @input="setManualValue(binding.key, ($event.target as HTMLInputElement).value)"
              placeholder="Teks statis..."
            />
            <select
              v-else
              :id="`field-${idx}`"
              :value="getMapping(binding.key)"
              @change="setMapping(binding.key, ($event.target as HTMLSelectElement).value)"
            >
              <option value="">-- Pilih field --</option>
              <optgroup v-if="dataFields.length" label="Letter Data">
                <option
                  v-for="f in dataFields"
                  :key="f"
                  :value="f"
                >
                  {{ f }}
                </option>
              </optgroup>
              <optgroup v-if="contextFields.length" label="Context">
                <option
                  v-for="f in contextFields"
                  :key="f"
                  :value="f"
                >
                  {{ f }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Date format (for date types) -->
          <div
            v-if="binding.value_type === 'date'"
            class="be-field-row"
          >
            <label :for="`dfmt-${idx}`">Format Tanggal</label>
            <input
              :id="`dfmt-${idx}`"
              type="text"
              :value="binding.date_format || 'DD MMMM YYYY'"
              @input="setDateFormat(binding.key, ($event.target as HTMLInputElement).value)"
              placeholder="DD MMMM YYYY"
            />
          </div>

          <!-- Default value -->
          <div class="be-field-row">
            <label :for="`def-${idx}`">Nilai Default</label>
            <input
              :id="`def-${idx}`"
              type="text"
              :value="binding.default_value ?? ''"
              @input="setDefaultValue(binding.key, ($event.target as HTMLInputElement).value)"
              placeholder="(kosong jika tidak ada data)"
            />
          </div>

          <!-- Resolved preview -->
          <div
            v-if="resolvedValues[binding.key]"
            class="be-preview"
          >
            <span class="be-preview-label">Pratinjau:</span>
            <span class="be-preview-value">{{ resolvedValues[binding.key] }}</span>
          </div>
        </div>
      </div>

      <p
        v-if="bindings.length === 0"
        class="be-empty"
      >
        Template ini tidak memiliki binding yang terdefinisi.
      </p>
    </div>

    <!-- ── Action bar ── -->
    <div class="be-actions">
      <button
        class="btn btn-secondary"
        @click="autoMapAll"
      >
        Petakan Otomatis
      </button>
      <button
        class="btn btn-secondary"
        :disabled="bindings.length === 0"
        @click="clearAll"
      >
        Reset Semua
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { LetterTemplate, TemplateBinding } from '@/types/template'
import { resolveBindings } from '@/composables/useTemplateBinding'

const props = defineProps<{
  template: LetterTemplate
  letterData?: Record<string, unknown>
  context?: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:template': [template: LetterTemplate]
}>()

// ── Derived fields ──
const bindings = computed<TemplateBinding[]>(() => {
  return props.template.bindings ?? []
})

const dataFields = computed<string[]>(() => {
  return Object.keys(props.letterData ?? {})
})

const contextFields = computed<string[]>(() => {
  return Object.keys(props.context ?? {})
})

// ── Mapping state (key → source field path) ──
interface MappingEntry {
  source: 'data' | 'context' | 'manual' | 'auto'
  field: string   // actual field name in letterData/context
  manualValue: string
}

const mappings = reactive<Record<string, MappingEntry>>({})

// ── Resolved values preview ──
const resolvedValues = computed(() => {
  // Build a bound letterData using the mappings
  const mappedData: Record<string, unknown> = {}
  for (const b of bindings.value) {
    const m = mappings[b.key]
    if (!m) continue

    if (m.source === 'manual') {
      mappedData[b.key] = m.manualValue
    } else if (m.source === 'data' && m.field) {
      mappedData[b.key] = props.letterData?.[m.field]
    } else if (m.source === 'context' && m.field) {
      mappedData[b.key] = props.context?.[m.field]
    } else {
      // Auto: try data first, then context
      mappedData[b.key] = props.letterData?.[b.key] ?? props.context?.[b.key]
    }
  }

  return resolveBindings(props.template, mappedData)
})

// ── Getters ──
function getSource(key: string): string {
  return mappings[key]?.source ?? 'auto'
}

function getMapping(key: string): string {
  return mappings[key]?.field ?? ''
}

function getManualValue(key: string): string {
  return mappings[key]?.manualValue ?? ''
}

// ── Setters ──
function setSource(key: string, source: string): void {
  const s = source as 'auto' | 'manual' | 'data' | 'context'
  if (!mappings[key]) {
    mappings[key] = { source: s, field: '', manualValue: '' }
  } else {
    mappings[key].source = s
    if (source !== 'manual') mappings[key].manualValue = ''
  }
}

function setMapping(key: string, field: string): void {
  if (!mappings[key]) {
    mappings[key] = { source: 'auto', field, manualValue: '' }
  } else {
    mappings[key].field = field
  }
}

function setManualValue(key: string, value: string): void {
  if (!mappings[key]) {
    mappings[key] = { source: 'manual', field: '', manualValue: value }
  } else {
    mappings[key].manualValue = value
  }
}

function setDateFormat(key: string, format: string): void {
  updateBinding(key, 'date_format', format)
}

function setDefaultValue(key: string, value: string): void {
  updateBinding(key, 'default_value', value)
}

// ── Update binding on template ──
function updateBinding(key: string, field: string, value: string): void {
  const idx = props.template.bindings.findIndex(b => b.key === key)
  if (idx === -1) return

  const clone = { ...props.template }
  const updated = [...(clone.bindings ?? [])]
  updated[idx] = { ...updated[idx], [field]: value || undefined } as TemplateBinding
  clone.bindings = updated
  emit('update:template', clone)
}

// ── Auto-map: best-effort matching by key name ──
function autoMapAll(): void {
  for (const b of bindings.value) {
    const lowerKey = b.key.toLowerCase()

    // Search in data first, then context
    if (props.letterData) {
      const dataMatch = Object.keys(props.letterData).find(
        k => k.toLowerCase() === lowerKey,
      )
      if (dataMatch) {
        mappings[b.key] = { source: 'data', field: dataMatch, manualValue: '' }
        continue
      }
    }

    if (props.context) {
      const ctxMatch = Object.keys(props.context).find(
        k => k.toLowerCase() === lowerKey,
      )
      if (ctxMatch) {
        mappings[b.key] = { source: 'context', field: ctxMatch, manualValue: '' }
        continue
      }
    }

    // Fallback: auto
    mappings[b.key] = { source: 'auto', field: '', manualValue: '' }
  }
}

function clearAll(): void {
  for (const key of Object.keys(mappings)) {
    delete mappings[key]
  }
}

// ── Init: auto-map on first load ──
watch(
  () => props.template.bindings,
  () => {
    if (bindings.value.length > 0 && Object.keys(mappings).length === 0) {
      autoMapAll()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.binding-editor {
  padding: 20px;
  max-height: 100%;
  overflow-y: auto;
}

.be-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.be-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}

.be-badge {
  font-size: 11px;
  font-weight: 600;
  color: #3B82F6;
  background: #EFF6FF;
  padding: 2px 8px;
  border-radius: 10px;
}

.be-desc {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.be-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.be-item {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.be-item:hover {
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.be-item.has-value {
  border-left: 3px solid #22C55E;
}

.be-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
}

.be-key {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.be-type {
  font-size: 10px;
  font-weight: 500;
  color: #64748B;
  text-transform: uppercase;
  background: #F1F5F9;
  padding: 1px 6px;
  border-radius: 3px;
}

.be-item-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.be-field-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.be-field-row label {
  font-size: 11px;
  font-weight: 500;
  color: #64748B;
}

.be-field-row select,
.be-field-row input[type="text"] {
  padding: 4px 6px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  background: white;
}

.be-field-row select:focus,
.be-field-row input[type="text"]:focus {
  border-color: #3B82F6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}

.be-preview {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 8px;
  background: #F0FDF4;
  border-radius: 4px;
  font-size: 12px;
}

.be-preview-label {
  color: #22C55E;
  font-weight: 600;
  flex-shrink: 0;
}

.be-preview-value {
  color: #166534;
  word-break: break-all;
}

.be-empty {
  font-size: 13px;
  color: #94A3B8;
  font-style: italic;
  text-align: center;
  padding: 24px 0;
}

.be-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.btn-secondary {
  background: white;
  color: #475569;
  border-color: #D1D5DB;
}

.btn-secondary:hover:not(:disabled) {
  background: #F1F5F9;
  border-color: #94A3B8;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
