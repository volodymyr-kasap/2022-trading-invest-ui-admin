import { defineStore } from 'pinia'
import request from '@/api'
import { pick } from 'lodash-es'
import { useAdminStore } from '@/stores/admin'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    _accessToken: sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken'),
    _refreshToken: sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken'),
  }),

  getters: {
    accessToken: (state) => state._accessToken,
    refreshToken: (state) => state._refreshToken,
  },

  actions: {
    async signIn (data) {
      const response = await request.post('auth/admin/login', data)

      if (response?.data) {
        this.setTokens(response?.data)
      }

      return response
    },

    async signOut () {
      const adminStore = useAdminStore()

      this.setTokens({
        accessToken: null,
        refreshToken: null,
      })
      adminStore.setAdmin(null)
    },

    async refresh () {
      const { refreshToken } = this

      const res = await request.post('auth/admin/refresh', { refreshToken })
        .catch(() => {
          this.signOut()
        })

      if (res?.data) {
        this.setTokens(pick(res.data, ['accessToken', 'refreshToken']))
      }

      return res
    },

    setTokens ({ accessToken, refreshToken }) {
      this._accessToken = accessToken
      this._refreshToken = refreshToken

      if (!accessToken && !refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        return
      }

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
  },
})
