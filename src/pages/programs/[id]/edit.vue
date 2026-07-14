<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="router.push(`/programs/${route.params.id}`)"
      class="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
      <ArrowLeft :size="16" />
      Kembali ke Detail
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
      <p class="text-sm text-surface-400 font-medium">Memuat data program...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!program" class="card p-12 text-center">
      <BookOpen :size="40" class="mx-auto text-surface-300 mb-3" />
      <p class="text-sm font-semibold text-surface-500">Program tidak ditemukan</p>
    </div>

    <!-- Edit Form -->
    <template v-else>
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-surface-900 p-5 sm:p-6">
        <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
        <div class="relative z-10">
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Edit Program</h1>
          <p class="text-sm text-white/60 mt-1">{{ program.title }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Informasi Dasar
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Judul Program *</label>
              <input v-model="form.title" type="text" class="input-field" placeholder="Nama program pelatihan" required />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Kode Program</label>
              <input :value="program.code" type="text" class="input-field bg-surface-50 dark:bg-surface-800/50" disabled />
              <p class="text-[11px] text-surface-400 mt-1">Kode dibuat otomatis oleh sistem</p>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Program *</label>
              <select v-model="form.program_type" class="input-field" required>
                <option value="REGULER">Reguler</option>
                <option value="MENTORING">Mentoring</option>
                <option value="PERSONAL">Personal</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                {{ isPersonal ? 'Tier *' : 'Level' }}
              </label>
              <select v-if="isPersonal" v-model="form.personal_tier" class="input-field" required>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="premium">Premium</option>
              </select>
              <select v-else v-model="form.level" class="input-field">
                <option value="">Pilih (opsional)</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <p v-if="!isPersonal" class="text-[11px] text-surface-400 mt-1">Level bersifat opsional, digunakan sebagai badge pembeda</p>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Status</label>
              <select v-model="form.status" class="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Deskripsi
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi Singkat</label>
              <textarea v-model="form.short_description" rows="2" class="input-field resize-none" placeholder="Ringkasan singkat program (maks 500 karakter)"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Deskripsi Lengkap</label>
              <textarea v-model="form.description" rows="5" class="input-field resize-none" placeholder="Deskripsi detail program"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Prasyarat</label>
              <textarea v-model="form.prerequisites" rows="3" class="input-field resize-none" placeholder="Prasyarat mengikuti program"></textarea>
            </div>
          </div>
        </div>

        <!-- Duration & Participants -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Durasi & Peserta
          </h3>
          <div v-if="isPersonal" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <p class="text-sm font-medium text-amber-700 dark:text-amber-300">⏱️ Durasi: <strong>Flexible</strong></p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">Program personal memiliki durasi yang fleksibel sesuai kebutuhan peserta</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Durasi (JP/Jam)</label>
              <input v-model.number="form.duration_hours" type="number" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Durasi (Minggu)</label>
              <input v-model.number="form.duration_weeks" type="number" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Total Pertemuan</label>
              <input v-model.number="form.total_sessions" type="number" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Maks Peserta</label>
              <input v-model.number="form.max_participants" type="number" class="input-field" placeholder="30" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Total JP</label>
              <input v-model.number="form.total_jp" type="number" class="input-field" placeholder="0" />
            </div>
          </div>
          <!-- Preview Durasi -->
          <div v-if="durationPreview" class="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
            <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Preview Durasi:</p>
            <p class="text-sm font-medium text-indigo-700 dark:text-indigo-300 mt-0.5">{{ durationPreview }}</p>
          </div>
        </div>

        <!-- Pricing -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Harga
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Harga (RP)</label>
              <input v-model.number="form.price" type="number" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Mata Uang</label>
              <select v-model="form.currency" class="input-field">
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SAR">SAR</option>
                <option value="MYR">MYR</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Location & Mode -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Lokasi & Mode
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Lokasi</label>
              <input v-model="form.location" type="text" class="input-field" placeholder="Lokasi pelatihan" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Bahasa</label>
              <select v-model="form.language" class="input-field">
                <option value="id">Indonesia</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Standards -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Standar & Sertifikasi
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Standar</label>
              <select v-model="form.standard_type" class="input-field">
                <option value="">Pilih</option>
                <option value="SKKNI">SKKNI</option>
                <option value="SKKI">SKKI</option>
                <option value="INTERNATIONAL">Internasional</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Issuer</label>
              <input v-model="form.standard_issuer" type="text" class="input-field" placeholder="e.g., BNSP, City&Guilds" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Tipe Sertifikat</label>
              <input v-model="form.certificate_type" type="text" class="input-field" placeholder="e.g., Kompetensi, Partisipasi" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Standar Kompetensi</label>
              <input v-model="form.competency_standard" type="text" class="input-field" placeholder="Nama standar kompetensi" />
            </div>
          </div>
        </div>

        <!-- Learning Outcomes & Tags -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Learning Outcomes & Tags
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Hasil Pembelajaran
                <span class="normal-case tracking-normal font-normal text-surface-400">(pisahkan dengan baris baru)</span>
              </label>
              <textarea :value="form.learning_outcomes.join('\n')" @input="form.learning_outcomes = ($event.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)" rows="4" class="input-field resize-none" placeholder="Setiap baris satu hasil pembelajaran"></textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
                Tags
                <span class="normal-case tracking-normal font-normal text-surface-400">(pisahkan dengan koma)</span>
              </label>
              <input :value="form.tags.join(', ')" @input="form.tags = ($event.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)" type="text" class="input-field" placeholder="caregiver, lansia, kesehatan" />
            </div>
          </div>
        </div>

        <!-- Media -->
        <div class="card p-5 sm:p-6">
          <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
            <span class="w-1 h-4 rounded-full bg-indigo-500"></span>
            Media
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Thumbnail URL</label>
              <input v-model="form.thumbnail_url" type="url" class="input-field" placeholder="https://..." />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">Video URL</label>
              <input v-model="form.video_url" type="url" class="input-field" placeholder="https://..." />
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3">
          <button type="button" @click="router.push(`/programs/${route.params.id}`)"
            class="px-4 py-2.5 text-sm font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            Batal
          </button>
          <button type="submit" :disabled="saving || !canSubmit"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:cursor-not-allowed">
            <Loader2 v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" />
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BookOpen, Save, Loader2 } from 'lucide-vue-next'
import { useStaffApi } from '@/composables/useStaffApi'
import { useToast } from '@/composables/useToast'
import type { Program } from '@/stores/programs'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const program = ref<Program | null>(null)

