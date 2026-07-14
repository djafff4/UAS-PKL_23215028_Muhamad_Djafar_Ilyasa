<template>
  <aside class="property-panel">
    <h3 class="panel-title">Properti Elemen</h3>

    <!-- No selection -->
    <div v-if="!element" class="empty-state">
      <p>Pilih elemen untuk mengedit properti.</p>
    </div>

    <template v-else>
      <!-- ── Common: Position & Size ── -->
      <section class="prop-section">
        <h4 class="section-title">Posisi &amp; Ukuran</h4>
        <div class="prop-grid">
          <label>
            <span>X (mm)</span>
            <input
              type="number"
              :value="element.x"
              min="0"
              step="0.5"
              @input="update('x', parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
          </label>
          <label>
            <span>Y (mm)</span>
            <input
              type="number"
              :value="element.y"
              min="0"
              step="0.5"
              @input="update('y', parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
          </label>
          <label v-if="'width' in element">
            <span>Lebar (mm)</span>
            <input
              type="number"
              :value="(element as any).width"
              min="1"
              step="0.5"
              @input="update('width', parseFloat(($event.target as HTMLInputElement).value) || 10)"
            />
          </label>
          <label v-if="'height' in element">
            <span>Tinggi (mm)</span>
            <input
              type="number"
              :value="(element as any).height"
              min="1"
              step="0.5"
              @input="update('height', parseFloat(($event.target as HTMLInputElement).value) || 10)"
            />
          </label>
          <label v-if="'max_width' in element">
            <span>Max Lebar (mm)</span>
            <input
              type="number"
              :value="(element as any).max_width"
              min="0"
              step="0.5"
              @input="update('max_width', parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
          </label>
        </div>
      </section>

      <!-- ── Z-Index ── -->
      <section class="prop-section">
        <h4 class="section-title">Lapisan</h4>
        <div class="prop-grid">
          <label>
            <span>Z-Index</span>
            <input
              type="number"
              :value="element.z_index ?? 0"
              min="-100"
              max="100"
              @input="update('z_index', parseInt(($event.target as HTMLInputElement).value) || 0)"
            />
          </label>
          <label>
            <span>Terlihat</span>
            <input
              type="checkbox"
              :checked="element.visible !== false"
              @change="update('visible', ($event.target as HTMLInputElement).checked)"
              style="width:auto;margin-top:4px"
            />
          </label>
        </div>
      </section>

      <!-- ── Text-specific ── -->
      <template v-if="element.type === 'text'">
        <section class="prop-section">
          <h4 class="section-title">Konten Teks</h4>

          <!-- Binding mode toggle -->
          <div class="radio-group">
            <label>
              <input
                type="radio"
                :checked="(element as any).content?.type === 'static'"
                @change="setContentType('static')"
              />
              Statis
            </label>
            <label>
              <input
                type="radio"
                :checked="(element as any).content?.type === 'dynamic'"
                @change="setContentType('dynamic')"
              />
              Dinamis (binding)
            </label>
          </div>

          <label v-if="(element as any).content?.type === 'static'">
            <span>Teks</span>
            <textarea
              :value="(element as any).content?.value ?? ''"
              rows="4"
              @input="updateContent('value', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Tulis teks atau {{ binding_key }}"
            />
          </label>

          <template v-else>
            <label>
              <span>Binding Key</span>
              <input
                type="text"
                :value="(element as any).content?.binding_key ?? ''"
                @input="updateContent('binding_key', ($event.target as HTMLInputElement).value)"
                placeholder="nama_karyawan"
              />
            </label>
            <label>
              <span>Nilai Default</span>
              <input
                type="text"
                :value="(element as any).content?.default_value ?? ''"
                @input="updateContent('default_value', ($event.target as HTMLInputElement).value)"
                placeholder="-"
              />
            </label>
          </template>
        </section>

        <!-- Text style -->
        <section class="prop-section">
          <h4 class="section-title">Gaya Teks</h4>
          <div class="prop-grid">
            <label>
              <span>Font</span>
              <select :value="styleVal('font_family')" @change="updateStyle('font_family', ($event.target as HTMLSelectElement).value)">
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Arial', sans-serif">Arial</option>
                <option value="'Calibri', sans-serif">Calibri</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Tahoma', sans-serif">Tahoma</option>
              </select>
            </label>
            <label>
              <span>Ukuran (pt)</span>
              <input type="number" :value="styleVal('font_size')" min="6" max="72" step="0.5"
                @input="updateStyle('font_size', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
            <label>
              <span>Warna</span>
              <input type="color" :value="styleVal('color') || '#000000'"
                @input="updateStyle('color', ($event.target as HTMLInputElement).value)" />
            </label>
            <label>
              <span>Background</span>
              <input type="color" :value="styleVal('background_color') || '#FFFFFF'"
                @input="updateStyle('background_color', ($event.target as HTMLInputElement).value)" />
            </label>
            <label>
              <span>Tebal</span>
              <select :value="styleVal('font_weight') || 'normal'" @change="updateStyle('font_weight', ($event.target as HTMLSelectElement).value)">
                <option value="normal">Normal</option>
                <option value="bold">Tebal</option>
              </select>
            </label>
            <label>
              <span>Miring</span>
              <select :value="styleVal('font_style') || 'normal'" @change="updateStyle('font_style', ($event.target as HTMLSelectElement).value)">
                <option value="normal">Normal</option>
                <option value="italic">Miring</option>
              </select>
            </label>
            <label>
              <span>Rata</span>
              <select :value="styleVal('text_align') || 'left'" @change="updateStyle('text_align', ($event.target as HTMLSelectElement).value)">
                <option value="left">Kiri</option>
                <option value="center">Tengah</option>
                <option value="right">Kanan</option>
                <option value="justify">Rata Kanan-Kiri</option>
              </select>
            </label>
            <label>
              <span>Line Height</span>
              <input type="number" :value="styleVal('line_height') || 1.4" min="0.5" max="5" step="0.1"
                @input="updateStyle('line_height', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
          </div>
        </section>
      </template>

      <!-- ── Table-specific ── -->
      <template v-if="element.type === 'table'">
        <section class="prop-section">
          <h4 class="section-title">Tabel</h4>
          <div class="prop-grid">
            <label>
              <span>Binding Key (data)</span>
              <input
                type="text"
                :value="(element as any).binding_key ?? ''"
                @input="update('binding_key', ($event.target as HTMLInputElement).value)"
                placeholder="data_karyawan"
              />
            </label>
          </div>
          <p class="hint-text">
            Header dan baris tabel dikelola di Binding Editor.
          </p>
        </section>
      </template>

      <!-- ── Image-specific ── -->
      <template v-if="element.type === 'image'">
        <section class="prop-section">
          <h4 class="section-title">Gambar</h4>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                :checked="(element as any).source?.type === 'static'"
                @change="setImageSourceType('static')"
              />
              URL Statis
            </label>
            <label>
              <input
                type="radio"
                :checked="(element as any).source?.type === 'dynamic'"
                @change="setImageSourceType('dynamic')"
              />
              Binding
            </label>
          </div>

          <label v-if="(element as any).source?.type === 'static'">
            <span>URL Gambar</span>
            <input
              type="text"
              :value="(element as any).source?.url ?? ''"
              @input="updateImageSource('url', ($event.target as HTMLInputElement).value)"
              placeholder="https://...png"
            />
          </label>
          <template v-else>
            <label>
              <span>Binding Key</span>
              <input
                type="text"
                :value="(element as any).source?.binding_key ?? ''"
                @input="updateImageSource('binding_key', ($event.target as HTMLInputElement).value)"
                placeholder="ttd_url"
              />
            </label>
            <label>
              <span>Fallback URL</span>
              <input
                type="text"
                :value="(element as any).source?.fallback_url ?? ''"
                @input="updateImageSource('fallback_url', ($event.target as HTMLInputElement).value)"
              />
            </label>
          </template>

          <label>
            <span>Obj Fit</span>
            <select :value="(element as any).fit || 'contain'" @change="update('fit', ($event.target as HTMLSelectElement).value)">
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="fill">Fill</option>
            </select>
          </label>
        </section>
      </template>

      <!-- ── Line-specific ── -->
      <template v-if="element.type === 'line'">
        <section class="prop-section">
          <h4 class="section-title">Garis</h4>
          <div class="prop-grid">
            <label>
              <span>Arah</span>
              <select :value="(element as any).direction || 'horizontal'" @change="update('direction', ($event.target as HTMLSelectElement).value)">
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertikal</option>
              </select>
            </label>
            <label>
              <span>Panjang (mm)</span>
              <input type="number" :value="(element as any).length" min="5" max="500" step="1"
                @input="update('length', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
            <label>
              <span>Tebal (px)</span>
              <input type="number" :value="(element as any).thickness ?? 1" min="1" max="20" step="1"
                @input="update('thickness', parseInt(($event.target as HTMLInputElement).value))" />
            </label>
            <label>
              <span>Warna</span>
              <input type="color" :value="(element as any).color || '#000000'"
                @input="update('color', ($event.target as HTMLInputElement).value)" />
            </label>
            <label>
              <span>Opacity</span>
              <input type="number" :value="(element as any).opacity ?? 1" min="0" max="1" step="0.1"
                @input="update('opacity', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
          </div>
        </section>
      </template>

      <!-- ── Rectangle-specific ── -->
      <template v-if="element.type === 'rectangle'">
        <section class="prop-section">
          <h4 class="section-title">Kotak</h4>
          <div class="prop-grid">
            <label>
              <span>Fill Color</span>
              <input type="color" :value="(element as any).fill_color || '#E2E8F0'"
                @input="update('fill_color', ($event.target as HTMLInputElement).value)" />
            </label>
            <label>
              <span>Border Radius (mm)</span>
              <input type="number" :value="(element as any).border_radius ?? 0" min="0" max="20" step="0.5"
                @input="update('border_radius', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
            <label>
              <span>Opacity</span>
              <input type="number" :value="(element as any).opacity ?? 1" min="0" max="1" step="0.1"
                @input="update('opacity', parseFloat(($event.target as HTMLInputElement).value))" />
            </label>
          </div>
        </section>
      </template>

      <!-- ── Signature-specific ── -->
      <template v-if="element.type === 'signature'">
        <section class="prop-section">
          <h4 class="section-title">Tanda Tangan</h4>
          <div class="prop-grid">
            <label>
              <span>Label</span>
              <input type="text" :value="(element as any).label ?? ''"
                @input="update('label', ($event.target as HTMLInputElement).value)" placeholder="Tanda Tangan" />
            </label>
            <label>
              <span>Nama</span>
              <input type="text" :value="(element as any).name ?? ''"
                @input="update('name', ($event.target as HTMLInputElement).value)" placeholder="Nama Lengkap" />
            </label>
            <label>
              <span>Jabatan</span>
              <input type="text" :value="(element as any).title ?? ''"
                @input="update('title', ($event.target as HTMLInputElement).value)" placeholder="Jabatan" />
            </label>
          </div>
        </section>
      </template>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LetterTemplate, TemplateElement } from '@/types/template'

