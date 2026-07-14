import type { Component } from 'vue'
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Building2,
  GraduationCap,
  BookOpen,
  Award,
  Users,
  UserCog,
  Handshake,
  Briefcase,
  CalendarDays,
  Map,
  PieChart,
  Wallet,
  FileText,
  StickyNote,
  Trophy,
  Calendar,
  ClipboardList,
  User,
  Settings,
  Wrench,
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
      { label: 'KPI Monitoring', to: '/kpi', icon: BarChart3 },
      { label: 'Meeting', to: '/meetings', icon: CalendarDays },
    ],

    // Grouped by domain
    sections: [
      {
        label: 'Manajemen',
        items: [
          {
            type: 'group',
            label: 'Pelatihan',
            icon: GraduationCap,
            defaultExpanded: true,
            children: [
              { label: 'Program', to: '/programs', icon: BookOpen, exact: true },
              { label: 'Standar Kompetensi', to: '/standards', icon: Award },
              { label: 'E-Library', to: '/e-library', icon: BookOpen },
            ],
          },
          {
            type: 'group',
            label: 'Pengguna',
            icon: Users,
            defaultExpanded: false,
            children: [
              { label: 'Peserta', to: '/participants', icon: GraduationCap, exact: true },
              { label: 'Instruktur', to: '/instructors', icon: UserCog },
              { label: 'LPK Mitra', to: '/partners', icon: Handshake },
              { label: 'Corporate/B2B', to: '/corporate', icon: Briefcase },
            ],
          },
          {
            type: 'group',
            label: 'Keuangan',
            icon: PieChart,
            defaultExpanded: false,
            children: [
              { label: 'Keuangan', to: '/keuangan', icon: Wallet, exact: true },
              { label: 'Laporan', to: '/reports', icon: PieChart },
            ],
          },
        ],
      },
      {
        label: 'Workspace',
        items: [
          { label: 'Workspace Divisi', to: '/workspace', icon: Building2, exact: true },
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
        label: 'Konten',
        items: [
          { label: 'Document Center', to: '/documents', icon: FileText },
          { label: 'Notes', to: '/notes', icon: StickyNote },
          { label: 'Roadmap', to: '/roadmap', icon: Map },
          { label: 'Achievements', to: '/achievements', icon: Trophy },
          { label: 'Tools & Utilities', to: '/tools', icon: Wrench },
          { label: 'Curriculum Vitae', to: '/profile/cv', icon: FileText },
          {
            type: 'group',
            label: 'Events & Forms',
            icon: Calendar,
            defaultExpanded: false,
            children: [
              { label: 'Event List', to: '/events', icon: Calendar, exact: true },
              { label: 'Form Templates', to: '/events/form-templates', icon: ClipboardList },
            ],
          },
        ],
      },
      {
        label: 'Akun',
        items: [
          { label: 'Profil Saya', to: '/profile', icon: User, exact: true },
          { label: 'Pengaturan', to: '/settings', icon: Settings },
        ],
      },
    ],
  }
}
