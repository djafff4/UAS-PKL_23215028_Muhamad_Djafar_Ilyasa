<template>
  <div class="min-h-screen bg-surface-100 dark:bg-surface-900 flex items-start justify-center p-4 sm:p-8">
    <div v-if="loading" class="text-center mt-16">
      <div class="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-sm text-surface-400 font-medium">Memverifikasi dokumen...</p>
    </div>

    <div v-else-if="error" class="mt-16 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/30 p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <X :size="32" class="text-red-500" />
      </div>
      <h2 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Dokumen Tidak Ditemukan</h2>
      <p class="text-sm text-surface-500 dark:text-surface-400">Nomor kontrak tidak valid atau dokumen tidak terdaftar dalam sistem.</p>
      <p class="text-xs text-surface-400 mt-4">Nomor: {{ contractNumber }}</p>
    </div>

    <div v-else-if="contract" class="w-full max-w-md">
      <div class="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/30 overflow-hidden">
        <!-- Header -->
        <div class="bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center border-b border-emerald-100 dark:border-emerald-800/30">
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle :size="32" class="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 class="text-lg font-bold text-emerald-700 dark:text-emerald-300">Dokumen Terverifikasi</h2>
          <p class="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Dokumen ini valid dan terdaftar dalam sistem AKMAN Academy</p>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Nomor Kontrak</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ contract.contract_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Jenis</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ contract.contract_type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Karyawan</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ contract.staff_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Jabatan</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ contract.position }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Departemen</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ contract.department }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Status</span>
            <span class="inline-flex px-2 py-0.5 rounded-lg text-xs font-bold"
              :class="statusClass(contract.status)">
              {{ contract.status }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-surface-500">Berlaku</span>
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">
              {{ formatDate(contract.start_date) }} — {{ contract.end_date ? formatDate(contract.end_date) : 'Berkala' }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-surface-50 dark:bg-surface-900/50 border-t border-surface-200/50 dark:border-surface-700/30">
          <p class="text-xs text-surface-400 text-center">
            Diverifikasi pada {{ new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
      </div>

      <!-- Company Info -->
      <div class="text-center mt-6 mb-8">
        <p class="text-xs text-surface-400">PT Agsya Karya Manca — AKMAN Academy</p>
        <p class="text-xs text-surface-400 mt-1">Sistem Verifikasi Dokumen Internal</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { X, CheckCircle } from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const contractNumber = route.params.contract as string
const contract = ref<any>(null)
const loading = ref(true)
const error = ref(false)

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusClass(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'EXPIRED': return 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
    case 'DRAFT': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    default: return 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
  }
}

onMounted(async () => {
  try {
    const res: any = await useApi(`/verify/${contractNumber}`)
    if (res?.success && res?.data) {
      contract.value = res.data
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
