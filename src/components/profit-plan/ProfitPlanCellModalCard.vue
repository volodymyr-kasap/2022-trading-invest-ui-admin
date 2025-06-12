<template>
  <div class="ProfitPlanCellModalCard">
    <div class="ProfitPlanCellModalCard__tariff">
      <div class="ProfitPlanCellModalCard__tariff-info">
        <div class="ProfitPlanCellModalCard__tariff-info-name">
          {{ tariff.name }}
        </div>

        <div class="ProfitPlanCellModalCard__tariff-info-id">
          ID: {{ tariff.id }}
        </div>
      </div>

      <div class="ProfitPlanCellModalCard__tariff-duration">
        {{ tariff.dayDuration }} дней
      </div>
    </div>

    <div class="ProfitPlanCellModalCard__form">
      <div class="ProfitPlanCellModalCard__form-label">
        Ставка на день (%)
      </div>

      <el-input
        type="number"
        min="0"
        max="100"
        step="0.01"
        :model-value="modelValue"
        class="ProfitPlanCellModalCard__form-input"
        @input="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfitPlanCellModalCard',

  props: {
    modelValue: {
      type: [Number, null],
      required: true,
    },

    tariff: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:modelValue'],
}
</script>

<style lang="scss">
.ProfitPlanCellModalCard {
  padding: 8px 16px;
  background: var(--color-bg-highlighting);
  border-radius: 12px;

  &__tariff {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &-info {
      &-name {
        font-weight: 400;
        font-size: 16px;
        line-height: 140%;
      }

      &-id {
        font-weight: 400;
        font-size: 14px;
        line-height: 120%;
        color: var(--color-text-caption-lighten);
      }
    }

    &-duration {
      padding: 2px 6px;
      background: var(--color-bg-transparent-dark-10);
      border-radius: 6px;
    }
  }

  &__form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    &-input {
      width: 70px;
    }
  }
}
</style>
