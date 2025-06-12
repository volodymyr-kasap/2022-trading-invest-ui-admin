import { useAdminStore } from '@/stores/admin'

export const useRedirectIfAuthenticated = (successRedirectName) => {
  return async ({ next, nextMiddleware }) => {
    const adminStore = useAdminStore()
    const isAuthenticated = adminStore.auth

    if (isAuthenticated) {
      return next({ name: successRedirectName })
    }

    nextMiddleware()
  }
}
