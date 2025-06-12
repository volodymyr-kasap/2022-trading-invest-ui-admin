<template>
  <div
    class="ProfitPlanCell"
    :class="{
      'ProfitPlanCell-disabled': isDisabled,
    }"
  >
    <div class="ProfitPlanCell__top">
      <div class="ProfitPlanCell__day">
        {{ data.day.split('-').pop() }}
      </div>

      <div
        v-if="isCanEdit && !isDisabled"
        class="ProfitPlanCell__menu"
      >
        <el-dropdown size="large">
          <IconMenu />

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="viewModal = true">
                <IconEdit class="ProfitPlanCell__menu-icon" />
                Редактировать
              </el-dropdown-item>

              <el-dropdown-item @click="showConfirmRemoveRates">
                <IconDelete class="ProfitPlanCell__menu-icon" />
                Удалить все ставки
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div
      class="ProfitPlanCell__info"
      :class="{ 'ProfitPlanCell__info--warning': isWarning }"
    >
      <div class="ProfitPlanCell__info-title">
        {{ title }}
      </div>
      <div class="ProfitPlanCell__info-subtitle">
        {{ subtitle }}
      </div>
    </div>

    <ProfitPlanCellModal
      v-model="viewModal"
      :data="data"
      :tariff-id="tariffId"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { DateTime } from 'luxon'
import { filter } from 'lodash-es'
import { useTariffStore } from '@/stores/tariff'
import { useProfitPlanStore } from '@/stores/profit-plan'
import IconMenu from '@/components/icons/IconMenu.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import ProfitPlanCellModal from '@/components/profit-plan/ProfitPlanCellModal.vue'
import { Confirm } from '@/services/confirm'

export default {
  name: 'ProfitPlanCell',

  components: { ProfitPlanCellModal, IconDelete, IconEdit, IconMenu },

  props: {
    data: {
      type: Object,
      required: true,
    },

    tariffId: {
      type: [Number, null],
      required: true,
    },
  },

  setup (props) {
    const { tariffs } = storeToRefs(useTariffStore())
    const { getProfitPlanForDayAndTariff, getProfitPlansForDay, clearRates } = useProfitPlanStore()

    const viewModal = ref(false)

    const date = computed(() => DateTime.fromJSDate(props.data.date))
    const countFilled = computed(() => filter(Object.values(getProfitPlansForDay(date.value) || {}), (k) => k?.rate > 0)?.length)
    const percent = computed(() => props.tariffId && getProfitPlanForDayAndTariff(date.value, props.tariffId)?.rate)

    const isDisabled = computed(() => props.data.type !== 'current-month')
    const isCanEdit = computed(() => date.value > DateTime.now())

    const title = computed(() => {
      if (props.tariffId) {
        return (percent.value && percent.value > 0) ? `${percent.value}%` : '-'
      } else {
        return `${countFilled.value} из ${tariffs.value.length}`
      }
    })

    const subtitle = computed(() => {
      if (props.tariffId) {
        return (percent.value && percent.value > 0) ? 'ставка назначена' : 'не назначено'
      } else {
        return 'ставок назначено'
      }
    })

    const isWarning = computed(() => props.tariffId ? !percent.value : countFilled.value < tariffs.value.length)

    const showConfirmRemoveRates = () => {
      Confirm.base({
        title: 'Удалить ставки',
        buttonType: 'danger',
        confirmButtonText: 'Подтвердить',
        cancelButtonText: 'Отмена',
        heading: 'Вы уверены, что хотите удалить все ставки?',
        description: '',
        confirmType: 'DELETE',
      }).then(async () => await removeRates())
    }

    const removeRates = async () => {
      await clearRates({ date: date.value.toJSDate() })
    }

    return {
      isDisabled,
      isCanEdit,
      viewModal,
      title,
      subtitle,
      isWarning,
      countFilled,
      percent,
      showConfirmRemoveRates,
    }
  },
}
</script>

<style lang="scss">
.ProfitPlanCell {
  position: relative;
  width: 100%;
  height: 100%;

  &-disabled {
    opacity: 0.4;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__day {
    font-weight: 500;
    font-size: 16px;
    line-height: 140%;
    color: var(--color-text-regular);
  }

  &__menu {
    &-icon {
      margin-right: 12px;
    }
  }

  &__info {
    width: 100%;
    text-align: right;
    margin-top: 16px;
    color: var(--color-primary);

    &--warning {
      color: var(--color-warning);
    }
  }
}
</style>
