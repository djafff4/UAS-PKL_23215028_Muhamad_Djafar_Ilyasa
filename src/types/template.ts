/**
 * Template types for letter renderer system.
 */

// ── Page Settings ──
export interface PageMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface PageSettings {
  width: number
  height: number
  margins: PageMargins
  orientation?: 'portrait' | 'landscape'
  background_color?: string
}

// ── Element Styles ──
export interface ElementStyle {
  font_size?: number
  font_family?: string
  font_weight?: string | number
  font_style?: string
  text_align?: string
  vertical_align?: string
  color?: string
  background_color?: string
  border_width?: number
  border_color?: string
  border_style?: string
  border_radius?: number
  padding?: number
  padding_top?: number
  padding_bottom?: number
  padding_left?: number
  padding_right?: number
  margin?: number
  margin_top?: number
  margin_bottom?: number
  margin_left?: number
  margin_right?: number
  line_height?: number | string
  letter_spacing?: number
  text_decoration?: string
  text_transform?: string
  opacity?: number
  width?: number | string
  height?: number | string
  max_width?: number | string
  z_index?: number
  rotation?: number
  shadow?: string
  border?: string
  overflow?: string
  [key: string]: any
}

// ── Text Content Value ──
export interface TextContentValue {
  type: 'static' | 'dynamic' | 'mixed'
  value?: string
  binding_key?: string
  default_value?: string
  format?: string
  fallback?: string
  parts?: Array<{
    type: 'static' | 'dynamic'
    value: string
    binding_key?: string
    format?: string
  }>
}

// ── Image Source ──
export interface ImageSource {
  type: 'static' | 'dynamic'
  url?: string
  binding_key?: string
  fallback_url?: string
}

// ── Table Types ──
export interface TableCell {
  value?: TextContentValue
  content?: TextContentValue | string
  style?: ElementStyle | string
  colspan?: number
  col_span?: number
  rowspan?: number
  row_span?: number
  alignment?: 'left' | 'center' | 'right'
  [key: string]: any
}

export interface TableRow {
  cells: TableCell[]
  style?: ElementStyle | string
  isHeader?: boolean
  height?: number | string
  [key: string]: any
}

export interface TableHeader {
  cells: TableCell[]
  [key: string]: any
}

// ── Template Elements ──
export interface BaseElement {
  id: string
  type: string
  style?: ElementStyle | string
  x?: number
  y?: number
  width?: number | string
  height?: number | string
  locked?: boolean
  visible?: boolean
  rotation?: number
  z_index?: number
  [key: string]: any
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: TextContentValue
}

export interface TableElement extends BaseElement {
  type: 'table'
  rows: TableRow[]
  columns?: number
  headers?: TableHeader | string[]
  border?: {
    width?: number
    color?: string
    style?: string
    top?: { style: string; width: number; color: string }
    right?: { style: string; width: number; color: string }
    bottom?: { style: string; width: number; color: string }
    left?: { style: string; width: number; color: string }
    all?: { style: string; width: number; color: string }
  }
  [key: string]: any
}

export interface ImageElement extends BaseElement {
  type: 'image'
  source: ImageSource
  alt?: string
  fit?: 'cover' | 'contain' | 'fill' | 'none'
}

export interface LineElement extends BaseElement {
  type: 'line'
  direction: 'horizontal' | 'vertical'
  thickness?: number
  length?: number | string
  color?: string
  opacity?: number
  [key: string]: any
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle'
  fill_color?: string
  opacity?: number
  border_radius?: number | string
  border?: {
    width?: number
    color?: string
    style?: string
    top?: { style: string; width: number; color: string }
    right?: { style: string; width: number; color: string }
    bottom?: { style: string; width: number; color: string }
    left?: { style: string; width: number; color: string }
    all?: { style: string; width: number; color: string }
  }
  [key: string]: any
}

export interface SignatureElement extends BaseElement {
  type: 'signature'
  title?: TextContentValue
  label?: TextContentValue
  name?: TextContentValue
  position?: TextContentValue
  signature_type?: string
  [key: string]: any
}

export type TemplateElement =
  | TextElement
  | TableElement
  | ImageElement
  | LineElement
  | RectangleElement
  | SignatureElement

// ── Template Binding ──
export interface TemplateBinding {
  key: string
  label: string
  type?: 'text' | 'date' | 'number' | 'select' | 'image' | 'auto' | 'manual' | 'data' | 'context'
  source?: string
  default?: string
  default_value?: string
  options?: string[]
  format?: string
  required?: boolean
  description?: string
  fallback?: string
  value_type?: string
  date_format?: string
  example_value?: string
  path?: string
  [key: string]: any
}

// ── Letter Template ──
export interface LetterTemplate {
  id: string
  name: string
  description?: string
  category: string
  status?: 'active' | 'draft' | 'archived'
  page_settings: PageSettings
  elements: TemplateElement[]
  bindings: TemplateBinding[]
  default_bindings?: Record<string, string> | Array<{ key: string; value: string }>
  header_template?: string
  footer_template?: string
  created_at?: string
  updated_at?: string
  version?: number
  is_active?: boolean
  tags?: string[]
  metadata?: Record<string, any>
  [key: string]: any
}
