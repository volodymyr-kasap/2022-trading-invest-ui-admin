<template>
  <AdminPageLayout title="План прибыли">
    <template #mainContent>
      <el-select
        v-model="selectedTariffId"
        class="ProfitPlanPage__tariffs-select"
        placeholder="Все тарифы"
        size="large"
        clearable
      >
        <el-option
          v-for="tariff in tariffs"
          :key="tariff.id"
          :label="tariff.name"
          :value="tariff.id"
        >
          {{ tariff.name }}
        </el-option>
      </el-select>

      <el-calendar
        ref="calendar"
        v-model="selectedDate"
        v-loading="isLoading"
        class="ProfitPlanPage__calendar"
      >
        <template #header="{ date }">
          <div>
            <span>{{ date }}</span>
          </div>

          <div>
            <el-button-group size="default">
              <el-button @click="selectDate('prev-month')">
                Предыдущий месяц
              </el-button>
              <el-button @click="selectDate('today')">
                Сегодня
              </el-button>
              <el-button @click="selectDate('next-month')">
                Следующий месяц
              </el-button>
            </el-button-group>
          </div>
        </template>

        <template #dateCell="{ data }">
          <ProfitPlanCell
            :data="data"
            :tariff-id="selectedTariffId"
          />
        </template>
      </el-calendar>
    </template>
  </AdminPageLayout>
</template>

<script>
import { ref, watch, defineComponent, onMounted, computed } from 'vue'
import { DateTime } from 'luxon'
import AdminPageLayout from '@/layouts/PageLayout.vue'
import ProfitPlanCell from '@/components/profit-plan/ProfitPlanCell.vue'
import { useTariffStore } from '@/stores/tariff'
import { useProfitPlanStore } from '@/stores/profit-plan'
import { getErrorHandler } from '@/util'

export default defineComponent({
  name: 'ProfitPlanPage',

  components: {
    ProfitPlanCell,
    AdminPageLayout,
  },

  setup () {
    const tariffStore = useTariffStore()
    const profitPlanStore = useProfitPlanStore()

    const calendar = ref()
    const isLoading = ref(false)

    const selectedDate = ref(DateTime.now().toJSDate())
    const selectedTariffId = ref(null)

    const tariffs = computed(() => tariffStore?.tariffs)

    const selectDate = (val) => calendar.value.selectDate(val)

    const fetchData = async () => {
      const currentMonth = DateTime.fromJSDate(selectedDate.value)
      const prevMonth = currentMonth.minus({ months: 1 })
      const nextMonth = currentMonth.plus({ months: 1 })
      const promises = []

      for (const date of [prevMonth, currentMonth, nextMonth]) {
        if (!profitPlanStore.isLoadedByDate(date)) {
          promises.push(profitPlanStore.fetchItems({ monthDate: date.toJSDate() }))
        }

      }

      if (promises.length > 0) {
        isLoading.value = true
        await Promise.all(promises)
        isLoading.value = false
      }
    }

    const fetchTariffs = async () => {
      isLoading.value = true

      tariffStore.fetchItems()
        .catch(getErrorHandler('Не удалось загрузить список тарифов.'))

      isLoading.value = false
    }

    watch(selectedDate, () => fetchData(), { immediate: true })

    onMounted(() => {
      fetchTariffs()
    })

    return {
      isLoading,
      selectedDate,
      tariffs,
      selectedTariffId,
      calendar,
      selectDate,
    }
  },
})
</script>

<style lang="scss">
.ProfitPlanPage {
  &__tariffs-select {
    width: 300px;
  }

  &__calendar {
    margin-top: 32px;
    --el-calendar-cell-width: auto !important;
  }
}
</style>
