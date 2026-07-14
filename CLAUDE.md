# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Staff Akman** — Vue 3 + TypeScript SPA for internal staff workspace of PT AGSYA KARYA MANCA (Akman). Features: task & KPI management, meeting/notes/documents, event registration with forms, CV builder (5 templates), letter generator (contract/appointment/work certificate/termination), e-library, finance tracking, roadmap, and staff management.

Hybrid mobile app via Capacitor (Android APK builds).

## Commands

- `npm run dev` — Start Vite dev server (port 3001)
- `npm run dev:lokal` — Dev with `.env.lokal` environment
- `npm run build` — Full build: `vue-tsc -b && vite build`
- `npm run preview` — Preview production build
- `npm run build:mobile` — Build for Capacitor mobile
- `npm run cap:sync` — Sync Capacitor Android project
- `npm run android:open` — Open Android Studio
- `npm run mobile:build-apk` — Full APK build chain

## Environment

Config via `.env` files (see `.env.example`). Key vars: `VITE_API_URL`, `VITE_PORT`, `VITE_APP_URL`. Dev proxy at `VITE_API_URL` prefix (`/api` → backend).

## Architecture

### Structure
- `src/pages/` — Route pages (one per route, organized by feature)
- `src/components/` — Reusable Vue SFCs, grouped by domain: `cv/`, `letters/`, `events/`, `staff/`, `profile/`, `e-library/`, `template-renderer/`, `sidebar/`, `ui/`
- `src/stores/` — Pinia stores (auth, cv, documents, events, achievements, etc.)
- `src/composables/` — Composition API hooks (useApi, useLetterExport, useCvExport, useTemplateBinding, useStaffApi)
- `src/types/` — TypeScript interfaces covering all domain models
- `src/layouts/` — `default.vue` (authenticated) and `login.vue` layouts
- `src/data/` — Static mock data and letter template JSON configs
- `src/config/` — Navigation tree configuration
- `src/router/` — Vue Router with auth guard (redirects to /login if unauthenticated)
- `docs/` — Migrations and upgrade plans

### API Layer
- `useApi` composable wraps native `fetch` with Bearer token injection and auto-401 refresh
- `useStaffApi` wraps `useApi` and auto-applies department filter
- Base URL from `VITE_API_URL` env, proxied on dev server

### Auth & Roles
- Login: email/password or Google OAuth callback
- Pillar+addon role system processed client-side from backend roles
- Computed permission flags: `isStaff`, `canManageStaff`, `hasGlobalAccess`, `canManageRoadmap`, `dashboardScope`
- Auth state persisted in localStorage; token refresh with `/auth/refresh`

### Letter System
- JSON-based letter templates in `src/data/letters_templates/` with binding resolution (`{{ key }}` placeholders)
- Template type system in `src/types/template.ts`: TextElement, TableElement, ImageElement, LineElement, RectangleElement, SignatureElement
- Binding resolution in `useTemplateBinding.ts` with date formatting (Indonesian locale)
- PDF export via client-side html2canvas + jsPDF (100% preview match)
- Signature types: `traditional` or `qrcode`

### CV Builder
- 5 templates: `akman-academy`, `akman-corporate`, `modern`, `executive`, `minimalist`, `creative`
- Canvas-based export to PDF and PNG using html2canvas + jsPDF
- Server-side PDF export option available

### Key Dependencies
- Vue 3 (Composition API, `<script setup>`), Pinia, Vue Router 4
- Tailwind CSS 3
- Capacitor 8 (Android, camera, filesystem, network, push notifications, haptics)
- html2canvas + jsPDF (PDF/PNG exports)
- pdf-lib (PDF manipulation)
- lucide-vue-next (icons)
- @vueuse/core (utilities)
- vue-tsc (TypeScript check before build)
