import { merge } from 'lodash-es'
import qs from 'qs'
import axios from 'axios'
import { captureMessage } from '@sentry/vue'
import { useAuthStore } from '@/stores/auth'

async function request (
  method = 'GET',
  url = '/',
  data = {},
  additional = {},
) {
  const authAdminStore = useAuthStore()
  const token = authAdminStore?.accessToken
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const query = method === 'GET' ? qs.stringify(data, { arrayFormat: 'comma', addQueryPrefix: true }) : ''
  const object = {
    method,
    headers,
    data,
    url: `${import.meta.env.VITE_APP_API_URL}/${url}${query}`,
  }

  try {
    return await axios(merge(object, additional))
  } catch (error) {
    if (error?.response) {
      const { status } = error.response

      if (status === 401) {
        // authAdminStore.$onAction('SignOut')
      }
    }
    captureMessage(JSON.stringify(error))
    throw error
  }
}

request.get = (url, data, addition) => request('GET', url, data, addition)
request.post = (url, data, addition) => request('POST', url, data, addition)
request.put = (url, data, addition) => request('PUT', url, data, addition)
request.delete = (url, data, addition) => request('DELETE', url, data, addition)

export default request
