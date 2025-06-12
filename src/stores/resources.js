import { defineStore } from 'pinia'
import request from '@/api'

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    _tariffs: [],
    _clients: [],
  }),

  getters: {
    tariffs: (state) => state._tariffs,
    clients: (state) => state._clients,
  },

  actions: {
    async fetchTariffs () {
      const { data } = await request.get('admin/resources/deposit-tariffs')

      this.setData(data, '_tariffs')

      return data?.data
    },

    async fetchClients () {
      const { data } = await request.get('admin/resources/clients')

      this.setData(data, '_clients')

      return data?.data
    },

    setData (data, key) {
      this[key] = data
    },
  },
})
