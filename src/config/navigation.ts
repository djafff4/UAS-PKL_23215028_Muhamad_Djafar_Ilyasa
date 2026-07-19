import type { Component } from 'vue'
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  CalendarDays,
  User,
  Users,
} from 'lucide-vue-next'

export interface NavItem {
  label: string
  to: string
  icon: Component
  exact?: boolean
  condition?: (auth: any) => boolean
}

export interface NavGroup {
  type: 'group'
  label: string
  icon: Component
  children: NavItem[]
  condition?: (auth: any) => boolean
  defaultExpanded?: boolean
}

export interface NavSection {
  label: string
  items: (NavItem | NavGroup)[]
  condition?: (auth: any) => boolean
}

export interface NavConfig {
  primary: NavItem[]
  sections: NavSection[]
}

export function getNavConfig(_auth: any): NavConfig {
  return {
    // Flat items always visible — most-used pages
    primary: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard, exact: true },
      { label: 'Task Management', to: '/tasks', icon: CheckSquare },
      { label: 'Keuangan', to: '/keuangan', icon: Wallet },
      { label: 'Meeting', to: '/meetings', icon: CalendarDays },
    ],

    // Grouped by domain
    sections: [
      {
        label: 'Workspace',
        items: [
          {
            type: 'group',
            label: 'Staff',
            icon: Users,
            condition: (a) => a.canManageStaff,
            defaultExpanded: false,
            children: [
              { label: 'Staff Management', to: '/workspace/staff', icon: Users },
            ],
          },
        ],
      },
      {
        label: 'Akun',
        items: [
          { label: 'Profil Saya', to: '/profile', icon: User, exact: true },
        ],
      },
    ],
  }
}
