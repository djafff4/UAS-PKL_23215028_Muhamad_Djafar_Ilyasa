<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <RouterLink :to="`/events/${id}`" class="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft :size="18" class="text-white/70" />
          </RouterLink>
          <div>
            <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Edit Event</h1>
            <p class="text-sm text-white/60 mt-0.5 font-medium">Perbarui detail event</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat data event...</p>
    </div>

    <template v-if="!loading">
      <div class="bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl border border-surface-200/50 dark:border-surface-800/30 p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-5">
          <span class="w-1 h-5 rounded-full bg-emerald-500"></span>
          <h2 class="text-sm font-bold text-surface-900 dark:text-surface-100">Detail Event</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div class="lg:col-span-3 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Judul Event <span class="text-red-500">*</span>
              </label>
              <input v-model="form.title" type="text" placeholder="Contoh: Workshop Python untuk Pemula"
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Deskripsi
              </label>
              <textarea v-model="form.description" rows="5" placeholder="Deskripsi detail tentang event ini..."
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all resize-none" />
            </div>
          </div>
          <div class="lg:col-span-2 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Status
              </label>
              <select v-model="form.status"
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Visibilitas
              </label>
              <select v-model="form.visibility"
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all">
                <option value="private">Private — hanya saya</option>
                <option value="staff">Staff — semua staff</option>
                <option value="division">Divisi — staff satu divisi</option>
                <option value="public">Publik — semua orang</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Tanggal Event
              </label>
              <input v-model="form.event_date" type="date"
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Lokasi
              </label>
              <input v-model="form.location" type="text" placeholder="Ruang Meeting, Online, dll."
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Google Form URL
              </label>
              <input v-model="form.google_form_url" type="url" placeholder="https://docs.google.com/forms/d/..."
                class="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <RouterLink :to="`/events/${id}`"
          class="px-4 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors">
          Batal
        </RouterLink>
        <button @click="handleUpdate"
          :disabled="submitting || !form.title.trim()"
          class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-600/20 cursor-pointer">
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Loader2, Save } from 'lucide-vue-next'
import { useEventsStore } from '@/stores/events'
import { useToast } from '@/composables/useToast'

const store = useEventsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const id = route.params.id as string
const loading = ref(true)
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  event_date: '',
  location: '',
  google_form_url: '',
  status: 'draft',
  visibility: 'private',
})

onMounted(async () => {
  try {
    await store.fetchEvent(id)
    if (store.currentEvent) {
      const ev = store.currentEvent
      form.title = ev.title || ''
      form.description = ev.description || ''
      form.event_date = ev.event_date ? ev.event_date.slice(0, 10) : ''
      form.location = ev.location || ''
      form.google_form_url = ev.google_form_url || ''
      form.status = ev.status || 'draft'
      form.visibility = ev.visibility || 'private'
    } else {
      toast.error('Gagal', 'Event tidak ditemukan')
      router.push('/events')
    }
  } catch (err: any) {
    toast.error('Gagal', err?.message || 'Gagal memuat event')
    router.push('/events')
  } finally {
    loading.value = false
  }
})

async function handleUpdate() {
  if (!form.title.trim()) return
  submitting.value = true
  try {
    const payload: any = { ...form }
    if (!payload.event_date) payload.event_date = null
    const res = await store.updateEvent(id, payload)
    if (res?.success) {
      toast.success('Berhasil', 'Event berhasil diperbarui')
      router.push(`/events/${id}`)
    } else {
      toast.error('Gagal', res?.message || 'Gagal memperbarui event')
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'Terjadi kesalahan'
    toast.error('Gagal', msg)
  } finally {
    submitting.value = false
  }
}
</script>
