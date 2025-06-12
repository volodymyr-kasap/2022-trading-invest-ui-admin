import { defineStore } from 'pinia'
import request from '@/api'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    _transactions: [],
    _transaction: {},
    _meta: {},
  }),

  getters: {
    transactions: (state) => state._transactions,
    transaction: (state) => state._transaction,
    total: (state) => state._meta?.itemCount,
    limit: (state) => state._meta?.take,
  },

  actions: {
    async fetchItems (payload) {
      const { data } = await request.get('admin/transactions', payload)

      this.setData(data?.data)
      this.setMeta(data?.meta)

      return data?.data
    },

    async fetchItem (id) {
      const { data } = await request.get(`admin/transactions/${id}`)

      this.setItem(data)

      return data
    },

    async addItem (payload) {
      const { data } = await request.post('admin/transactions', payload)

      return data
    },

    setData (data) {
      this._transactions = data
    },

    setItem (data) {
      this._transaction = data
    },

    setMeta (data) {
      this._meta = data
    },
  },
})
