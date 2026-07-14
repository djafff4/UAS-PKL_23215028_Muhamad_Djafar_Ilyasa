<template>
  <!-- Desktop header -->
  <div class="flex items-center shrink-0 px-4 lg:px-5 h-16 lg:h-[72px] border-b border-surface-200/50 dark:border-surface-800/30 transition-all duration-300"
    :class="collapsed ? 'justify-center px-0' : ''">
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary-500/20 ring-1 ring-white/10">
        <img :src="logo" alt="AKMAN Logo" class="w-full h-full object-cover" />
      </div>
      <div v-if="!collapsed" class="min-w-0">
        <h1 class="text-sm lg:text-base font-bold text-surface-900 dark:text-surface-100 tracking-tight truncate">AKMAN</h1>
        <p class="text-[10px] lg:text-[11px] font-medium text-surface-400 dark:text-surface-500 truncate tracking-wide">Internal Workspace</p>
      </div>
    </div>
  </div>

  <!-- Divisi context bar (compact — 1 line) -->
  <div v-if="!collapsed" class="shrink-0 px-4 lg:px-5 py-1.5 border-b border-surface-200/50 dark:border-surface-800/30">
    <div class="flex items-center gap-2">
      <div class="w-1 h-4 rounded-full bg-primary-500" />
      <span class="text-xs font-medium text-surface-500 dark:text-surface-400 truncate">{{ auth.userDepartment || 'Divisi' }}</span>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 py-2 lg:py-3 overflow-y-auto overflow-x-hidden sidebar-scroll"
    :class="collapsed ? 'px-2 space-y-0.5' : 'px-3 lg:px-4 space-y-0.5'">

    <!-- ═══ Primary (flat, always visible) ═══ -->
    <SidebarNavItem
      v-for="item in primaryItems"
      :key="item.to"
      :item="item"
      :active="isActive(item.to, item.exact)"
      :collapsed="collapsed"
      :mobile="mobile"
      @navigate="$emit('navigate')"
    />

    <!-- ═══ Sectioned groups ═══ -->
    <template v-for="section in sectionedItems" :key="section.label">
      <SidebarNavSection :label="section.label" :collapsed="collapsed" />

      <template v-for="entry in section.items" :key="'si-' + entry.label">
        <!-- Flat item -->
        <SidebarNavItem
          v-if="!(entry as any).type"
          :item="entry as NavItem"
          :active="isActive((entry as NavItem).to, (entry as NavItem).exact)"
          :collapsed="collapsed"
          :mobile="mobile"
          @navigate="$emit('navigate')"
        />
        <!-- Group -->
        <SidebarNavGroup
          v-else
          :label="(entry as NavGroup).label"
          :icon="(entry as NavGroup).icon"
          :children="(entry as NavGroup).children"
          :expanded="expandedGroups[(entry as NavGroup).label] ?? (entry as NavGroup).defaultExpanded ?? false"
          :active="isGroupActive((entry as NavGroup).children)"
          :collapsed="collapsed"
          :mobile="mobile"
          @toggle="toggleGroup((entry as NavGroup).label)"
          @navigate="$emit('navigate')"
        />
      </template>
    </template>
  </nav>

  <!-- CTA: Buat Task Baru -->
  <div v-if="!collapsed" class="shrink-0 px-3 lg:px-4 pb-2">
    <button
      @click="router.push('/tasks')"
      class="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-primary-500/20 active:scale-[0.98]"
    >
      <Plus :size="16" />
      <span>Buat Task Baru</span>
    </button>
  </div>

  <!-- User area + logout -->
  <div class="shrink-0 border-t border-surface-200/50 dark:border-surface-800/30 transition-all duration-300"
    :class="collapsed ? 'py-2 px-2' : 'p-3 lg:p-4'">

    <!-- User brief (expanded only) -->
    <div v-if="!collapsed" class="flex items-center gap-2.5 mb-2 px-1">
      <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold ring-2 ring-white dark:ring-surface-950 shrink-0">
        <img v-if="auth.user?.profile?.avatar_url" :src="auth.user.profile.avatar_url" class="w-full h-full object-cover" />
        <span v-else>{{ displayName.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{{ displayName }}</p>
        <p class="text-[10px] font-medium text-surface-400 dark:text-surface-500 capitalize truncate">{{ auth.pillar === 'staff' ? 'Staff' : auth.pillar }}</p>
      </div>
      <RouterLink to="/settings" @click="mobile && $emit('navigate')"
        class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
        <Settings :size="14" />
      </RouterLink>
    </div>

    <!-- Logout -->
    <button @click="auth.logout"
      class="group flex items-center rounded-xl font-medium transition-all duration-200 w-full"
      :class="collapsed
        ? 'justify-center h-11 w-11 mx-auto text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
        : 'gap-3 px-3.5 py-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'">
      <LogOut :size="20" class="shrink-0 transition-transform group-hover:scale-105" />
      <transition name="fade-label">
        <span v-if="!collapsed" class="text-sm">Keluar</span>
      </transition>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Settings, LogOut, Plus } from 'lucide-vue-next'
import logo from '@/assets/img/logo.jpeg'
import { useAuthStore } from '@/stores/auth'
import { getNavConfig, type NavItem, type NavGroup } from '@/config/navigation'
import SidebarNavItem from '@/components/sidebar/SidebarNavItem.vue'
import SidebarNavSection from '@/components/sidebar/SidebarNavSection.vue'
import SidebarNavGroup from '@/components/sidebar/SidebarNavGroup.vue'

const props = defineProps<{ mobile?: boolean; collapsed?: boolean }>()
defineEmits<{ navigate: [] }>()

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const displayName = computed(() =>
  auth.user?.profile?.full_name || auth.user?.name || auth.user?.email?.split('@')[0] || 'Staff'
)

// ── Navigation config ──
const navConfig = computed(() => getNavConfig(auth))

const primaryItems = computed(() => navConfig.value.primary)

const sectionedItems = computed(() =>
  navConfig.value.sections
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => {
        if ('condition' in item && item.condition) return item.condition(auth)
        return true
      }) as (NavItem | NavGroup)[],
    }))
    .filter((s) => s.items.length > 0)
)

// ── Group expansion state ──
const expandedGroups = ref<Record<string, boolean>>({})

function toggleGroup(label: string) {
  expandedGroups.value[label] = !expandedGroups.value[label]
}

// ── Active detection ──
function isActive(to: string, exact?: boolean) {
  if (to === '/') return route.path === '/'
  if (exact) return route.path === to
  return route.path.startsWith(to)
}

function isGroupActive(children: { to: string }[]) {
  return children.some((c) => route.path.startsWith(c.to))
}
</script>

<style scoped>
.fade-label-enter-active, .fade-label-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-label-enter-from, .fade-label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
