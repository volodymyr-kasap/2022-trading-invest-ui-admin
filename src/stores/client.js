import { defineStore } from 'pinia'
import request from '@/api'

export const useClientStore = defineStore('client', {
  state: () => ({
    _clients: [],
    _client: {},
    _meta: {},
  }),

  getters: {
    clients: (state) => state._clients,
    client: (state) => state._client,
    total: (state) => state._meta?.itemCount,
    limit: (state) => state._meta?.take,
  },

  actions: {
    async fetchItems (payload) {
      const { data } = await request.get('admin/clients', payload)

      this.setData(data?.data)
      this.setMeta(data?.meta)

      return data?.data
    },

    async fetchItem (id) {
      const { data } = await request.get(`admin/clients/${id}`)

      this.setItem(data)

      return data
    },

    async updateItemStatus ({ id, payload }) {
      const { data } = await request.put(`admin/clients/${id}/status`, payload)

      this.setItem(data?.data)

      return data?.data
    },

    setData (data) {
      this._clients = data
    },

    setItem (data) {
      this._client = data
    },

    setMeta (data) {
      this._meta = data
    },
  },
})
