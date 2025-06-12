import { defineStore } from 'pinia'
import request from '@/api'
import {findIndex} from "lodash-es";

export const useDepositStore = defineStore('deposit', {
  state: () => ({
    _deposits: [],
    _deposit: {},
    _meta: {},
  }),

  getters: {
    deposits: (state) => state._deposits,
    deposit: (state) => state._deposit,
    total: (state) => state._meta?.itemCount,
    limit: (state) => state._meta?.take,
  },

  actions: {
    async fetchItems (payload) {
      const { data } = await request.get('admin/deposits', payload)

      this.setData(data?.data)
      this.setMeta(data?.meta)

      return data?.data
    },

    async fetchItem (id) {
      const { data } = await request.get(`admin/deposits/${id}`)

      this.setItem(data)

      return data
    },

    async updateItemStatus ({ id, payload }) {
      const { data } = await request.put(`admin/deposits/${id}/status`, payload)

      this.setItem(data)

      return data
    },

    setData (data) {
      this._deposits = data
    },

    setItem (data) {
      this._deposit = data

      if (this._deposits) {
        const index = findIndex(this._deposits, { id: data.id })

        if (index !== -1) this._deposits.splice(index, 1, data)
      }
    },

    setMeta (data) {
      this._meta = data
    },
  },
})
