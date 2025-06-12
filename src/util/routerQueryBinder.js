import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  merge,
  remove,
  cloneDeep,
  mergeWith,
  isArray,
  set,
  get,
  isEqual,
  transform,
  isEmpty,
} from 'lodash-es'

const clearObject = (object) => {
  for (const key of Object.keys(object)) delete object[key]
}

const useRouterQueryBinder = (data, { routerQueryKey = 'filter' } = {}) => {
  const defaults = cloneDeep(data)
  const query = reactive({})

  const routerQuery = useRouterQuery(routerQueryKey)
  const watcher = useWatcher({})
  const route = useRoute()

  const setQuery = (newQuery) => {
    merge(query, newQuery)
  }
  const setDefaults = () => {
    clearObject(query)
    setQuery(defaults)
  }

  setDefaults()

  const handleDataChanges = () => {
    const newQuery = transform(query, (res, val, key) => {
      if (!isEqual(defaults[key], val) && val !== undefined) {
        res[key] = val
      }
    })

    routerQuery.set(newQuery)
  }

  const handleRouteChanges = () => {
    const newQuery = mergeWith({}, defaults, routerQuery.get(),
      (defaultValue, newValue) => {
        if (isArray(defaultValue) && !isArray(newValue)) {
          return newValue !== undefined ? [newValue] : []
        }

        return newValue
      },
    )

    setQuery(newQuery)
    watcher.handle(routerQuery.get())
  }

  watch(query, handleDataChanges, { deep: true })
  watch(() => route.query, handleRouteChanges, { deep: true, immediate: true })

  return {
    defaults,
    query,
    watcher,
    setQuery,
    setDefaults,
  }
}

const useRouterQuery = (key) => {
  const router = useRouter()
  const route = useRoute()

  const get = (query = route.query) => {
    let error, data

    try {
      data = JSON.parse(query[key])
    } catch (error_) {
      error = error_
    }

    return error ? {} : data
  }

  const set = (newQuery) => {
    const query = {
      ...route.query,
      [key]: !isEmpty(newQuery)
        ? JSON.stringify(newQuery)
        : undefined,
    }

    router.replace({ query }).catch(() => {})
  }

  return { get, set }
}

const useWatcher = (data) => {
  const watchers = []
  let oldData = cloneDeep(data)

  const handle = (data) => {
    oldData && watchers.map((watcher) => {
      const exclude = {}

      watcher.exclude.map((path) => set(exclude, path, null))

      const a = merge({}, watcher.path ? get(data, watcher.path) : data, exclude)
      const b = merge({}, watcher.path ? get(oldData, watcher.path) : oldData, exclude)

      if (!isEqual(a, b)) watcher.handler(data, oldData)
    })
    oldData = cloneDeep(data)
  }

  const add = (handler, { path = '', exclude = [] } = {}) => {
    const watcher = {
      id: Date.now() + Math.random(),
      handler,
      path,
      exclude,
    }

    watchers.push(watcher)

    return watcher
  }

  const removeWatcher = (id) => remove(watchers, { id })

  return {
    watchers,
    handle,
    add,
    remove: removeWatcher,
  }
}

export default useRouterQueryBinder