const props = defineProps<{
  template: LetterTemplate
  selectedId: string | null
}>()

const emit = defineEmits<{
  'update:template': [template: LetterTemplate]
}>()

// ── Current selected element ──
const element = computed<TemplateElement | null>(() => {
  if (!props.selectedId) return null
  return props.template.elements.find(e => e.id === props.selectedId) ?? null
})

// ── Generic update: field on element ──
function update(field: string, value: unknown): void {
  if (!element.value || !props.selectedId) return
  const idx = props.template.elements.findIndex(e => e.id === props.selectedId)
  if (idx === -1) return
  const clone = { ...props.template }
  const updated = [...clone.elements]
  updated[idx] = { ...updated[idx], [field]: value } as TemplateElement
  clone.elements = updated
  emit('update:template', clone)
}

// ── Style helpers ──
function styleVal(key: string): unknown {
  return (element.value as any)?.style?.[key]
}

function updateStyle(key: string, value: unknown): void {
  if (!element.value || !props.selectedId) return
  const idx = props.template.elements.findIndex(e => e.id === props.selectedId)
  if (idx === -1) return
  const clone = { ...props.template }
  const updated = [...clone.elements]
  const el = { ...updated[idx] } as any
  el.style = { ...(el.style || {}), [key]: value }
  updated[idx] = el
  clone.elements = updated
  emit('update:template', clone)
}

