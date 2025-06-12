<template>
  <el-dialog
    :model-value="modelValue"
    modal-class="ProfitPlanCellModal"
    width="330px"
    :show-close="false"
    append-to-body
    @close="$emit('update:modelValue', false)"
  >
    <ProfitPlanCellModalCard
      v-for="tariff in tariffList"
      :key="tariff.id"
      v-model="formData[tariff.id]"
      :tariff="tariff"
      class="ProfitPlanCellModal__card"
    />

    <template #footer>
      <div class="ProfitPlanCellModal__actions">
        <el-button
          size="default"
          @click="$emit('update:modelValue', false)"
        >
          Отмена
        </el-button>

        <el-button
          type="primary"
          size="default"
          plain
          :loading="isLoading"
          @click="save"
        >
          Сохранить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import ProfitPlanCellModalCard from '@/components/profit-plan/ProfitPlanCellModalCard.vue'
import { useTariffStore } from '@/stores/tariff'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { find, isNumber } from 'lodash-es'
import { DateTime } from 'luxon'
import { useProfitPlanStore } from '@/stores/profit-plan'
import { getErrorHandler } from '@/util'

export default {
  name: 'ProfitPlanCellModal',

  components: { ProfitPlanCellModalCard },

  props: {
    data: {
      type: Object,
      required: true,
    },

    tariffId: {
      type: [Number, null],
      default: null,
      required: true,
    },

    modelValue: {
      type: [Boolean, null],
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const { getProfitPlanForDayAndTariff, saveProfitPlan } = useProfitPlanStore()
    const { tariffs } = storeToRefs(useTariffStore())

    const date = computed(() => DateTime.fromJSDate(props.data.date))
    const tariffList = computed(() => {
      return props.tariffId
        ? [find(tariffs.value, { id: props.tariffId })]
        : tariffs.value
    })

    const formData = reactive({})

    watch([() => props.modelValue, tariffList], ([isOpen]) => {
      if (isOpen) {
        for (const tariff of tariffList.value) {
          formData[tariff.id] = getProfitPlanForDayAndTariff(date.value, tariff.id)?.rate || 0
        }
      }
    }, { immediate: true, deep: true })

    const isLoading = ref(false)
    const save = async () => {
      isLoading.value = true

      const payload = {
        date: date.value.toUTC().toJSDate(),
        tariffs: {},
      }

      for (const tariff of tariffList.value) {
        const rate = formData[tariff.id] && +formData[tariff.id]

        if (rate !== undefined) {
          if (isNumber(rate) && rate >= 0) {
            payload.tariffs[tariff.id] = rate
          } else {
            isLoading.value = false
            return getErrorHandler('Не удалось сохранить. Ставка не должна быть меньше 0.')()
          }
        }
      }

      if (Object.keys(payload.tariffs).length === 0) {
        isLoading.value = false
        return getErrorHandler('Не удалось сохранить. Ничего не заполнено.')()
      }

      await saveProfitPlan(payload)
        .then(emit('update:modelValue', false))
        .catch(getErrorHandler('Не удалось сохранить. Что-то пошло не так.'))

      isLoading.value = false
    }

    return {
      isLoading,
      tariffList,
      formData,
      save,
    }
  },
}
</script>

<style lang="scss">
.ProfitPlanCellModal {
  .el-dialog {
    &__header {
      display: none;
    }
  }

  &__card {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
