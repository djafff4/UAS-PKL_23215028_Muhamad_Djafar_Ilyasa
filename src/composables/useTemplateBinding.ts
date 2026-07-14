/**
 * Template binding resolution utilities.
 * Resolves {{ key }} placeholders and maps LetterTemplate bindings
 * to actual letter data for rendering.
 */
import type { LetterTemplate, TextContentValue, TableCell, TableRow } from '@/types/template'

// ── Indonesian month names ──
const MONTHS_ID: string[] = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/**
 * Format a date string using template format tokens.
 * Supports: DD, MM, MMMM, YYYY, YY, HH, mm, ss
 *
 * @param value - ISO date string or any parseable date
 * @param format - Format string with tokens (e.g. 'DD MMMM YYYY')
 * @returns Formatted date string
 */
export function formatTemplateDate(value: string, format: string): string {
  const d = new Date(value)
  if (isNaN(d.getTime())) return value

  const pad = (n: number): string => String(n).padStart(2, '0')

  const tokens: Record<string, string> = {
    DD: pad(d.getDate()),
    MM: pad(d.getMonth() + 1),
    MMMM: MONTHS_ID[d.getMonth()],
    MMM: MONTHS_ID[d.getMonth()].slice(0, 3),
    YYYY: String(d.getFullYear()),
    YY: String(d.getFullYear()).slice(-2),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  }

  let result = format
  // Sort tokens by length (descending) to avoid partial replacement
  // e.g. "MMMM" should be replaced before "MMM" -> "MM"
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length)
  for (const token of sortedTokens) {
    result = result.split(token).join(tokens[token])
  }
  return result
}

/**
 * Resolve all template bindings against actual letter data + optional context.
 * Falls back to binding.default_value when a key has no data.
 *
 * @param template - The LetterTemplate with binding definitions
 * @param letterData - Actual letter record fields (flat key-value)
 * @param context - Additional context (staff info, company info, etc.)
 * @returns Record mapping binding keys to resolved string values
 */
export function resolveBindings(
  template: LetterTemplate,
  letterData: Record<string, unknown>,
  context?: Record<string, unknown>,
): Record<string, string> {
  const resolved: Record<string, string> = {}

  for (const binding of template.bindings) {
    // Priority: letterData > context > binding.default_value
    let raw = letterData[binding.key]
    if ((raw === undefined || raw === null) && context) {
      raw = context[binding.key]
    }
    if (raw === undefined || raw === null) {
      raw = binding.default_value ?? ''
    }

    let value = String(raw)

    // Apply date formatting for date-type bindings
    if (binding.value_type === 'date' && value && binding.date_format) {
      value = formatTemplateDate(value, binding.date_format)
    }

    resolved[binding.key] = value
  }

  return resolved
}

/**
 * Replace {{ key }} placeholders in a string with their resolved values.
 * Unresolved keys remain as-is (e.g. {{ unknown_key }}).
 */
export function resolveTemplatePlaceholders(
  text: string,
  bindings: Record<string, string>,
): string {
  return text.replace(/\{\{\s*(\w[\w.]*)\s*\}\}/g, (_match, key: string) => {
    const resolved = bindings[key]
    return resolved !== undefined ? resolved : `{{${key}}}`
  })
}

/**
 * Resolve a TextContentValue (static or dynamic) to its display string.
 * Static text is checked for {{ placeholder }} replacements.
 * Dynamic text looks up the binding_key in the bindings map.
 */
export function resolveTextContent(
  content: TextContentValue | string | undefined,
  bindings: Record<string, string>,
): string {
  if (!content) return ''
  if (typeof content === 'string') return resolveTemplatePlaceholders(content, bindings)

  if (content.type === 'dynamic') {
    const key = content.binding_key ?? ''
    const resolved = bindings[key]
    return resolved ?? content.default_value ?? `{{${key}}}`
  }
  // Static: replace {{ placeholders }} with binding values
  return resolveTemplatePlaceholders(content.value ?? '', bindings)
}

/**
 * Resolve all cells in a table (headers + rows) returning the populated text.
 * Useful for pre-processing table data before rendering.
 */
export function resolveTableCells(
  headers: { cells: TableCell[] } | undefined,
  rows: TableRow[] | undefined,
  bindings: Record<string, string>,
): { headers: string[][]; rows: string[][] } {
  const resolvedHeaders = headers
    ? [headers.cells.map(c => resolveTextContent(c.content, bindings))]
    : []

  const resolvedRows = rows
    ? rows.map(r => r.cells.map(c => resolveTextContent(c.content, bindings)))
    : []

  return { headers: resolvedHeaders, rows: resolvedRows }
}

/**
 * Generate a category → key mapping for what data fields to extract.
 * This helps when building the letterData map from different record types.
 */
export function letterDataFromRecord(
  record: Record<string, unknown>,
  extraFields?: Record<string, unknown>,
): Record<string, unknown> {
  return {
    // Staff fields
    staff_name: record.staff_name,
    position: record.position,
    department: record.department,
    // Letter fields
    letter_number: record.letter_number,
    contract_number: record.contract_number,
    appointment_type: record.appointment_type,
    effective_date: record.effective_date,
    start_date: record.start_date,
    end_date: record.end_date,
    termination_type: record.termination_type,
    purpose: record.purpose,
    // Date fields
    created_at: record.created_at ?? new Date().toISOString(),
    // Extra context
    ...extraFields,
    // Ensure record fields override defaults
    ...record,
  }
}
