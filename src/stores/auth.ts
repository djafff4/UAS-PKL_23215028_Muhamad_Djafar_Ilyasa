import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import router from '@/router'

/** Safe localStorage read */
function getStored<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        try { return JSON.parse(raw) } catch { return raw as unknown as T }
      }
    }
  } catch { /* localStorage unavailable */ }
  return fallback
}

/** Safe localStorage write */
function setStored(key: string, value: any) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    }
  } catch { /* quota exceeded or unavailable */ }
}

/** Safe localStorage remove */
function removeStored(key: string) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch { /* ignored */ }
}

/** Parse backend roles into pillar + addons */
function parseUserRoles(roles: any[] = []) {
  let pillar = 'student'
  const addons: string[] = []

  roles.forEach((r: any) => {
    const name = (typeof r === 'string' ? r : r.name).toLowerCase()
    const category = r.category || ''
    if (category === 'pillar') {
      pillar = name
    } else {
      addons.push(name)
    }
  })

  return { pillar, addons }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(getStored('staff_auth_user', null))
  const token = ref<string | null>(null)
  const pillar = ref(getStored('staff_auth_pillar', 'student'))
  const addons = ref<string[]>(getStored('staff_auth_addons', []))
  const loading = ref(false)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const isStaff = computed(() =>
    pillar.value === 'staff' ||
    ['admin', 'direktur', 'instructor', 'digital_marketing'].some(r => addons.value.includes(r))
  )

  const userDepartment = computed(() => user.value?.staff_detail?.department || '')
  const userPosition = computed(() => user.value?.staff_detail?.position || '')
  const hasGlobalAccess = computed(() => userPosition.value.toLowerCase() === 'direktur utama')

  const isDirekturOrKepala = computed(() => {
    const pos = userPosition.value.toLowerCase()
    return pos.includes('direktur') || pos.includes('kepala')
  })

  const canManageStaff = computed(() => hasGlobalAccess.value)

  const canManageRoadmap = computed(() => hasGlobalAccess.value || isDirekturOrKepala.value)

  const isDirut = computed(() => userPosition.value.toLowerCase() === 'direktur utama')

  const isDirekturTeknologi = computed(() =>
    userPosition.value === 'Direktur Teknologi' || userPosition.value === 'Direktur TIK'
  )

  const isAkademik = computed(() =>
    userPosition.value.toLowerCase().includes('akademik') ||
    userDepartment.value.toLowerCase() === 'akademik'
  )

  const isKepalaDivisi = computed(() => {
    const pos = userPosition.value.toLowerCase()
    return pos.includes('kepala') && !pos.includes('direktur')
  })

  const canManageOwnDeptStaff = computed(() =>
    isDirekturOrKepala.value && !hasGlobalAccess.value
  )

  const canViewAllDivisions = computed(() => hasGlobalAccess.value)

  const canViewOwnDivision = computed(() =>
    !hasGlobalAccess.value && !!userDepartment.value
  )

  const dashboardScope = computed<'all' | 'own'>(() =>
    hasGlobalAccess.value ? 'all' : 'own'
  )

  /** Save auth data to state + localStorage */
  function setAuthData(userData: any, accessToken: string) {
    token.value = accessToken
    setStored('staff_auth_token', accessToken)

    if (!userData) return

    const { pillar: p, addons: a } = parseUserRoles(userData.roles || [])
    user.value = userData
    pillar.value = p
    addons.value = a

    setStored('staff_auth_user', userData)
    setStored('staff_auth_pillar', p)
    setStored('staff_auth_addons', a)
  }

  /** Clear all auth state + localStorage */
  function clearAuthState() {
    token.value = null
    user.value = null
    pillar.value = 'student'
    addons.value = []

    removeStored('staff_auth_token')
    removeStored('staff_auth_user')
    removeStored('staff_auth_pillar')
    removeStored('staff_auth_addons')
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const res: any = await useApi('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (!res.success) {
        throw new Error(res.message || 'Login gagal')
      }

      setAuthData(res.data.user, res.data.token)

      if (!isStaff.value) {
        clearAuthState()
        throw new Error('Akses ditolak: Hanya untuk Staff Akman.')
      }

      return res.data
    } catch (err: any) {
      clearAuthState()
      throw new Error(err.message || err.data?.message || 'Login gagal')
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    try {
      const res: any = await useApi('/auth/refresh', { method: 'POST' })
      if (res.success && res.data?.token) {
        token.value = res.data.token
        setStored('staff_auth_token', res.data.token)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function fetchMe() {
    try {
      const res: any = await useApi('/auth/me')
      if (res.success) {
        setAuthData(res.data, token.value!)
        if (!isStaff.value) {
          clearAuthState()
          return false
        }
        return true
      }
    } catch {
      clearAuthState()
    }
    return false
  }

  async function init() {
    if (isInitialized.value) return
    loading.value = true

    const storedToken = getStored<string | null>('staff_auth_token', null)

    if (storedToken) {
      token.value = storedToken
      const ok = await fetchMe()
      if (!ok) {
        const refreshed = await refresh()
        if (refreshed) await fetchMe()
      }
    } else {
      const success = await refresh()
      if (success) await fetchMe()
    }

    if (!token.value) clearAuthState()

    isInitialized.value = true
    loading.value = false
  }

  async function logout() {
    try {
      await useApi('/auth/logout', { method: 'POST' })
    } catch { /* ignore */ }

    clearAuthState()
    router.push('/login')
  }

  return {
    user, token, pillar, addons,
    loading, isInitialized,
    isAuthenticated, isStaff, userDepartment, userPosition, hasGlobalAccess, isDirekturOrKepala, canManageStaff, canManageRoadmap,
    isDirut, isDirekturTeknologi, isAkademik, isKepalaDivisi,
    canManageOwnDeptStaff, canViewAllDivisions, canViewOwnDivision, dashboardScope,
    login, refresh, fetchMe, init, logout,
    setAuthData, clearAuthState,
  }
})
