/**
 * Enhanced API client with auto-refresh token rotation
 * Replaces Nuxt $fetch with native fetch
 */
import { useAuthStore } from '@/stores/auth'

export const useApi = async (url: string, options: any = {}) => {
  const auth = useAuthStore()

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1'

  const execute = () => {
    const isFormData = options.body instanceof FormData
    return fetch(`${baseURL}${url}`, {
      method: options.method || 'GET',
      credentials: 'include',
      headers: {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
      body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
    }).then(async (res) => {
      if (!res.ok) {
        const error: any = new Error(`API Error: ${res.status}`)
        error.status = res.status
        error.response = res
        try {
          error.data = await res.json()
        } catch {}
        throw error
      }
      return res.json()
    })
  }

  try {
    return await execute()
  } catch (error: any) {
    const status = error?.status || error?.response?.status

    // Auto-refresh on 401, skip for auth endpoints to avoid loop
    if (status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login') && !url.includes('/auth/logout')) {
      const refreshed = await auth.refresh()
      if (refreshed) {
        return await execute()
      }
      auth.logout()
    }

    throw error
  }
}
