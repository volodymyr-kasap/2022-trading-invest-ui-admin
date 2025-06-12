import { isEmpty, keys } from 'lodash-es'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const {
  VITE_APP_AUTH_REFRESH_THROTTLE_TTL,
  VITE_APP_AUTH_REFRESH_REPEATER_TTL,
} = import.meta.env

let lastRefreshTime

export const forceRefresh = async () => {
  const authStore = useAuthStore()

  const refreshToken = authStore.refreshToken
  const res = refreshToken && await authStore.refresh().catch(console.error)

  if (!res && refreshToken) {
    await authStore.signOut()

    return false
  }

  return true
}

export const refresh = () => {
  if (!lastRefreshTime || ((Date.now() - +VITE_APP_AUTH_REFRESH_THROTTLE_TTL) >= lastRefreshTime)) {
    lastRefreshTime = Date.now()

    return forceRefresh()
  }
}

export default {
  install () {
    const refreshLoop = async () => {
      const middlewareNames = !isEmpty(router.currentRoute?.value.meta?.middleware)
        ? keys(router.currentRoute?.value.meta?.middleware)
        : []

      if (
        await refresh() === false
        && !isEmpty(middlewareNames)
        && middlewareNames.includes('isAuth')
      ) {
        await router.push({ name: 'Auth' })
      }

      if (window['refreshTokenTimeout']) {
        clearTimeout(window['refreshTokenTimeout'])
      }
      window['refreshTokenTimeout'] = setTimeout(refreshLoop, +VITE_APP_AUTH_REFRESH_REPEATER_TTL)
    }

    if (window['refreshTokenTimeout']) {
      clearTimeout(window['refreshTokenTimeout'])
    }
    window['refreshTokenTimeout'] = setTimeout(refreshLoop, +VITE_APP_AUTH_REFRESH_REPEATER_TTL)
  },
}
