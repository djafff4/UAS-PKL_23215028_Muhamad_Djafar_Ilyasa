/**
 * Shared CSS inliner for PDF export (letter & CV).
 *
 * Takes a DOM element clone and produces a self-contained HTML string
 * with all computed styles inlined, images embedded as data URIs,
 * and box-shadows stripped. Designed for server-side chromedp PDF rendering.
 *
 * Usage:
 *   import { buildExportHtml } from '@/utils/cssInliner'
 *   const html = await buildExportHtml(element, 'CV_Staff_Name.pdf')
 */

// ─── CSS inliner helpers ────────────────────────────────────

export const SKIP_CSS_PROPS = new Set([
  'animation', 'animation-delay', 'animation-direction',
  'animation-duration', 'animation-fill-mode', 'animation-iteration-count',
  'animation-name', 'animation-play-state', 'animation-timing-function',
  'transition', 'transition-delay', 'transition-duration',
  'transition-property', 'transition-timing-function',
  'will-change', 'perspective', 'perspective-origin',
])

/** Key layout/visual CSS properties to inline (subset for performance) */
export const INLINE_CSS_PROPS = [
  'display', 'position', 'top', 'right', 'bottom', 'left',
  'float', 'clear', 'z-index',
  'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-width', 'border-style', 'border-color', 'border-radius',
  'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'background', 'background-color', 'background-image', 'background-size',
  'background-position', 'background-repeat', 'background-clip',
  'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'line-height', 'letter-spacing', 'text-align', 'text-decoration',
  'text-transform', 'text-indent', 'white-space', 'word-break', 'word-wrap',
  'overflow-wrap', 'overflow', 'overflow-x', 'overflow-y',
  'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'align-content',
  'justify-content', 'justify-items', 'justify-self',
  'gap', 'row-gap', 'column-gap', 'order',
  'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
  'grid-auto-flow', 'grid-auto-columns', 'grid-auto-rows',
  'box-sizing', 'opacity', 'visibility',
  'vertical-align', 'table-layout', 'border-collapse', 'border-spacing',
  'object-fit', 'object-position',
  'list-style', 'list-style-type', 'list-style-position',
  'text-overflow', 'cursor',
  'page-break-inside', 'page-break-after', 'page-break-before',
  'zoom',
]

/**
 * Recursively inline computed styles on every element in the tree.
 * Skips CSS properties listed in SKIP_CSS_PROPS.
 */
export function inlineComputedStyles(el: HTMLElement): void {
  const computed = window.getComputedStyle(el)
  const parts: string[] = []

  for (const prop of INLINE_CSS_PROPS) {
    if (SKIP_CSS_PROPS.has(prop)) continue
    const val = computed.getPropertyValue(prop)
    if (val && val !== 'none' && val !== 'normal' && val !== 'auto' && val !== '0px' && val !== 'rgba(0, 0, 0, 0)') {
      parts.push(`${prop}:${val}`)
    }
  }

  // Keep some critical "zero" values
  const display = computed.getPropertyValue('display')
  if (display) parts.push(`display:${display}`)

  if (parts.length > 0) {
    el.setAttribute('style', parts.join(';'))
  }

  // Recurse into children
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i]
    if (child instanceof HTMLElement) {
      inlineComputedStyles(child)
    }
  }
}

/**
 * Recursively strip box-shadow from every element.
 * Box-shadows on the A4 wrapper cause clipping/offset in chromedp.
 */
export function stripBoxShadows(el: HTMLElement): void {
  el.style.boxShadow = 'none'
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i]
    if (child instanceof HTMLElement) stripBoxShadows(child)
  }
}

/**
 * Convert <img> src to data URI (base64 inline) for self-containment.
 * Skips cross-origin images that can't be read.
 */
export async function inlineImages(el: HTMLElement): Promise<void> {
  const imgs = el.querySelectorAll('img')
  const promises: Promise<void>[] = []

  for (const img of imgs) {
    if (!img.src || img.src.startsWith('data:')) continue

    promises.push(
      (async () => {
        try {
          const res = await fetch(img.src, { credentials: 'same-origin' })
          if (!res.ok) return
          const blob = await res.blob()
          const reader = new FileReader()
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
          img.setAttribute('src', dataUrl)
        } catch {
          // Cross-origin or network error — keep original src
        }
      })(),
    )
  }

  await Promise.all(promises)
}

// ─── A4 Export constants ────────────────────────────────────

export const A4_WIDTH = 794
export const A4_HEIGHT = 1123

/**
 * Build a self-contained HTML document from a DOM element.
 *
 * @param el - The root element to export (will be cloned, not mutated)
 * @param fileName - Optional filename hint for Content-Disposition
 * @param fontImport - Optional @import URL for Google Fonts (empty = system fonts)
 * @returns Standalone HTML string ready for server-side PDF rendering
 */
export async function buildExportHtml(
  el: HTMLElement,
  _fileName?: string,
  fontImport?: string,
): Promise<string> {
  // Wait for all fonts to load
  await document.fonts.ready
  await new Promise(r => setTimeout(r, 150))

  // 1. Clone the rendered element
  const clone = el.cloneNode(true) as HTMLElement

  // 2. Convert QR <canvas> elements to <img>
  const originalCanvases = el.querySelectorAll('canvas')
  const cloneCanvases = clone.querySelectorAll('canvas')
  cloneCanvases.forEach((cloneCanvas, idx) => {
    const originalCanvas = originalCanvases[idx]
    if (originalCanvas) {
      const img = document.createElement('img')
      img.src = originalCanvas.toDataURL('image/png')
      img.width = originalCanvas.width
      img.height = originalCanvas.height
      img.style.cssText = cloneCanvas.style.cssText
      img.className = cloneCanvas.className
      cloneCanvas.parentNode?.replaceChild(img, cloneCanvas)
    }
  })

  // 3. Attach clone to DOM temporarily (invisible) so getComputedStyle works
  const offscreen = document.createElement('div')
  offscreen.style.cssText = [
    'position:fixed',
    'top:0',
    'left:-9999px',
    `width:${A4_WIDTH}px`,
    'z-index:-9999',
    'pointer-events:none',
    'overflow:visible',
    'background:#ffffff',
  ].join(';')

  // Preview is A4 → capture as-is, no scaling
  clone.style.transform = ''
  clone.style.zoom = ''
  clone.style.width = `${A4_WIDTH}px`
  clone.style.height = `${A4_HEIGHT}px`
  clone.style.minHeight = `${A4_HEIGHT}px`
  clone.style.maxHeight = `${A4_HEIGHT}px`
  clone.style.margin = '0'
  clone.style.overflow = 'hidden'

  offscreen.appendChild(clone)
  document.body.appendChild(offscreen)

  try {
    await new Promise(r => setTimeout(r, 50))

    // Inline computed styles on every element
    inlineComputedStyles(clone)

    // Strip box-shadows (chromedp reacts poorly to them on wrappers)
    stripBoxShadows(clone)

    // Inline all images as base64 data URIs
    await inlineImages(clone)

    // Font import: use provided URL or fallback to system sans-serif
    const fontCss = fontImport
      ? `@import url('${fontImport}');`
      : ''

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${fontCss}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: ${A4_WIDTH}px; height: ${A4_HEIGHT}px; margin: 0; padding: 0; background: #fff; overflow: hidden; }
    @page { size: ${A4_WIDTH}px ${A4_HEIGHT}px; margin: 0; }
    a { color: inherit; text-decoration: inherit; }
  </style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`
  } finally {
    document.body.removeChild(offscreen)
  }
}
