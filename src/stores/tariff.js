import { defineStore } from 'pinia'
import { findIndex } from 'lodash-es'
import request from '@/api'

export const useTariffStore = defineStore('tariff', {
  state: () => ({
    _tariffs: [],
    _tariff: {},
    _meta: {},
  }),

  getters: {
    tariffs: (state) => state._tariffs,
    tariff: (state) => state._tariff,
    total: (state) => state._meta?.itemCount,
    limit: (state) => state._meta?.take,
  },

  actions: {
    async fetchItems (payload) {
      const { data } = await request.get('admin/deposit-tariffs', payload)

      this.setData(data?.data)
      this.setMeta(data?.meta)

      return data?.data
    },

    async fetchItem (id) {
      const { data } = await request.get(`admin/deposit-tariffs/${id}`)

      this.setItem(data)

      return data
    },

    async updateItem ({ id, payload }) {
      const { data } = await request.put(`admin/deposit-tariffs/${id}`, payload)

      this.setItem(data)

      return data
    },

    async addItem (payload) {
      const { data } = await request.post('admin/deposit-tariffs', payload)

      return data
    },

    async deleteItem (id) {
      const { data } = await request.delete(`admin/deposit-tariffs/${id}`)

      this.delete(id)

      return data
    },

    setData (data) {
      this._tariffs = data
    },

    setItem (data) {
      this._tariff = data

      if (this._tariffs) {
        const index = findIndex(this._tariffs, { id: data.id })

        if (index !== -1) this._tariffs.splice(index, 1, data)
      }
    },

    setMeta (data) {
      this._meta = data
    },

    delete (id) {
      const index = findIndex(this._tariffs, (item) => item.id === id)

      if (index !== -1) this._tariffs.splice(index, 1)
    },
  },
})
