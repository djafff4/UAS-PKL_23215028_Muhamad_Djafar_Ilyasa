/**
 * Letter PDF export composable.
 *
 * Uses client-side html2canvas + jsPDF for 100% preview match.
 * Temporarily repositions the element for clean capture.
 */
import { type Ref } from 'vue'
import type { StaffContract, StaffAppointmentLetter, StaffWorkCertificate, StaffTerminationLetter } from '@/types'

// ─── Props ─────────────────────────────────────────────────
export interface UseLetterExportOptions {
  letterViewerRef: Ref<HTMLElement | null>
  letterExporting: Ref<boolean>
  viewingLetterType: Ref<'contract' | 'appointment' | 'work_certificate' | 'termination'>
  contractLetterData: Ref<StaffContract | null>
  appointmentLetterData: Ref<StaffAppointmentLetter | null>
  workCertificateData: Ref<StaffWorkCertificate | null>
  terminationLetterData: Ref<StaffTerminationLetter | null>
  authToken: Ref<string>
}

// ─── Main export function ──────────────────────────────────
export function useLetterExport(opts: UseLetterExportOptions) {
  async function exportLetterPdf() {
    const viewerEl = opts.letterViewerRef.value
    if (!viewerEl || !opts.viewingLetterType.value) return
    opts.letterExporting.value = true

    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const pages = viewerEl.querySelectorAll('.a4-page, .page') as NodeListOf<HTMLElement>
      const pdf = new jsPDF('p', 'mm', 'a4')

      for (let i = 0; i < (pages.length || 1); i++) {
        const el = pages[i] || viewerEl

        // Save original styles
        const origStyles = {
          position: el.style.position,
          top: el.style.top,
          left: el.style.left,
          zIndex: el.style.zIndex,
          margin: el.style.margin,
          boxShadow: el.style.boxShadow,
          borderRadius: el.style.borderRadius,
          transform: el.style.transform,
        }

        // Temporarily reposition for clean capture
        el.style.position = 'fixed'
        el.style.top = '0'
        el.style.left = '0'
        el.style.zIndex = '-1'
        el.style.margin = '0'
        el.style.boxShadow = 'none'
        el.style.borderRadius = '0'
        el.style.transform = 'none'

        // Wait for layout to settle
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))))

        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: false,
          useCORS: true,
          width: 794,
          height: 1123,
          windowWidth: 794,
        })

        // Restore original styles
        Object.entries(origStyles).forEach(([key, val]) => {
          ;(el.style as any)[key] = val
        })

        if (i > 0) pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
      }

      const identifier = (
        opts.contractLetterData.value?.contract_number ??
        opts.appointmentLetterData.value?.letter_number ??
        opts.workCertificateData.value?.letter_number ??
        opts.terminationLetterData.value?.letter_number ??
        'Letter'
      )
      const filePrefix = (
        opts.viewingLetterType.value === 'contract' ? 'Kontrak'
        : opts.viewingLetterType.value === 'work_certificate' ? 'KeteranganKerja'
        : opts.viewingLetterType.value === 'termination' ? 'Paklaring'
        : 'Surat'
      )
      pdf.save(`${filePrefix}_${identifier}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      opts.letterExporting.value = false
    }
  }

  return { exportLetterPdf }
}
