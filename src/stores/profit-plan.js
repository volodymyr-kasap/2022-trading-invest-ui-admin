import { defineStore } from 'pinia'
import request from '@/api'
import { get, setWith } from 'lodash-es'
import { DateTime } from 'luxon'

export const useProfitPlanStore = defineStore('profit-plan', {
  state: () => ({
    profitPlan: {},
  }),

  getters: {
    getProfitPlansForDay: ({ profitPlan }) => (date) => {
      const { year, month, day } = date.toObject()

      return get(profitPlan, [year, month, day])
    },

    getProfitPlanForDayAndTariff: ({ profitPlan }) => (date, tariffId) => {
      const { year, month, day } = date.toObject()

      return get(profitPlan, [year, month, day, tariffId])
    },

    isLoadedByDate: ({ profitPlan }) => (date) => {
      const { year, month } = date.toObject()

      return !!get(profitPlan, [year, month])
    },
  },

  actions: {
    async fetchItems ({ monthDate }) {
      const { data } = await request.get('admin/deposit-plan-points', {
        monthDate,
      })

      this.setData(data)

      return data
    },

    async saveProfitPlan ({ date, tariffs }) {
      const { data } = await request.post('admin/deposit-plan-points/merge', { date, tariffs })

      this.mergeData({ item: data, monthDate: date })

      return data
    },

    async clearRates ({ date }) {
      const { data } = await request.post('admin/deposit-plan-points/clear-rates', { date })

      this.mergeData({ item: data, monthDate: date })

      return data
    },

    setData ({ items, monthDate }) {
      const monthStartTimestamp = DateTime.fromISO(monthDate)

      const { year, month } = monthStartTimestamp.toObject()

      setWith(this.profitPlan, [year, month], items, Object)
    },

    mergeData ({ item, monthDate }) {
      const monthStartTimestamp = DateTime.fromJSDate(monthDate)

      const { year, month, day } = monthStartTimestamp.toObject()

      setWith(this.profitPlan, [year, month, day], Object.values(item)[0], Object)
    },
  },
})
