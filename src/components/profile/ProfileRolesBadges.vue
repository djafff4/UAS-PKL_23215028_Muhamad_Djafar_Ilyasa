<template>
  <div class="card p-5 sm:p-6">
    <h3 class="text-sm font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
      <Shield :size="16" class="text-primary-500" />
      Roles & Akses
    </h3>

    <div v-if="hasRoles" class="space-y-3">
      <!-- Pillar Role -->
      <div v-if="pillarRole" class="flex items-center gap-2.5">
        <span class="text-[10px] font-black uppercase tracking-widest text-surface-400 w-14 flex-shrink-0">Pillar</span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-sm shadow-primary-500/20">
          <Shield :size="12" />
          {{ pillarRole.label || formatRoleName(pillarRole.name) }}
        </span>
      </div>

      <!-- Addon Roles -->
      <div v-if="addonRoles.length" class="flex items-start gap-2.5">
        <span class="text-[10px] font-black uppercase tracking-widest text-surface-400 w-14 flex-shrink-0 mt-1.5">Add-on</span>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="role in addonRoles"
            :key="role.id"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors"
            :class="addonColorClass(role.name)"
          >
            <component :is="addonIcon(role.name)" :size="11" />
            {{ role.label || formatRoleName(role.name) }}
          </span>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-surface-400 italic">Tidak ada role yang terdaftar</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Shield, Users, Megaphone, Wrench, BookOpen, BarChart3, Palette, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

interface Role {
  id: string
  name: string
  label: string
  category: 'pillar' | 'addon'
}

const allRoles = computed<Role[]>(() => auth.user?.roles || [])

const hasRoles = computed(() => allRoles.value.length > 0)

const pillarRole = computed(() =>
  allRoles.value.find((r) => r.category === 'pillar') || null
)

const addonRoles = computed(() =>
  allRoles.value.filter((r) => r.category === 'addon')
)

function formatRoleName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const addonColorMap: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
  instructor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
  digital_marketing: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/30',
  content_creator: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
  finance: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
  hr: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/30',
}

const fallbackAddonColors = [
  'bg-surface-50 text-surface-700 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700',
  'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800/30',
  'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30',
  'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800/30',
]

function addonColorClass(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, '_')
  return addonColorMap[key] || fallbackAddonColors[Math.abs(hashCode(key)) % fallbackAddonColors.length]
}

const addonIconMap: Record<string, typeof Settings> = {
  admin: Settings,
  instructor: BookOpen,
  digital_marketing: Megaphone,
  content_creator: Palette,
  finance: BarChart3,
  hr: Users,
}

function addonIcon(name: string): typeof Settings {
  const key = name.toLowerCase().replace(/\s+/g, '_')
  return addonIconMap[key] || Wrench
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
</script>
