<template>
  <div class="card p-5 sm:p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
        <User :size="16" class="text-primary-500" />
        Informasi Profil
      </h3>
      <span v-if="isDirty" class="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
        Belum disimpan
      </span>
    </div>

    <form @submit.prevent="handleSave" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Nama Lengkap -->
        <div class="sm:col-span-2">
          <label for="full_name" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Nama Lengkap <span class="text-red-400">*</span>
          </label>
          <input
            id="full_name"
            v-model="form.full_name"
            type="text"
            required
            placeholder="Masukkan nama lengkap"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-300 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <!-- Email (read-only) -->
        <div>
          <label for="email" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Email
          </label>
          <input
            id="email"
            :value="auth.user?.email"
            type="email"
            readonly
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-500 dark:text-surface-400 cursor-not-allowed"
          />
        </div>

        <!-- Telepon -->
        <div>
          <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Telepon
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-300 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <!-- Jenis Kelamin -->
        <div>
          <label for="gender" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Jenis Kelamin
          </label>
          <select
            id="gender"
            v-model="form.gender"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all appearance-none"
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <!-- Tanggal Lahir -->
        <div>
          <label for="date_of_birth" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Tanggal Lahir
          </label>
          <input
            id="date_of_birth"
            v-model="form.date_of_birth"
            type="date"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <!-- Tempat Lahir -->
        <div>
          <label for="birth_place" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Tempat Lahir
          </label>
          <input
            id="birth_place"
            v-model="form.birth_place"
            type="text"
            placeholder="Kota kelahiran"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-300 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <!-- Alamat -->
        <div>
          <label for="address" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Alamat
          </label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            placeholder="Alamat lengkap"
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-300 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <!-- Bio -->
        <div class="sm:col-span-2">
          <label for="bio" class="block text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
            Bio
          </label>
          <textarea
            id="bio"
            v-model="form.bio"
            rows="3"
            maxlength="250"
            placeholder="Ceritakan sedikit tentang diri Anda..."
            class="w-full px-3 py-2.5 text-sm font-medium bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-surface-100 placeholder:text-surface-300 dark:placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"
          />
          <p class="text-[10px] text-surface-400 mt-1 text-right">{{ (form.bio || '').length }}/250</p>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="saving || !isDirty || !form.full_name?.trim()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-200 dark:disabled:bg-surface-800 disabled:text-surface-400 text-white text-sm font-bold rounded-xl transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <Loader2 v-if="saving" :size="14" class="animate-spin" />
          <Save v-else :size="14" />
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { User, Save, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useApi } from '@/composables/useApi'

const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)

const form = reactive({
  full_name: '',
  phone: '',
  gender: '',
  date_of_birth: '',
  birth_place: '',
  address: '',
  bio: '',
})

const initialSnapshot = ref('')

function loadFromStore() {
  const p = auth.user?.profile
  const pd = auth.user?.participant_detail  // birth_place, address tersimpan di sini oleh backend
  form.full_name = p?.full_name || ''
  form.phone = auth.user?.phone || ''
  // Normalize gender: convert old "male"/"female" to "L"/"P"
  const rawGender = p?.gender || ''
  if (rawGender === 'male' || rawGender === 'L') {
    form.gender = 'L'
  } else if (rawGender === 'female' || rawGender === 'P') {
    form.gender = 'P'
  } else {
    form.gender = rawGender
  }
  form.date_of_birth = p?.date_of_birth || ''
  // birth_place & address: baca dari profile dulu, fallback ke participant_detail
  form.birth_place = p?.birth_place || pd?.birth_place || ''
  form.address = p?.address || pd?.address || ''
  form.bio = p?.bio || ''
  initialSnapshot.value = JSON.stringify({ ...form })
}

const isDirty = computed(() => JSON.stringify({ ...form }) !== initialSnapshot.value)

onMounted(() => {
  loadFromStore()
})

watch(() => auth.user, () => {
  if (!isDirty.value) loadFromStore()
}, { deep: true })

async function handleSave() {
  if (!form.full_name?.trim()) {
    toast.error('Validasi', 'Nama lengkap wajib diisi')
    return
  }
  if (saving.value) return
  saving.value = true

  try {
    const res = await useApi('/auth/profile', {
      method: 'PUT',
      body: {
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || undefined,
        gender: form.gender || undefined,
        birth_date: form.date_of_birth || undefined,  // backend membaca 'birth_date', bukan 'date_of_birth'
        birth_place: form.birth_place.trim() || undefined,
        address: form.address.trim() || undefined,
        bio: form.bio.trim() || undefined,
      },
    }) as { success?: boolean; data?: { user?: Record<string, unknown>; profile?: Record<string, unknown> }; message?: string }

    if (res?.success || res?.data) {
      // Refresh data dari server agar store sinkron dengan DB
      await auth.fetchMe()
      toast.success('Berhasil', 'Profil berhasil diperbarui')
      loadFromStore()
    } else {
      toast.error('Gagal', res?.message || 'Gagal memperbarui profil')
    }
  } catch (err: unknown) {
    const error = err as { data?: { message?: string }; message?: string }
    const msg = error?.data?.message || error?.message || 'Gagal memperbarui profil'
    toast.error('Gagal', msg)
  } finally {
    saving.value = false
  }
}
</script>