const form = reactive({
  title: '',
  program_type: 'REGULER',
  level: '',
  personal_tier: 'starter',
  status: 'draft',
  description: '',
  short_description: '',
  prerequisites: '',
  duration_hours: 0,
  duration_weeks: 0,
  total_sessions: 0,
  max_participants: 30,
  total_jp: 0,
  price: 0,
  currency: 'IDR',
  location: '',
  language: 'id',
  standard_type: '',
  standard_issuer: '',
  certificate_type: '',
  competency_standard: '',
  learning_outcomes: [] as string[],
  tags: [] as string[],
  thumbnail_url: '',
  video_url: '',
})

const canSubmit = computed(() => form.title.trim())
const isPersonal = computed(() => form.program_type === 'PERSONAL')

const durationPreview = computed(() => {
  if (isPersonal.value) return 'Flexible'
  const parts: string[] = []
  if (form.duration_hours) parts.push(`${form.duration_hours} JP`)
  if (form.duration_weeks) parts.push(`${form.duration_weeks} Minggu`)
  if (form.total_sessions) parts.push(`${form.total_sessions}x Pertemuan`)
  return parts.length ? parts.join(' • ') : ''
})

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    loading.value = false
    return
  }

  try {
    const res: any = await useStaffApi(`/staff/programs/${id}`)
    const data = res?.data

    if (data?.program) {
      program.value = data.program
      const p = data.program
      const rawType = (p.program_type || p.type || '').toLowerCase()
      const typeMap: Record<string, string> = {
        regular: 'REGULER',
        reguler: 'REGULER',
        mentoring: 'MENTORING',
        personal: 'PERSONAL',
      }
      form.title = p.title || ''
      form.program_type = typeMap[rawType] || 'REGULER'
      form.level = p.level || ''
      form.personal_tier = p.personal_tier || 'starter'
      form.status = p.status || 'draft'
      form.description = p.description || ''
      form.short_description = p.short_description || ''
      form.prerequisites = p.prerequisites || ''
      form.duration_hours = p.duration_hours || 0
      form.duration_weeks = p.duration_weeks || 0
      form.total_sessions = p.total_sessions || 0
      form.max_participants = p.max_participants || 30
      form.total_jp = p.total_jp || 0
      form.price = p.price || 0
      form.currency = p.currency || 'IDR'
      form.location = p.location || ''
      form.language = p.language || 'id'
      form.standard_type = p.standard_type || ''
      form.standard_issuer = p.standard_issuer || ''
      form.certificate_type = p.certificate_type || ''
      form.competency_standard = p.competency_standard || ''
      form.learning_outcomes = p.learning_outcomes || []
      form.tags = p.tags || []
      form.thumbnail_url = p.thumbnail_url || ''
      form.video_url = p.video_url || ''
    } else {
      toast.error('Gagal', 'Program tidak ditemukan')
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat program'
    console.error('[Program Edit Error]', err)
    toast.error('Gagal', message)
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!canSubmit.value || saving.value) return

  saving.value = true
  try {
    const id = route.params.id as string
    const typeToSend: Record<string, string> = {
      REGULER: 'regular',
      MENTORING: 'mentoring',
      PERSONAL: 'personal',
    }
    const payload: Record<string, any> = {
      ...form,
      program_type: typeToSend[form.program_type] || form.program_type.toLowerCase(),
      type: typeToSend[form.program_type] || form.program_type.toLowerCase(),
    }

    if (isPersonal.value) {
      payload.level = ''
    } else {
      payload.personal_tier = ''
    }

    const res: any = await useStaffApi(`/staff/programs/${id}`, {
      method: 'PUT',
      body: payload,
    })

    if (res?.data) {
      toast.success('Program berhasil diupdate')
      router.push(`/programs/${id}`)
    } else {
      toast.error('Gagal', 'Gagal mengupdate program')
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengupdate program'
    console.error('[Program Update Error]', err)
    toast.error('Gagal', message)
  } finally {
    saving.value = false
  }
}
</script>