// ── Text content helpers ──
function setContentType(type: 'static' | 'dynamic'): void {
  const el = element.value as any
  if (el?.type !== 'text') return

  if (type === 'static') {
    update('content', { type: 'static', value: el.content?.value ?? '' })
  } else {
    update('content', { type: 'dynamic', binding_key: el.content?.binding_key ?? '', default_value: el.content?.default_value ?? '' })
  }
}

function updateContent(field: string, value: string): void {
  if (!element.value) return
  const el = element.value as any
  if (el.type !== 'text') return

  const updatedContent = { ...(el.content || {}), [field]: value }
  update('content', updatedContent)
}

// ── Image source helpers ──
function setImageSourceType(type: 'static' | 'dynamic'): void {
  const el = element.value as any
  if (el?.type !== 'image') return

  if (type === 'static') {
    update('source', { type: 'static', url: el.source?.url ?? '' })
  } else {
    update('source', { type: 'dynamic', binding_key: el.source?.binding_key ?? '', fallback_url: el.source?.fallback_url ?? '' })
  }
}

function updateImageSource(field: string, value: string): void {
  if (!element.value) return
  const el = element.value as any
  if (el.type !== 'image') return

  const updatedSource = { ...(el.source || {}), [field]: value }
  update('source', updatedSource)
}
</script>

<style scoped>
.property-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #E2E8F0;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 8px 0;
}

.empty-state {
  color: #94A3B8;
  font-size: 13px;
  text-align: center;
  padding: 24px 0;
}

.empty-state p {
  margin: 0;
}

.prop-section {
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.prop-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prop-grid label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prop-grid label span {
  font-size: 11px;
  font-weight: 500;
  color: #64748B;
}

.prop-grid input[type="number"],
.prop-grid input[type="text"],
.prop-grid select,
.prop-grid textarea {
  padding: 4px 6px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  background: white;
}

.prop-grid input[type="number"]:focus,
.prop-grid input[type="text"]:focus,
.prop-grid select:focus,
.prop-grid textarea:focus {
  border-color: #3B82F6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
}

.prop-grid input[type="color"] {
  width: 100%;
  height: 28px;
  padding: 2px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  cursor: pointer;
}

.prop-grid textarea {
  resize: vertical;
  min-height: 60px;
  font-size: 12px;
  line-height: 1.4;
}

.radio-group {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
}

.hint-text {
  font-size: 11px;
  color: #94A3B8;
  font-style: italic;
  margin: 4px 0 0;
}
</style>
