<template>
  <div
    class="a4-page"
    :style="pageContainerStyle"
  >
    <!--
      Render elements sorted by z_index ascending so lower-index
      elements appear behind higher-index ones.
    -->
    <div
      v-for="el in sortedElements"
      :key="el.id"
      v-show="el.visible !== false"
      class="template-el"
      :style="getPositionStyle(el)"
    >
      <!-- ── TEXT ELEMENT ── -->
      <div
        v-if="el.type === 'text'"
        class="template-text"
        :style="getTextStyle(el)"
      >
        {{ getTextContent(el) }}
      </div>

      <!-- ── IMAGE ELEMENT ── -->
      <img
        v-else-if="el.type === 'image'"
        class="template-image"
        :src="getImageSrc(el)"
        :style="getImageStyle(el)"
        draggable="false"
      />

      <!-- ── TABLE ELEMENT ── -->
      <table
        v-else-if="el.type === 'table'"
        class="template-table"
        :style="getTableStyle(el)"
      >
        <thead v-if="el.headers && !Array.isArray(el.headers) && el.headers.cells && el.headers.cells.length > 0">
          <tr>
            <th
              v-for="(cell, ci) in el.headers.cells"
              :key="`h-${ci}`"
              :colspan="cell.col_span"
              :rowspan="cell.row_span"
              :style="getCellStyle(cell)"
            >
              {{ resolveCell(cell.content) }}
            </th>
          </tr>
        </thead>
        <tbody v-if="el.rows && el.rows.length > 0">
          <tr
            v-for="(row, ri) in el.rows"
            :key="`r-${ri}`"
            :style="getRowStyle(row)"
          >
            <td
              v-for="(cell, ci) in row.cells"
              :key="`c-${ri}-${ci}`"
              :colspan="cell.col_span"
              :rowspan="cell.row_span"
              :style="getCellStyle(cell)"
            >
              {{ resolveCell(cell.content) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ── LINE ELEMENT ── -->
      <div
        v-else-if="el.type === 'line'"
        class="template-line"
        :style="getLineStyle(el)"
      />

      <!-- ── RECTANGLE ELEMENT ── -->
      <div
        v-else-if="el.type === 'rectangle'"
        class="template-rect"
        :style="getRectangleStyle(el)"
      />

      <!-- ── SIGNATURE ELEMENT ── -->
      <div
        v-else-if="el.type === 'signature'"
        class="template-signature"
        :style="getSignatureStyle(el)"
      >
        <div class="sig-line" />
        <p class="sig-label">{{ el.label || 'Tanda Tangan' }}</p>
        <p v-if="el.name" class="sig-name">{{ el.name }}</p>
        <p v-if="el.title" class="sig-title">{{ el.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import type {
  LetterTemplate,
  TemplateElement,
  TextElement,
  ImageElement,
  TableElement,
  TableCell,
  TableRow,
  TextContentValue,
  LineElement,
  RectangleElement,
  SignatureElement,
  ElementStyle,
} from '@/types/template'
import { resolveTextContent } from '@/composables/useTemplateBinding'

// ── Props ──
const props = defineProps<{
  template: LetterTemplate
  bindings: Record<string, string>
}>()

// ── Constants ──
const MM_TO_PX = 3.7795275591

function mmPx(mm: number | string | undefined): number {
  const num = typeof mm === 'number' ? mm : parseFloat(String(mm)) || 0
  return Math.round(num * MM_TO_PX)
}

// ── Sorted elements (by z_index) ──
const sortedElements = computed<TemplateElement[]>(() => {
  return [...props.template.elements].sort(
    (a, b) => (a.z_index ?? 0) - (b.z_index ?? 0),
  )
})

// ── Page container style ──
const pageContainerStyle = computed<CSSProperties>(() => {
  const ps = props.template.page_settings
  return {
    position: 'relative',
    width: `${mmPx(ps.width)}px`,
    minHeight: `${mmPx(ps.height)}px`,
    backgroundColor: ps.background_color || '#FFFFFF',
    margin: '0 auto',
    overflow: 'hidden',
    fontFamily: "'Times New Roman', serif",
  }
})

// ── Element positioning ──
function getPositionStyle(el: TemplateElement): CSSProperties {
  return {
    position: 'absolute',
    left: `${mmPx(el.x)}px`,
    top: `${mmPx(el.y)}px`,
    zIndex: el.z_index ?? 0,
  }
}

// ── Get the ElementStyle object from a style that might be a string ──
function getStyleObj(s: ElementStyle | string | undefined): ElementStyle | undefined {
  if (!s) return undefined
  if (typeof s === 'string') return undefined
  return s
}

// ── Style converter: ElementStyle -> CSSProperties ──
function styleToCSS(s: ElementStyle | string | undefined): CSSProperties {
  if (!s) return {}
  if (typeof s === 'string') return {}
  const css: CSSProperties = {}

  if (s.font_family) css.fontFamily = s.font_family
  if (s.font_size) css.fontSize = `${s.font_size}pt`
  if (s.font_weight) css.fontWeight = s.font_weight
  if (s.font_style) css.fontStyle = s.font_style
  if (s.color) css.color = s.color
  if (s.background_color) css.backgroundColor = s.background_color
  if (s.text_align) css.textAlign = s.text_align as CSSProperties['textAlign']
  if (s.vertical_align) css.verticalAlign = s.vertical_align
  if (s.line_height) css.lineHeight = s.line_height
  if (s.text_decoration && s.text_decoration !== 'none') css.textDecoration = s.text_decoration
  if (s.text_transform && s.text_transform !== 'none') css.textTransform = s.text_transform
  if (s.letter_spacing) css.letterSpacing = `${s.letter_spacing}pt`
  if (s.opacity !== undefined) css.opacity = s.opacity
  if (s.border_radius) css.borderRadius = `${mmPx(s.border_radius)}px`

  // Padding (use individual properties, not the shorthand which is a number)
  if (s.padding_top) css.paddingTop = `${s.padding_top}px`
  if (s.padding_right) css.paddingRight = `${s.padding_right}px`
  if (s.padding_bottom) css.paddingBottom = `${s.padding_bottom}px`
  if (s.padding_left) css.paddingLeft = `${s.padding_left}px`
  if (s.padding && !s.padding_top && !s.padding_right && !s.padding_bottom && !s.padding_left) {
    css.padding = `${s.padding}px`
  }

  // Margin (use individual properties)
  if (s.margin_top) css.marginTop = `${s.margin_top}px`
  if (s.margin_right) css.marginRight = `${s.margin_right}px`
  if (s.margin_bottom) css.marginBottom = `${s.margin_bottom}px`
  if (s.margin_left) css.marginLeft = `${s.margin_left}px`
  if (s.margin && !s.margin_top && !s.margin_right && !s.margin_bottom && !s.margin_left) {
    css.margin = `${s.margin}px`
  }

  // Border (ElementStyle.border is a string)
  if (s.border && typeof s.border === 'string') {
    css.border = s.border
  } else if (s.border_width || s.border_color || s.border_style) {
    css.borderWidth = s.border_width ? `${s.border_width}px` : undefined
    css.borderColor = s.border_color
    css.borderStyle = s.border_style as CSSProperties['borderStyle']
  }

  // Shadow (ElementStyle.shadow is a string)
  if (s.shadow && typeof s.shadow === 'string') {
    css.boxShadow = s.shadow
  }

  return css
}

// ── TEXT element ──
function getTextContent(el: TextElement): string {
  return resolveTextContent(el.content, props.bindings)
}

function getTextStyle(el: TextElement): CSSProperties {
  const css: CSSProperties = {
    ...styleToCSS(el.style),
    width: el.max_width ? `${mmPx(el.max_width)}px` : 'auto',
    overflow: el.overflow || 'visible',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }
  return css
}

// ── IMAGE element ──
function getImageSrc(el: ImageElement): string {
  if (el.source.type === 'static') {
    return el.source.url || ''
  }
  // Dynamic: look up in bindings, fall back to fallback_url
  const boundUrl = el.source.binding_key ? props.bindings[el.source.binding_key] : undefined
  return boundUrl || el.source.fallback_url || ''
}

function getImageStyle(el: ImageElement): CSSProperties {
  const css: CSSProperties = {
    display: 'block',
    objectFit: el.fit || 'contain',
  }
  if (el.width) css.width = `${mmPx(el.width)}px`
  if (el.height) css.height = `${mmPx(el.height)}px`
  if (el.border_radius) css.borderRadius = `${mmPx(el.border_radius)}px`
  if (el.opacity !== undefined) css.opacity = el.opacity
  return css
}

// ── TABLE element ──
function getTableStyle(el: TableElement): CSSProperties {
  const css: CSSProperties = {
    borderCollapse: 'collapse',
    width: el.width ? `${mmPx(el.width)}px` : 'auto',
  }
  if (el.height) css.height = `${mmPx(el.height)}px`

  // Apply table borders
  if (el.border) {
    if (el.border.all) {
      const b = el.border.all
      css.border = `${b.width}px ${b.style} ${b.color}`
    } else {
      if (el.border.top && el.border.top.style !== 'none') css.borderTop = `${el.border.top.width}px ${el.border.top.style} ${el.border.top.color}`
      if (el.border.bottom && el.border.bottom.style !== 'none') css.borderBottom = `${el.border.bottom.width}px ${el.border.bottom.style} ${el.border.bottom.color}`
      if (el.border.left && el.border.left.style !== 'none') css.borderLeft = `${el.border.left.width}px ${el.border.left.style} ${el.border.left.color}`
      if (el.border.right && el.border.right.style !== 'none') css.borderRight = `${el.border.right.width}px ${el.border.right.style} ${el.border.right.color}`
    }
  } else {
    // Default thin borders for table readability
    css.border = '0.5px solid #DEE2E6'
  }

  // Table-level style
  const s = getStyleObj(el.style)
  if (s?.background_color) css.backgroundColor = s.background_color

  return css
}

function getCellStyle(cell: TableCell): CSSProperties {
  const defaultBorder = '0.5px solid #DEE2E6'
  const base: CSSProperties = {
    border: defaultBorder,
    padding: '4px 6px',
    fontSize: '10pt',
    verticalAlign: 'top',
    ...styleToCSS(cell.style),
  }
  return base
}

function getRowStyle(row: TableRow): CSSProperties {
  return {
    ...(row.height ? { height: `${mmPx(row.height)}px` } : {}),
    ...styleToCSS(row.style),
  }
}

function resolveCell(content: TextContentValue | string | undefined): string {
  return resolveTextContent(content, props.bindings)
}

// ── LINE element ──
function getLineStyle(el: LineElement): CSSProperties {
  const horiz = el.direction === 'horizontal'
  const thickness = el.thickness ?? 1
  const lineStyle = (typeof el.style === 'string' ? el.style : undefined) || 'solid'
  return {
    width: horiz ? `${mmPx(el.length)}px` : `${thickness}px`,
    height: horiz ? `${thickness}px` : `${mmPx(el.length)}px`,
    backgroundColor: el.color || '#000000',
    borderStyle: lineStyle !== 'none' ? lineStyle : 'solid',
    borderWidth: lineStyle !== 'none' ? '0' : '0',
    opacity: el.opacity ?? 1,
  }
}

// ── RECTANGLE element ──
function getRectangleStyle(el: RectangleElement): CSSProperties {
  const css: CSSProperties = {
    width: `${mmPx(el.width)}px`,
    height: `${mmPx(el.height)}px`,
    backgroundColor: el.fill_color || 'transparent',
    opacity: el.opacity ?? 1,
  }

  if (el.border_radius) {
    css.borderRadius = `${mmPx(el.border_radius)}px`
  }

  // Rectangle border
  if (el.border) {
    const b = el.border
    if (b.top && b.top.style !== 'none') {
      css.border = `${b.top.width}px ${b.top.style} ${b.top.color}`
    } else {
      css.border = '1px solid #DEE2E6'
    }
  } else {
    css.border = '1px solid #DEE2E6'
  }

  return css
}

// ── SIGNATURE element ──
function getSignatureStyle(el: SignatureElement): CSSProperties {
  return {
    width: `${mmPx(el.width ?? 50)}px`,
    height: `${mmPx(el.height ?? 30)}px`,
    border: '1px dashed #94A3B8',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '4px 8px',
    ...styleToCSS(el.style),
  }
}
</script>

<style scoped>
/* ── A4 page container ── */
.a4-page {
  box-sizing: border-box;
  font-size: 12pt;
  line-height: 1.4;
  color: #000000;
}

/* ── Text element ── */
.template-text {
  box-sizing: border-box;
}

/* ── Image element ── */
.template-image {
  box-sizing: border-box;
}

/* ── Table element ── */
.template-table {
  box-sizing: border-box;
}

.template-table th {
  font-weight: 600;
  background-color: #F8F9FA;
}

.template-table td {
  font-weight: 400;
}

/* ── Signature element ── */
.template-signature {
  box-sizing: border-box;
  text-align: center;
}

.template-signature .sig-line {
  width: 75%;
  border-bottom: 1px solid #64748B;
  margin-bottom: 4px;
}

.template-signature .sig-label {
  font-size: 9pt;
  color: #64748B;
  margin: 0;
  line-height: 1.3;
}

.template-signature .sig-name {
  font-size: 9pt;
  font-weight: 600;
  color: #1E293B;
  margin: 2px 0 0 0;
  line-height: 1.3;
}

.template-signature .sig-title {
  font-size: 8pt;
  color: #94A3B8;
  margin: 0;
  line-height: 1.3;
}

/* ── Print/Export tweaks ── */
@media print {
  .a4-page {
    box-shadow: none !important;
    margin: 0 !important;
    page-break-after: always;
  }
}
</style>
