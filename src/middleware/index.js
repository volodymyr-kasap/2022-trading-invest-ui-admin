import { isEmpty, isArray, isObject, values } from 'lodash-es'
import { refresh } from '@/plugins/refresh-token'
import { useFetchMe, useIsAuth, useRedirectIfAuthenticated } from './use'
import { useAuthStore } from '@/stores/auth'

const middlewarePipeline = (context, middleware, index) => {
  const nextMiddleware = middleware[index]

  if (!nextMiddleware) {
    return context.next
  }

  return () => {
    const nextPipeline = middlewarePipeline(
      context, middleware, index + 1,
    )

    nextMiddleware({ ...context, nextMiddleware: nextPipeline })
  }
}

export const initMiddlewareService = (callbacks = []) => {
  return async (to, from, next) => {
    const authStore = useAuthStore()

    const refreshToken = authStore.refreshToken

    if (refreshToken) {
      await refresh()
      await Promise.all(callbacks.map(async (call) => await call()))
    }

    if (isEmpty(to.meta?.middleware)) {
      return next()
    }

    let middlewares = []

    if (isArray(to.meta?.middleware)) {
      middlewares = to.meta.middleware
    }

    if (isObject(to.meta?.middleware)) {
      middlewares = values(to.meta.middleware)
    }

    const context = { to, from, next }
    const nextMiddleware = middlewarePipeline(context, middlewares, 1)

    return middlewares[0]({
      ...context,
      nextMiddleware,
    })
  }
}

export const getAuthMiddlewares = (
  successRedirectName,
  errorRedirectName,
) => {

  const fetchMe = useFetchMe()
  const isAuth = useIsAuth(errorRedirectName)
  const redirectIfAuthenticated = useRedirectIfAuthenticated(successRedirectName)

  return {
    fetchMe,
    isAuth,
    redirectIfAuthenticated,
  }
}
