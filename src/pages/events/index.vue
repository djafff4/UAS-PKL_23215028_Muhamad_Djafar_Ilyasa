<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Event Management</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Kelola event, scan QR, dan pantau kehadiran</p>
        </div>
        <RouterLink to="/events/create" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/10 transition-all duration-200 shrink-0">
          <Plus :size="16" />
          New Event
        </RouterLink>
      </div>
    </div>

    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input v-model="search" type="text" placeholder="Cari event..."
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
            @input="debouncedSearch" />
        </div>
        <select v-model="statusFilter"
          class="px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all min-w-[140px]">
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button @click="refresh"
          class="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm font-medium flex items-center gap-2">
          <RefreshCw :size="16" :class="{ 'animate-spin': store.loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Scope Tabs -->
    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 p-1 flex gap-1">
      <button v-for="tab in scopeTabs" :key="tab.key" @click="setScope(tab.key)"
        class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
        :class="activeScope === tab.key
          ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
          : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'">
        {{ tab.label }}
      </button>
    </div>

    <div class="rounded-2xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-50 dark:bg-surface-800/50">
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Title</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Short Code</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Status</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Scans</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Attendees</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider w-[60px]">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100 dark:divide-surface-800/30">
            <tr v-for="ev in store.events" :key="ev.id" @click="router.push(`/events/${ev.id}`)"
              class="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer">
              <td class="px-4 py-3">
                <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ ev.title }}</p>
              </td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden sm:table-cell font-mono">{{ ev.short_code }}</td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                  :class="statusBadge(ev.status)">
                  {{ ev.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 text-center hidden lg:table-cell">{{ ev.scan_count }}</td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 text-center hidden lg:table-cell">{{ ev.attendee_count }}</td>
              <td class="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">{{ ev.event_date ? formatDate(ev.event_date) : '-' }}</td>
              <td class="px-4 py-3 text-center relative">
                <button @click.stop="toggleDropdown(ev.id!)"
                  class="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <MoreVertical :size="16" class="text-surface-400" />
                </button>
                <div v-if="openDropdown === ev.id"
                  class="absolute right-0 mt-1 w-44 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 z-50 py-1 origin-top-right">
                  <RouterLink :to="`/events/${ev.id}`" @click.stop="openDropdown = null"
                    class="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50">
                    <Eye :size="14" /> Detail
                  </RouterLink>
                  <button @click.stop="copyShortUrl(ev)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50">
                    <Link :size="14" /> Salin URL
                  </button>
                  <button @click.stop="downloadQR(ev.id!)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50">
                    <QrCode :size="14" /> Download QR
                  </button>
                  <hr class="my-1 border-surface-200 dark:border-surface-700" />
                  <button @click.stop="confirmDelete(ev)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 :size="14" /> Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!store.events.length && !store.loading">
              <td colspan="7" class="px-4 py-12 text-center text-sm text-surface-400">
                <Calendar :size="32" class="mx-auto text-surface-300 mb-2" />
                Tidak ada event
              </td>
            </tr>
            <tr v-if="store.loading">
              <td colspan="7" class="px-4 py-12 text-center text-sm text-surface-400">
                <div class="flex items-center justify-center gap-2">
                  <div class="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  Memuat data...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.total > 20" class="flex items-center justify-between px-4 py-3 border-t border-surface-200/50 dark:border-surface-800/30">
        <p class="text-xs text-surface-400">Total: {{ store.total }} event</p>
        <div class="flex gap-1">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="currentPage <= 1 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800'">
            Prev
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage * 20 >= store.total"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="currentPage * 20 >= store.total ? 'text-surface-300 cursor-not-allowed' : 'text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800'">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Calendar, RefreshCw, MoreVertical, Eye, Link, QrCode, Trash2 } from 'lucide-vue-next'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const store = useEventsStore()
const toast = useToast()
const search = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const openDropdown = ref<string | null>(null)
const activeScope = ref(store.scopeFilter || 'mine')
const scopeTabs = [
  { key: 'mine', label: 'Milik Saya' },
  { key: 'staff', label: 'Semua Staff' },
  { key: 'division', label: 'Satu Divisi' },
  { key: 'public', label: 'Publik' },
]

function setScope(key: string) {
  activeScope.value = key
  store.scopeFilter = key
  currentPage.value = 1
  store.fetchEvents({ scope: key, page: 1 })
}

function onClickOutside() {
  if (openDropdown.value) {
    openDropdown.value = null
  }
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function toggleDropdown(id: string) {
  openDropdown.value = openDropdown.value === id ? null : id
}

function statusBadge(status: string) {
  const badges: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    archived: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  }
  return badges[status] || 'bg-surface-100 text-surface-600'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => refresh(), 400)
}

function refresh() {
  currentPage.value = 1
  store.fetchEvents({ search: search.value || undefined, status: statusFilter.value || undefined, page: currentPage.value, scope: activeScope.value })
}

function changePage(p: number) {
  currentPage.value = p
  store.fetchEvents({ search: search.value || undefined, status: statusFilter.value || undefined, page: p, scope: activeScope.value })
}

watch(statusFilter, () => refresh())

async function copyShortUrl(ev: any) {
  const url = `${window.location.origin}/e/${ev.short_code}`
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Tersalin', 'URL berhasil disalin')
  } catch {
    toast.error('Gagal', 'Gagal menyalin URL')
  }
  openDropdown.value = null
}

function downloadQR(id: string) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1'
  const link = document.createElement('a')
  link.href = `${baseURL}/staff/events/${id}/qr`
  link.download = `qr-event-${id}.png`
  link.click()
  openDropdown.value = null
}

async function confirmDelete(ev: any) {
  openDropdown.value = null
  if (!confirm(`Hapus event "${ev.title}"? Aksi ini tidak bisa dibatalkan.`)) return
  try {
    const res = await store.deleteEvent(ev.id)
    if (res?.success) {
      toast.success('Terhapus', 'Event berhasil dihapus')
    } else {
      toast.error('Gagal', res?.message || 'Gagal menghapus event')
    }
  } catch (err: any) {
    toast.error('Gagal', err?.message || 'Gagal menghapus event')
  }
}

// Hapus duplikat - fetchEvents sudah dipanggil di onMounted listenernya
onMounted(() => store.fetchEvents({ page: 1, scope: activeScope.value }))
</script>
