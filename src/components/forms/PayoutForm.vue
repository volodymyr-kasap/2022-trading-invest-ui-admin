<template>
  <el-form
    v-loading="isLoading"
    :model="model"
    class="PayoutForm"
    element-loading-spinner="el-icon-loading"
    @submit.prevent
  >
    <div class="PayoutForm__section">
      <p class="PayoutForm__title">
        Информация по выплате
      </p>

      <el-form-item
        class="PayoutForm__item"
        prop="id"
        label="ID"
      >
        <el-input
          :model-value="model.id"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="sum"
        label="Cумма ($)"
      >
        <el-input
          :model-value="model.transaction?.amount"
          class="PayoutForm__input"
          size="large"
          readonly
        >
          <template #append>
            <img
              class="PayoutForm__input-icon"
              src="@/assets/img/icons/icon-copy.svg"
              alt="copy"
              @click="copy(model.transaction?.amount, 'Сумма скопирована и может быть использована (Ctrl + V)')"
            >
          </template>
        </el-input>
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="status"
        label="Статус"
      >
        <el-input
          :model-value="statusesPayoutLabels[model.status]"
          :input-style="setStatusColor"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="network"
        label="Сеть"
      >
        <el-input
          :model-value="networkTypes[model.payoutInfoCrypto?.network]"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="wallet"
        label="Кошелек"
      >
        <el-input
          :model-value="model.payoutInfoCrypto?.wallet"
          class="PayoutForm__input"
          size="large"
          readonly
        >
          <template #append>
            <img
              class="PayoutForm__input-icon"
              src="@/assets/img/icons/icon-copy.svg"
              alt="copy"
              @click="copy(model.payoutInfoCrypto?.wallet, 'Кошелек скопирован и может быть использован (Ctrl + V)')"
            >
          </template>
        </el-input>
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="createdAt"
        label="Дата создания"
      >
        <el-input
          :model-value="formatDate(model.transaction?.createdAt, 'dd.MM.yyyy HH:mm', true)"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>
    </div>

    <div class="PayoutForm__section">
      <p class="PayoutForm__title">
        Информация по клиенту
      </p>

      <el-form-item
        class="PayoutForm__item"
        prop="id"
        label="ID"
      >
        <el-input
          :model-value="model.transaction?.client?.id"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="name"
        label="Имя клиента"
      >
        <el-input
          :model-value="model.transaction?.client?.name"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="createdAt"
        label="Дата регистрации"
      >
        <el-input
          :model-value="model.transaction?.client?.createdAt"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="email"
        label="Email"
      >
        <el-input
          :model-value="model.transaction?.client?.email"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>

      <el-form-item
        class="PayoutForm__item"
        prop="telegram"
        label="Telegram"
      >
        <el-input
          :model-value="model.transaction?.client?.telegram"
          class="PayoutForm__input"
          size="large"
          readonly
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { networkTypes } from '@/enums/networkTypes'
import { usePayoutStore } from '@/stores/payout'
import { statusesPayoutLabels } from '@/util/variables/statusesPayoutLabels'
import { statusesPayout } from '@/enums/statusesPayout'
import { formatDate, copy } from '@/util'

export default defineComponent({
  name: 'PayoutForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const payoutStore = usePayoutStore()

    const setStatusColor = computed(() => {
      const { status } = props.model

      const colorEnum = {
        [statusesPayout.PENDING]: '--color-warning',
        [statusesPayout.SUCCESS]: '--color-success',
        [statusesPayout.REJECTED]: '--color-danger',
      }

      return { color: `var(${colorEnum[status]})` }
    })

    return {
      payoutStore,
      setStatusColor,
      statusesPayoutLabels,
      networkTypes,
      formatDate,
      copy,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.PayoutForm {
  width: 522px;

  &__section {
    margin-top: 40px;

    &:first-child {
      margin-top: 0;
    }
  }

  &__input {
    .el-input__wrapper {
      border-radius: 12px !important;
    }

    .el-input-group__append {
      box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
      flex-shrink: 0;
      margin-left: 12px;
      padding: 0 9px;
      border-radius: 12px;
    }

    &-icon {
      cursor: pointer;
    }
  }

  &__title {
    @include font-title-2-medium;
    color: var(--color-text-headline);
    margin-bottom: 28px;
  }
}
</style>
