<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex items-center gap-4">
        <RouterLink :to="'/profile/cv'" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
          <ArrowLeft :size="18" />
        </RouterLink>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">{{ cv?.title || 'Detail CV' }}</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Preview dan export CV Anda</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <Loader2 :size="32" class="animate-spin text-primary-500" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!cv" class="card p-12 text-center">
      <p class="text-surface-400">CV tidak ditemukan</p>
      <RouterLink :to="'/profile/cv'" class="text-primary-500 text-sm font-semibold mt-2 inline-block">Kembali</RouterLink>
    </div>

    <!-- Detail -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-3">
        <!-- Quick Info -->
        <div class="card p-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100">Ringkasan CV</h3>
            <div class="flex items-center gap-2">
              <RouterLink v-if="canEdit" :to="`/profile/cv/create?id=${cv.id}`" class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700">
                <Pencil :size="12" />
                Edit
              </RouterLink>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><span class="text-surface-400 text-xs block">Nama</span><span class="font-semibold">{{ cv.full_name || '-' }}</span></div>
            <div><span class="text-surface-400 text-xs block">Email</span><span class="font-semibold">{{ cv.email || '-' }}</span></div>
            <div><span class="text-surface-400 text-xs block">Phone</span><span class="font-semibold">{{ cv.phone || '-' }}</span></div>
            <div><span class="text-surface-400 text-xs block">Template</span><span class="font-semibold capitalize">{{ cv.template }}</span></div>
            <div class="col-span-2"><span class="text-surface-400 text-xs block">Dibuat</span><span class="font-semibold">{{ formatDate(cv.created_at) }}</span></div>
          </div>

          <!-- Change Owner (Dirut Only) -->
          <div v-if="auth.isDirut" class="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">Pemilik CV</label>
              <button v-if="ownerChanged" @click="saveOwner" :disabled="savingOwner"
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white text-[11px] font-bold rounded-lg transition-all">
                <Loader2 v-if="savingOwner" :size="12" class="animate-spin" />
                <Save v-else :size="12" />
                {{ savingOwner ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
            <select v-model="selectedOwner" class="w-full px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all">
              <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
                {{ staff.full_name }} ({{ staff.email }})
              </option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-3">
          <div class="card p-3 text-center">
            <p class="text-lg font-bold text-primary-600">{{ (cv.education || []).length }}</p>
            <p class="text-[10px] text-surface-400">Pendidikan</p>
          </div>
          <div class="card p-3 text-center">
            <p class="text-lg font-bold text-primary-600">{{ (cv.experience || []).length }}</p>
            <p class="text-[10px] text-surface-400">Pengalaman</p>
          </div>
          <div class="card p-3 text-center">
            <p class="text-lg font-bold text-primary-600">{{ (cv.skills || []).length }}</p>
            <p class="text-[10px] text-surface-400">Keahlian</p>
          </div>
          <div class="card p-3 text-center">
            <p class="text-lg font-bold text-primary-600">{{ (cv.certifications || []).length }}</p>
            <p class="text-[10px] text-surface-400">Sertifikasi</p>
          </div>
        </div>
      </div>

      <!-- Preview + Export -->
      <div class="lg:col-span-2">
        <div class="lg:sticky lg:top-[88px] space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-surface-500">Preview & Export</h3>
          <CvPreview :cv="cv" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Pencil, Loader2, Save } from 'lucide-vue-next'
import { useCvStore } from '@/stores/cv'
import { useAuthStore } from '@/stores/auth'
import { useStaffManagementStore } from '@/stores/staffManagement'
import { useToast } from '@/composables/useToast'
import { useApi } from '@/composables/useApi'
import CvPreview from '@/components/cv/CvPreview.vue'
import type { CV } from '@/types'

const route = useRoute()
const cvStore = useCvStore()
const auth = useAuthStore()
const staffStore = useStaffManagementStore()
const toast = useToast()

const cv = ref<CV | null>(null)
const loading = ref(true)
const selectedOwner = ref('')
const savingOwner = ref(false)

const staffList = computed(() => staffStore.staffList)

const ownerChanged = computed(() => {
  return cv.value && selectedOwner.value !== cv.value.user_id
})

const canEdit = computed(() => {
  return cv.value && (auth.user?.id === cv.value.user_id || auth.isDirut)
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    const result = await cvStore.fetchCv(id)
    if (result) {
      cv.value = result
      selectedOwner.value = result.user_id || ''
    }
  }
  // Fetch staff list for dirut
  if (auth.isDirut) {
    staffStore.fetchStaff()
  }
  loading.value = false
})

async function saveOwner() {
  if (!cv.value || !selectedOwner.value) return
  savingOwner.value = true
  try {
    const res: any = await useApi(`/staff/cv/${cv.value.id}/owner`, {
      method: 'PUT',
      body: { user_id: selectedOwner.value },
    })
    if (res.success) {
      cv.value.user_id = selectedOwner.value
      toast.success('Berhasil', 'Pemilik CV berhasil diubah')
    } else {
      throw new Error(res.message || 'Gagal mengubah pemilik')
    }
  } catch (err: any) {
    toast.error('Gagal', err.message || 'Gagal mengubah pemilik CV')
    // Revert
    if (cv.value) selectedOwner.value = cv.value.user_id || ''
  } finally {
    savingOwner.value = false
  }
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
</script>
