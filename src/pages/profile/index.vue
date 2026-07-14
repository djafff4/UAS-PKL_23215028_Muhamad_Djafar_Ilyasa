<template>
  <div class="space-y-6">
    <!-- Profile Hero Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900">
      <!-- Decorative BG -->
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-400/10 blur-[60px]"></div>
      <div class="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-300/5 blur-[40px]"></div>

      <div class="relative z-10 p-5 sm:p-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <!-- Avatar -->
          <ProfileAvatarCard />

          <!-- Info -->
          <div class="text-center sm:text-left flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">{{ displayName }}</h1>
            <p class="text-sm text-white/70 mt-0.5 font-medium">{{ userPosition }}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span v-if="department" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 backdrop-blur-sm">
                <Building2 :size="12" />
                {{ department }}
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                :class="isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'">
                <component :is="isActive ? CircleCheck : CircleX" :size="12" />
                {{ isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
              <span v-if="joinDate" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 backdrop-blur-sm">
                <Calendar :size="12" />
                Bergabung {{ joinDate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main -->
      <div class="lg:col-span-2 space-y-6">
        <ProfileInfoCard />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="lg:sticky lg:top-6 space-y-6">
          <ProfileStaffDetail />
          <ProfileRolesBadges />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Building2, Calendar, CircleCheck, CircleX } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ProfileAvatarCard from '@/components/profile/ProfileAvatarCard.vue'
import ProfileInfoCard from '@/components/profile/ProfileInfoCard.vue'
import ProfileStaffDetail from '@/components/profile/ProfileStaffDetail.vue'
import ProfileRolesBadges from '@/components/profile/ProfileRolesBadges.vue'

const auth = useAuthStore()

const displayName = computed(() =>
  auth.user?.profile?.full_name || auth.user?.name || auth.user?.email?.split('@')[0] || 'Staff'
)

const userPosition = computed(() =>
  auth.user?.staff_detail?.position || auth.user?.currentRoleName || auth.user?.pillar
)

const department = computed(() =>
  auth.user?.staff_detail?.department || ''
)

const isActive = computed(() =>
  auth.user?.is_active ?? true
)

const joinDate = computed(() => {
  const raw = auth.user?.staff_detail?.join_date
  if (!raw) return ''
  try {
    return new Date(raw).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return raw
  }
})
</script>
