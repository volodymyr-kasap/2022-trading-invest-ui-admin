import { defineStore } from 'pinia'
import request from '@/api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    _admin: null,
  }),

  getters: {
    admin: (state) => state._admin,
    auth: (state) => !!state._admin?.id,
  },

  actions: {
    async fetch () {
      const { data } = await request.get('admin/me')

      if (data) this.setAdmin(data)

      return data
    },

    setAdmin (data) {
      this._admin = data
    },
  },
})
