/**
 * Template Renderer — barrel exports.
 *
 * Provides all components and composables needed for WYSIWYG letter
 * template editing, rendering, binding resolution, and print-preview.
 *
 * @module template-renderer
 */

// ── Core Renderer ──
export { default as TemplateRenderer } from './TemplateRenderer.vue'

// ── Editor Components ──
export { default as EditorCanvas } from './EditorCanvas.vue'
export { default as ElementSelector } from './ElementSelector.vue'
export { default as PropertyPanel } from './PropertyPanel.vue'

// ── Preview & Binding ──
export { default as TemplatePreview } from './TemplatePreview.vue'
export { default as BindingEditor } from './BindingEditor.vue'
