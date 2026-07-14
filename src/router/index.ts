import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import DefaultLayout from '@/layouts/default.vue'
import LoginLayout from '@/layouts/login.vue'

const routes = [
  // Login (no auth required)
  {
    path: '/login',
    component: LoginLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/login.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },

  // Auth callback
  {
    path: '/auth/google/callback',
    name: 'auth-google-callback',
    component: () => import('@/pages/auth/google/callback.vue'),
    meta: { requiresAuth: false }
  },

  // Protected routes
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/pages/tasks/index.vue'),
      },
      {
        path: 'kpi',
        name: 'kpi',
        component: () => import('@/pages/kpi/index.vue'),
      },
      {
        path: 'meetings',
        name: 'meetings',
        component: () => import('@/pages/meetings/index.vue'),
      },
      {
        path: 'meetings/:id',
        name: 'meetings-detail',
        component: () => import('@/pages/meetings/[id].vue'),
      },
      {
        path: 'notes',
        name: 'notes',
        component: () => import('@/pages/notes/index.vue'),
      },
      {
        path: 'documents',
        name: 'documents',
        component: () => import('@/pages/documents/index.vue'),
      },
      {
        path: 'events',
        name: 'events',
        component: () => import('@/pages/events/index.vue'),
      },
      {
        path: 'events/create',
        name: 'events-create',
        component: () => import('@/pages/events/create.vue'),
      },
      {
        path: 'my-forms',
        name: 'my-forms',
        component: () => import('@/pages/events/my-forms.vue'),
      },
      {
        path: 'events/:id',
        name: 'events-detail',
        component: () => import('@/pages/events/[id].vue'),
      },
      {
        path: 'events/:id/edit',
        name: 'events-edit',
        component: () => import('@/pages/events/[id]-edit.vue'),
      },
      {
        path: 'events/form-templates',
        name: 'events-form-templates',
        component: () => import('@/pages/events/form-templates/index.vue'),
      },
      {
        path: 'events/form-templates/create',
        name: 'events-form-templates-create',
        component: () => import('@/pages/events/form-templates/create.vue'),
      },
      {
        path: 'events/form-templates/:id',
        name: 'events-form-templates-detail',
        component: () => import('@/pages/events/form-templates/[id].vue'),
      },
      {
        path: 'achievements',
        name: 'achievements',
        component: () => import('@/pages/achievements/index.vue'),
      },
      {
        path: 'keuangan',
        name: 'keuangan',
        component: () => import('@/pages/keuangan/index.vue'),
      },
      {
        path: 'e-library',
        name: 'e-library',
        component: () => import('@/pages/e-library/index.vue'),
      },
      {
        path: 'e-library/create',
        name: 'e-library-create',
        component: () => import('@/pages/e-library/create.vue'),
      },
      {
        path: 'e-library/:id',
        name: 'e-library-detail',
        component: () => import('@/pages/e-library/[id].vue'),
      },
      {
        path: 'roadmap',
        name: 'roadmap',
        component: () => import('@/pages/roadmap/index.vue'),
      },
      {
        path: 'workspace',
        name: 'workspace',
        component: () => import('@/pages/workspace/index.vue'),
      },
      {
        path: 'workspace/staff',
        name: 'workspace-staff',
        component: () => import('@/pages/workspace/staff/index.vue'),
      },
      {
        path: 'workspace/staff/:id',
        name: 'workspace-staff-detail',
        component: () => import('@/pages/workspace/staff/[id].vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/profile/index.vue'),
      },
      {
        path: 'profile/cv',
        name: 'profile-cv',
        component: () => import('@/pages/profile/cv.vue'),
      },
      {
        path: 'profile/cv/create',
        name: 'profile-cv-create',
        component: () => import('@/pages/profile/cv/create.vue'),
      },
      {
        path: 'profile/cv/:id',
        name: 'profile-cv-detail',
        component: () => import('@/pages/profile/cv/[id].vue'),
      },
      {
        path: 'participants',
        name: 'participants',
        component: () => import('@/pages/participants/index.vue'),
      },
      {
        path: 'programs',
        name: 'programs',
        component: () => import('@/pages/programs/index.vue'),
      },
      {
        path: 'programs/:id',
        name: 'programs-detail',
        component: () => import('@/pages/programs/[id].vue'),
      },
      {
        path: 'programs/:id/edit',
        name: 'programs-edit',
        component: () => import('@/pages/programs/[id]/edit.vue'),
      },
      {
        path: 'instructors',
        name: 'instructors',
        component: () => import('@/pages/instructors/index.vue'),
      },
      {
        path: 'corporate',
        name: 'corporate',
        component: () => import('@/pages/corporate/index.vue'),
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/pages/reports/index.vue'),
      },
      {
        path: 'standards',
        name: 'standards',
        component: () => import('@/pages/standards/index.vue'),
      },
      {
        path: 'partners',
        name: 'partners',
        component: () => import('@/pages/partners/index.vue'),
      },
      {
        path: 'tools',
        name: 'tools',
        component: () => import('@/pages/tools/index.vue'),
      },
      {
        path: 'tools/merge-pdf',
        name: 'tools-merge-pdf',
        component: () => import('@/pages/tools/merge-pdf.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/settings.vue'),
      },
    ],
  },

  // Public pages
  {
    path: '/e/:short_code',
    name: 'event-landing',
    component: () => import('@/pages/public/e/[short_code].vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/cv/:id',
    name: 'public-cv',
    component: () => import('@/pages/public/cv/[id].vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/verify/:contract',
    name: 'verify-contract',
    component: () => import('@/pages/public/verify/[contract].vue'),
    meta: { requiresAuth: false },
  },

  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/error.vue'),
    meta: { requiresAuth: false }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth guard
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  if (!auth.isInitialized) {
    await auth.init()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && auth.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
