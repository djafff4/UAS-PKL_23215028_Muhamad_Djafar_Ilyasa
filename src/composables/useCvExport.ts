/**
 * CV PDF/PNG export composable.
 *
 * Both PDF and PNG use client-side html2canvas capture for 100% preview match.
 */
import { ref } from 'vue'
import type { CV } from '@/types'
import { A4_WIDTH, A4_HEIGHT } from '@/utils/cssInliner'

// ─── Props ─────────────────────────────────────────────────
export interface UseCvExportOptions {
  cv: CV
  getTargetEl: () => HTMLElement | null
}

export function useCvExport(opts: UseCvExportOptions) {
  const exporting = ref(false)
  const serverExporting = ref(false)

  // ─── PNG Export (uses html2canvas) ──────────────────────

  async function getCanvas() {
    const { default: html2canvas } = await import('html2canvas')
    const el = opts.getTargetEl()
    if (!el) throw new Error('CV content not found')

    // Convert all QR canvases to images before cloning
    const qrCanvases = el.querySelectorAll('canvas')
    const qrImages: { original: HTMLCanvasElement; img: HTMLImageElement }[] = []

    for (const canvas of qrCanvases) {
      const img = new Image()
      img.src = canvas.toDataURL('image/png')
      img.style.cssText = canvas.style.cssText
      img.width = canvas.width
      img.height = canvas.height
      img.className = canvas.className
      qrImages.push({ original: canvas, img })
    }

    // Clone the CV element
    const clone = el.cloneNode(true) as HTMLElement

    // Replace QR canvases in clone with images
    const cloneCanvases = clone.querySelectorAll('canvas')
    cloneCanvases.forEach((cloneCanvas, idx) => {
      if (qrImages[idx]) {
        const img = qrImages[idx].img.cloneNode(true) as HTMLImageElement
        img.style.cssText = cloneCanvas.style.cssText
        img.width = cloneCanvas.width
        img.height = cloneCanvas.height
        cloneCanvas.parentNode?.replaceChild(img, cloneCanvas)
      }
    })

    const offscreen = document.createElement('div')
    offscreen.style.cssText = [
      'position:fixed',
      'top:0',
      'left:-9999px',
      'width:794px',
      'z-index:-9999',
      'pointer-events:none',
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
      await document.fonts.ready
      await new Promise(r => setTimeout(r, 200))

      // Capture at 2x resolution for crisp print quality
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: A4_WIDTH,
        height: A4_HEIGHT,
        windowWidth: A4_WIDTH,
      })

      return canvas
    } finally {
      document.body.removeChild(offscreen)
    }
  }

  async function exportImage() {
    exporting.value = true
    try {
      const canvas = await getCanvas()
      const link = document.createElement('a')
      link.download = `CV_${opts.cv.full_name || 'Akman'}_${opts.cv.template}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Image export failed:', err)
    } finally {
      exporting.value = false
    }
  }

  // ─── PDF Export (client-side html2canvas + jsPDF — matches preview 100%) ─────

  async function exportServerPdf() {
    serverExporting.value = true
    try {
      const canvas = await getCanvas()
      const { jsPDF } = await import('jspdf')

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
      pdf.save(`CV_${opts.cv.full_name || 'Akman'}.pdf`)
    } catch (err: any) {
      console.error('PDF export failed:', err)
    } finally {
      serverExporting.value = false
    }
  }

  return {
    exporting,
    serverExporting,
    exportServerPdf,
    exportImage,
    getCanvas,
  }
}
