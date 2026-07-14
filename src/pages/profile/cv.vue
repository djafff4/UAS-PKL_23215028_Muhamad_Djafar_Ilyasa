<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 p-5 sm:p-6">
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white tracking-tight">Curriculum Vitae</h1>
          <p class="text-sm text-white/60 mt-1 font-medium">Buat dan kelola CV dengan template Akman Academy</p>
        </div>
        <RouterLink :to="'/profile/cv/create'" class="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all backdrop-blur-sm">
          <Plus :size="14" />
          Buat CV Baru
        </RouterLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <Loader2 :size="32" class="animate-spin text-primary-500" />
    </div>

    <!-- Empty State -->
    <div v-else-if="cvStore.cvs.length === 0" class="card p-12 text-center">
      <FileText :size="48" class="mx-auto text-surface-300 mb-4" />
      <h3 class="text-base font-bold text-surface-600 dark:text-surface-300 mb-2">Belum ada CV</h3>
      <p class="text-sm text-surface-400 mb-6 max-w-sm mx-auto">Buat CV profesional pertama Anda dengan template Akman Academy. Data akan terisi otomatis dari profil Anda.</p>
      <RouterLink :to="'/profile/cv/create'" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all">
        <Plus :size="16" />
        Buat CV Baru
      </RouterLink>
    </div>

    <!-- CV List — Mini real template previews -->
    <div v-else ref="gridRef" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="item in cvStore.cvs" :key="item.id"
        class="group cursor-pointer relative"
        @click="viewCv(item.id)">

        <!-- Template badge (floats above the card, not clipped by overflow-hidden) -->
        <div class="absolute -top-2.5 right-3 z-20">
          <span :class="[
            'inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase shadow-sm',
            item.template === 'akman-academy' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' :
            item.template === 'executive' ? 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300' :
            item.template === 'modern' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
            item.template === 'akman-corporate' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' :
            item.template === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          ]">
            {{ templateLabel(item.template) }}
          </span>
        </div>

        <!-- Mini paper card -->
        <div class="bg-white dark:bg-surface-800 rounded-xl overflow-hidden shadow-md shadow-surface-200/60 dark:shadow-black/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-surface-300/50 dark:group-hover:shadow-black/30 group-hover:-translate-y-1">

          <!-- Scaled CV template preview (actual template components) -->
          <div class="cv-thumb-wrap">
            <div class="cv-thumb-scaler" :style="{ transform: `scale(${thumbScale})`, WebkitTransform: `scale(${thumbScale})` }">
              <CvTemplateModern v-if="item.template === 'modern'" :cv="item" />
              <CvTemplateAkman v-else-if="item.template === 'akman-academy'" :cv="item" />
              <CvTemplateAkmanCorporate v-else-if="item.template === 'akman-corporate'" :cv="item" />
              <CvTemplateExecutive v-else-if="item.template === 'executive'" :cv="item" />
              <CvTemplateMinimalist v-else-if="item.template === 'minimalist'" :cv="item" />
              <CvTemplateCreative v-else :cv="item" />
            </div>
          </div>

          <!-- Footer: date + delete -->
          <div class="flex items-center justify-between px-3 py-2 border-t border-surface-100 dark:border-surface-700/60 bg-white dark:bg-surface-800">
            <span class="text-[10px] text-surface-400 dark:text-surface-500">{{ formatDate(item.updated_at) }}</span>
            <button v-if="canDelete(item)" @click.stop="deleteCv(item.id)"
              class="p-1 rounded-md text-surface-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 :size="12" />
            </button>
          </div>
        </div>

        <!-- Creator credit bar -->
        <div v-if="item.creator_name" class="mt-2 flex items-center gap-2 px-1">
          <div class="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white text-[8px] font-bold shrink-0">
            <img v-if="item.creator_avatar" :src="item.creator_avatar" class="w-full h-full object-cover" />
            <span v-else>{{ getInitials(item.creator_name) }}</span>
          </div>
          <span class="text-[10px] font-medium text-surface-400 dark:text-surface-500 truncate">{{ item.creator_name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, FileText, Loader2, Trash2 } from 'lucide-vue-next'
import { useCvStore } from '@/stores/cv'
import { useAuthStore } from '@/stores/auth'
import CvTemplateModern from '@/components/cv/CvTemplateModern.vue'
import CvTemplateAkman from '@/components/cv/CvTemplateAkman.vue'
import CvTemplateAkmanCorporate from '@/components/cv/CvTemplateAkmanCorporate.vue'
import CvTemplateExecutive from '@/components/cv/CvTemplateExecutive.vue'
import CvTemplateMinimalist from '@/components/cv/CvTemplateMinimalist.vue'
import CvTemplateCreative from '@/components/cv/CvTemplateCreative.vue'

const router = useRouter()
const cvStore = useCvStore()
const auth = useAuthStore()
const loading = computed(() => cvStore.loading)

const gridRef = ref<HTMLElement | null>(null)
const thumbScale = ref(0.35)
let resizeObs: ResizeObserver | null = null

function updateScale() {
  if (!gridRef.value) return
  const w = gridRef.value.clientWidth
  // Determine columns from responsive grid
  const breakSm = 640
  const breakLg = 1024
  const cols = w >= breakLg ? 3 : w >= breakSm ? 2 : 1
  // gap-5 = 20px between columns
  const gaps = (cols - 1) * 20
  const cardW = (w - gaps) / cols
  // Inner content width is card width minus ~2px for border/internal spacing
  const innerW = cardW - 2
  thumbScale.value = Math.min(innerW / 794, 0.45)
}

onMounted(async () => {
  await cvStore.fetchCvs()
  await nextTick()
  updateScale()
  if (gridRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObs = new ResizeObserver(updateScale)
    resizeObs.observe(gridRef.value)
  }
})

onUnmounted(() => {
  resizeObs?.disconnect()
})

function getInitials(name: string) {
  const parts = name.split(' ')
  return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

function templateLabel(template: string) {
  const map: Record<string, string> = {
    'akman-academy': 'Akman Academy',
    'akman-corporate': 'Akman Corp',
    executive: 'Executive',
    modern: 'Modern',
    minimalist: 'Minimalist',
    creative: 'Creative',
  }
  return map[template] || 'Modern'
}

function viewCv(id: string) {
  router.push(`/profile/cv/${id}`)
}

function canDelete(item: any) {
  return auth.user?.id === item.user_id || auth.isDirut
}

function deleteCv(id: string) {
  if (confirm('Hapus CV ini?')) cvStore.deleteCv(id)
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.cv-thumb-wrap {
  position: relative;
  overflow: hidden;
  background: white;
  aspect-ratio: 210 / 297;
}

.dark .cv-thumb-wrap {
  background: white; /* CV paper is always white */
}

.cv-thumb-scaler {
  position: absolute;
  top: 0;
  left: 0;
  width: 794px;
  transform-origin: top left;
}
</style>
