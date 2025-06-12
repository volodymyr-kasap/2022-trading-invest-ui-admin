import { useAdminStore } from '@/stores/admin'
import { useAuthStore } from '@/stores/auth'

export const useFetchMe = () => {
  return async function fetchMe ({ nextMiddleware }) {
    const adminStore = useAdminStore()
    const authStore = useAuthStore()

    const isAuthenticated = adminStore.auth
    const accessToken = authStore.accessToken

    if (accessToken && !isAuthenticated) {
      try {
        await adminStore.fetch()
      } catch (error) {
        console.error(error)
        await authStore.signOut()
      }
    }

    nextMiddleware()
  }
}
