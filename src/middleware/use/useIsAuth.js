import { useAdminStore } from '@/stores/admin'

export const useIsAuth = (errorRedirectName) => {
  return async function isAuth ({ next, nextMiddleware }) {
    const adminStore = useAdminStore()
    const isAuthenticated = adminStore.auth

    if (!isAuthenticated) {
      return next({ name: errorRedirectName })
    }

    nextMiddleware()
  }
}
