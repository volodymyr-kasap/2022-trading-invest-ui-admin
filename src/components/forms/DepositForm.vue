<template>
  <el-form
    :model="model"
    class="DepositForm"
    @submit.prevent
  >
    <div class="DepositForm__section">
      <p class="DepositForm__section-title">
        Информация по депозиту
      </p>

      <el-form-item
        class="DepositForm__item"
        prop="id"
        label="ID"
      >
        <el-input
          :model-value="model.id"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="amount"
        label="Сумма ($)"
      >
        <el-input
          :model-value="model.amount"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="status"
        label="Статус"
      >
        <el-input
          :model-value="statusesDepositLabels[model.status]"
          :input-style="getStatusColor"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="tariff"
        label="Тариф"
      >
        <el-input
          :model-value="tariff"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="createdAt"
        label="Дата создания"
      >
        <el-input
          :model-value="formatDate(model.createdAt, 'dd.MM.yyyy HH:mm', true)"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>
    </div>

    <div class="DepositForm__section">
      <p class="DepositForm__section-title">
        Информация по клиенту
      </p>

      <el-form-item
        class="DepositForm__item"
        prop="id"
        label="ID"
      >
        <el-input
          :model-value="model.client?.id"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="client.name"
        label="Имя клиента"
      >
        <el-input
          :model-value="model.client?.name"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="client.email"
        label="Email"
      >
        <el-input
          :model-value="model.client?.email"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>

      <el-form-item
        class="DepositForm__item"
        prop="client.telegram"
        label="Telegram"
      >
        <el-input
          :model-value="model.client?.telegram"
          class="DepositForm__input"
          readonly
          size="large"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { ref, defineComponent, computed } from 'vue'
import { formatDate } from '@/util'
import { statusesDepositLabels } from '@/util/variables/statusesDepositLabels'
import { statusesDeposit } from '@/enums/statusesDeposit'

export default defineComponent({
  name: 'DepositForm',

  props: {
    model: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const formData = ref(props.model)

    const tariff = computed(() => {
      const { depositTariff } = props.model

      if (depositTariff) return `${depositTariff.duration / 3600 / 24} дней / ${depositTariff.rateFrom}-${depositTariff.rateTo}% / ID: ${depositTariff.id}`
      return '–'
    })

    const getStatusColor = computed(() => {
      if (statusesDeposit.CREATED === props.model.status) return { color: 'var(--color-warning)' }
      if (statusesDeposit.WORKING === props.model.status) return { color: 'var(--color-primary)' }
      if (statusesDeposit.CLOSED === props.model.status) return { color: 'var(--color-danger)' }

      return { color: 'var(--color-success)' }
    })

    return {
      formData,
      getStatusColor,
      tariff,
      statusesDepositLabels,
      formatDate,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.DepositForm {
  &__section {
    width: 522px;
    margin-top: 40px;

    &:first-child {
      margin-top: 0;
    }

    &-title {
      @include font-title-2-medium;
      color: var(--color-text-headline);
      margin-bottom: 28px;
    }
  }

  &__item {
    align-items: center;
  }

  &__input {
    &--waiting {
      color: var(--color-warning);

      .el-input {
        .el-input__wrapper {
          .el-input__inner {
            color: var(--color-warning) !important;
          }
        }
      }
    }

    &--progress {
      color: var(--color-primary);
    }

    &--complete {
      color: var(--color-success);
    }

    &--closed {
      color: var(--color-danger);
    }
  }
}
</style>
