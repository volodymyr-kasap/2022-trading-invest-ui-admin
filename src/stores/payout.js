import { defineStore } from 'pinia'
import request from '@/api'

export const usePayoutStore = defineStore('payout', {
  state: () => ({
    _payouts: [],
    _payout: {},
    _meta: {},
  }),

  getters: {
    payouts: (state) => state._payouts,
    payout: (state) => state._payout,
    total: (state) => state._meta?.itemCount,
    limit: (state) => state._meta?.take,
  },

  actions: {
    async fetchItems (payload) {
      const { data } = await request.get('admin/payouts', payload)

      this.setData(data?.data)
      this.setMeta(data?.meta)

      return data?.data
    },

    async fetchItem (id) {
      const { data } = await request.get(`admin/payouts/${id}`)

      this.setItem(data)

      return data
    },

    async updateItemStatus ({ id, payload }) {
      const { data } = await request.put(`admin/payouts/${id}/status`, payload)

      this.setItem(data)

      return data
    },

    setData (data) {
      this._payouts = data
    },

    setItem (data) {
      this._payout = data
    },

    setMeta (data) {
      this._meta = data
    },
  },
})
