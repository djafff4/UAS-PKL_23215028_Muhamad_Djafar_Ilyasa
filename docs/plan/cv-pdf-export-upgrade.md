# Plan: Upgrade CV PDF Export to Letter-System A4 Standard

**Date:** 2026-06-17  
**Status:** Draft  
**Goal:** Rewrite CV PDF export to match the letter system's reliability, A4 compliance, and clean architecture.

---

## Problem Summary

The **letter export system** is rock-solid — it shares a single `exportPdf.js` utility, uses a dedicated composable (`useLetterExport`), has proper A4 sizing (794×1123mm), CSS inliner, multi-page support, and robust error handling. The **CV export system** by contrast is fragile — CSS is inlined manually via `setAttribute`, transients are mangled, A4 sizing is handled per-template without a shared utility, there's no multi-page support, Google Fonts have no PDF fallback, box-shadows bleed into layout, and there's no caching on the backend.

This plan closes that gap in 4 phases.

---

## Phase 0 — Preflight (Shared Foundation)

### 0.1 — Extract `cssInliner.js` as shared utility

| Current | Target |
|---------|--------|
| Inline `style.css` manually in each export path | Shared function: `inlineStyles(html, opts?)` |
| Letter has its own, CV does it ad-hoc | Both call the same utility |

**File:** `src/utils/cssInliner.ts` (extract from letter system's `exportPdf.js`)
**Export:** Named export `inlineStyles(html: string, stylesheets?: string[]): string`
**Consumers:** Letter export (refactor) + CV export (new use)
**Acceptance:**
- Letter PDF still works after refactor
- CV uses `inlineStyles()` instead of manual `setAttribute`

### 0.2 — Create `useCvExport.ts` composable

| Current | Target |
|---------|--------|
| Export logic embedded in `CvPreview.vue` | Pure composable, no Vue dependency |
| Props/emits mixed with export concerns | Clean separation |

**File:** `src/composables/useCvExport.ts`
**API surface:**
```ts
interface UseCvExportReturn {
  exportPdf: (templateId: string, staffId: number) => Promise<Blob>
  exportError: Ref<string | null>
  isExporting: Ref<boolean>
}
```
**Acceptance:**
- `CvPreview.vue` calls `useCvExport().exportPdf()` — no inline logic
- Letter team (future) could also use the same composable shape

---

## Phase 1 — Fix Core Export Issues

### 1.1 — Strip box-shadows before print

Box-shadows on the wrapper cause offset / clipping on A4.

**Where:** Inside the export composable, after DOM clone
**Action:** Remove all `box-shadow` from `.cv-wrapper` / `.a4-page` elements
**Method:** `stripBoxShadows(clone: HTMLElement)` utility
**Letter equivalent:** Already done in `exportPdf.js`

### 1.2 — Fix wrapper centering at PDF scale

**Problem:** `transform: scale(...)` with no `transform-origin` shifts the content off-center.
**Fix:** Set `transform-origin: top center` on `.a4-page` wrapper + `justify-content: center` on the outer container.
**Acceptance:** 1:1 centered layout matching letter export.

### 1.3 — Google Fonts → embedded/system fallback for PDF

**Problem:** `@import url('https://fonts.googleapis.com/...')` doesn't survive the headless print.
**Fix:**
1. Option A — Download + embed woff2 as base64 inside `@font-face` (statically, build-time)
2. Option B — Replace with system font stack (`Inter` → `system-ui, -apple-system, sans-serif`) for PDF export only

**Recommendation:** Option B (simpler, no legal/license concerns with font embedding). The screen view keeps Google Fonts; PDF export uses system fallback via a CSS class toggle.

### 1.4 — Multi-page support

**Problem:** CV content >1 page (e.g. staff with long experience list) gets clipped.

**Fix:** Use `column-count` + `column-fill: auto` approach (matching letter system), OR overflow detection that splits content into `.a4-page` blocks.
**Letter equivalent:** Already handled in `useLetterExport` composable.
**Acceptance:** A CV with 10+ experience entries produces page 1 + page 2, both A4-sized.

### 1.5 — Replace SVG icons with text/simple shapes

**Problem:** SVG `<use>` references or complex icon paths may not render in the PDF headless context.
**Fix:** During export clone, replace known icon selectors (`.icon-user`, `.icon-mail`, etc.) with their Unicode equivalent or plain text label.
**Alternative:** Embed a simple icon font as base64 that survives headless rendering.

---

## Phase 2 — Template Standardization

### 2.1 — Audit all 6 CV templates for strict A4

Check each template in `staff_akman/src/views/staff/cv/templates/`:

| Template | A4 wrapper? | Content overflow? | Box-shadows? | Icons OK? |
|----------|-------------|-------------------|-------------|-----------|
| template1 | — | — | — | — |
| template2 | — | — | — | — |
| template3 | — | — | — | — |
| template4 | — | — | — | — |
| template5 | — | — | — | — |
| template6 | — | — | — | — |

**Action per template:**
- Remove scoped `<style scoped>` that makes the CSS unreachable by the inliner
- Wrap content in `<div class="a4-page">` (standard class, shared)
- Remove hardcoded inline dimensions (overridden by A4 wrapper)

### 2.2 — Standardize template structure

**Every template must export:**
```vue
<template>
  <div class="cv-template-{{id}}">
    <div class="a4-page">
      ...content...
    </div>
  </div>
</template>
```

### 2.3 — Remove `scoped` from template styles

**Problem:** Vue's `data-v-xxxxx` attribute selectors don't apply after `innerHTML` cloning.
**Fix:** Either:
- Remove `scoped` and use BEM class naming (recommended), OR
- Keep scoped but also export an unscoped `<style>` block for print classes

---

## Phase 3 — Backend Upgrades

### 3.1 — Rename endpoint (optional alignment)

| Current | Proposed |
|---------|----------|
| `/staff/cv/export-pdf` | `/staff/export-pdf?type=cv` |
| No cache | Cache with `?nocache` override |

**Reason:** Align with letter system's URL pattern for unified routing.
**Risk:** Old links break — add redirect or keep both for a transition period.

### 3.2 — Add response caching

**Problem:** Identical CV exports re-render every time (slow for popular staff).
**Fix:** In-memory LRU cache (or Redis if shared) keyed by `staffId + templateId`. Cache bust with `?nocache=1`.
**Letter equivalent:** Already has caching.

### 3.3 — Add `Content-Disposition` header

**Current:** Missing or generic filename.
**Target:** `Content-Disposition: attachment; filename="CV_{staffName}.pdf"`
**Letter equivalent:** Already has this.

---

## Phase 4 — Verification & Rollout

### 4.1 — Test matrix

| Scenario | Screen | PDF | Comment |
|----------|--------|-----|---------|
| Short CV (1 A4 page) | ✅ | ✅ | Basic case |
| Long CV (3+ pages) | ✅ | ✅ | Multi-page |
| All 6 templates | ✅ | ✅ | Per-template audit |
| Google Fonts active | ✅ | ✅ | System fallback legible |
| SVG icons present | ✅ | ✅ | Text replacement legible |

### 4.2 — Rollout sequence

```
Step 1: Extract cssInliner → shared utility (Phase 0)
Step 2: Create useCvExport composable → proof of concept
Step 3: Fix box-shadows + centering + Google Fonts (Phase 1)
Step 4: Fix multi-page support
Step 5: Standardize templates (Phase 2)
Step 6: Backend cache + headers (Phase 3)
Step 7: Full test matrix (Phase 4)
Step 8: Legacy endpoint redirect
```

---

## Appendix — Key Files

| File | Role |
|------|------|
| `src/views/staff/cv/CvPreview.vue` | Main CV preview — export logic lives here (to be extracted) |
| `src/utils/exportPdf.js` | Letter's shared export utility (reference + refactor target) |
| `src/composables/useLetterExport.js` | Letter's composable (template for CV composable) |
| `src/views/staff/cv/templates/*.vue` | 6 CV templates needing A4 standardization |
| `src/router/index.js` | Route registration for export endpoints |
| `src/api/controllers/StaffPdfExportController.js` | Backend export handler (add cache) |
