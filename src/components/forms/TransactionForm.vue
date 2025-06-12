<template>
  <el-form
    class="TransactionForm"
    :class="{ 'TransactionForm--create': createFormat }"
    :model="model"
    element-loading-spinner="el-icon-loading"
    @submit.prevent
  >
    <div
      class="TransactionForm__container"
      :class="{ 'TransactionForm__container-transaction': createFormat }"
    >
      <p
        v-if="!createFormat"
        class="TransactionForm__title"
      >
        Информация по транзакции
      </p>

      <el-form-item
        v-if="createFormat"
        class="TransactionForm__item"
        label="Клиент"
      >
        <el-select
          v-model="formData.clientId"
          class="TransactionAddPage__options-select"
          filterable
          size="large"
          placeholder="Введите ID или email клиента"
        >
          <template #prefix>
            <img
              class="TransactionAddPage__options-select-icon"
              src="@/assets/img/icons/icon-search.svg"
              alt="icon"
            >
          </template>

          <el-option
            v-for="client in clients"
            :key="client.id"
            :value="client.id"
            :label="client.email"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="!createFormat"
        class="TransactionForm__item"
        label="ID"
      >
        <el-input
          :model-value="formData?.id"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
        />
      </el-form-item>

      <el-form-item
        class="TransactionForm__item"
        label="Сумма ($)"
      >
        <el-input
          v-model.number="formData.amount"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
        />
      </el-form-item>

      <el-form-item
        v-if="!createFormat"
        class="TransactionForm__item"
        label="Тип"
      >
        <el-input
          :model-value="reasonTypesLabels[formData?.reasonType]"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
        />
      </el-form-item>

      <el-form-item
        v-if="createFormat"
        class="TransactionForm__item"
        label="Тип"
      >
        <el-select
          v-model="formData.reasonType"
          class="TransactionForm__input"
          placeholder="Выбрать тип"
          size="large"
        >
          <el-option
            v-for="type in reasonTypesLabelsArray"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="!createFormat"
        class="TransactionForm__item"
        label="Статус"
      >
        <el-input
          :model-value="transactionStatus"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
          :input-style="setStatusColor"
        />
      </el-form-item>

      <el-form-item
        v-if="!createFormat"
        class="TransactionForm__item"
        label="Личный счет после транзакции"
      >
        <el-input
          :model-value="formData?.balanceAfter"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
        />
      </el-form-item>

      <el-form-item
        class="TransactionForm__item"
        label="Описание"
      >
        <el-input
          v-model="formData.description"
          class="TransactionForm__input"
          size="large"
          :readonly="!createFormat"
          type="textarea"
          resize="none"
          :rows="4"
        />
      </el-form-item>

      <el-form-item
        v-if="!createFormat"
        class="TransactionForm__item"
        label="Дата создания"
      >
        <el-input
          :model-value="formatDate(formData?.createdAt, 'dd.MM.yyyy HH:mm', true)"
          :readonly="!createFormat"
          class="TransactionForm__input"
          size="large"
        />
      </el-form-item>
    </div>

    <div
      class="TransactionForm__container"
      :class="{ 'TransactionForm__container-client': createFormat }"
    >
      <div
        class="TransactionForm__wrapper"
        :class="{ 'TransactionForm__wrapper-client': createFormat }"
      >
        <p
          class="TransactionForm__title"
          :class="{ 'TransactionForm__title--create': createFormat }"
        >
          Информация по клиенту
        </p>

        <el-form-item
          class="TransactionForm__item"
          :class="{ 'TransactionForm__item-client': createFormat }"
          label="ID"
        >
          <el-input
            :model-value="client?.id"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>

        <el-form-item
          class="TransactionForm__item"
          label="Имя клиента"
          :class="{ 'TransactionForm__item-client': createFormat }"
        >
          <el-input
            :model-value="client?.name"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>

        <el-form-item
          class="TransactionForm__item"
          label="Дата регистрации"
          :class="{ 'TransactionForm__item-client': createFormat }"
        >
          <el-input
            :model-value="client?.createdAt ? formatDate(client?.createdAt, 'dd.MM.yyyy', true) : ''"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>

        <el-form-item
          class="TransactionForm__item"
          label="Email"
          :class="{ 'TransactionForm__item-client': createFormat }"
        >
          <el-input
            :model-value="client?.email"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>

        <el-form-item
          class="TransactionForm__item"
          label="Telegram"
          :class="{ 'TransactionForm__item-client': createFormat }"
        >
          <el-input
            :model-value="client?.telegram"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>

        <el-form-item
          v-if="createFormat"
          class="TransactionForm__item"
          label="Личный счет"
          :class="{ 'TransactionForm__item-client': createFormat }"
        >
          <el-input
            :model-value="client?.balanceAmount ? `$${client?.balanceAmount}` : ''"
            class="TransactionForm__input"
            size="large"
            readonly
          />
        </el-form-item>
      </div>

      <div
        v-if="createFormat"
        class="TransactionForm__notification"
      >
        <img
          class="TransactionForm__notification-icon"
          src="@/assets/img/icons/icon-info.svg"
          alt="icon"
        >

        <p class="TransactionForm__notification-title">
          Это поле заполнится автоматически после выбора клиента.
        </p>
      </div>
    </div>
  </el-form>
</template>

<script>
import { defineComponent, computed, onMounted, watch } from 'vue'
import { formatDate, getErrorHandler } from '@/util'
import { useResourcesStore } from '@/stores/resources'
import { useClientStore } from '@/stores/client'
import { reasonTypesLabelsArray, reasonTypesLabels } from '@/util/variables/reasonTypesLabels'
import { statusesTransaction } from '@/enums/statusesTransaction'
import { statusesTransactionLabels } from '@/util/variables/statusesTransactionLabels'
import { statusesPayout } from'@/enums/statusesPayout'
import { statusesPaymentLabels } from '@/util/variables/statusesPaymentLabels'
import { statusesPayoutLabels } from '@/util/variables/statusesPayoutLabels'

export default defineComponent({
  name: 'TransactionForm',

  props: {
    model: {
      type: Object,
      required: true,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    createFormat: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const resourcesStore = useResourcesStore()
    const clientStore = useClientStore()

    const formData = computed({
      get: () => props.model,
      set: (val) => emit('update:modelValue', val),
    })

    const clients = computed(() => resourcesStore?.clients)
    const clientId = computed(() => formData.value?.clientId)
    const client = computed(() => clientStore?.client)
    const transactionStatus = computed(() => {
      const { status, transactionInfoPayment, transactionInfoPayout } = props.model

      if (transactionInfoPayment) return statusesPaymentLabels[status]
      if (transactionInfoPayout) return statusesPayoutLabels[status]

      return statusesTransactionLabels[status]
    })

    const setStatusColor = computed(() => {
      const status = props.model?.transactionInfoPayment?.status || props.model?.transactionInfoPayout?.status || props.model.status

      const colorEnum = {
        [statusesTransaction.PENDING]: '--color-warning',
        [statusesTransaction.SUCCESS]: '--color-success',
        [statusesTransaction.FAILED]: '--color-danger',
        [statusesPayout.REJECTED]: '--color-danger',
      }

      return { color: `var(${colorEnum[status]})` }
    })

    const fetchClients = async () => {
      await resourcesStore.fetchClients()
        .catch(getErrorHandler('удалось загрузить список клиентов.'))
    }

    const fetchClient = async () => {
      await clientStore.fetchItem(clientId.value)
        .catch(getErrorHandler('Не удалось загрузить клиента.'))
    }

    watch(clientId, async () => await fetchClient())

    onMounted(fetchClients)

    return {
      clients,
      client,
      formData,
      setStatusColor,
      transactionStatus,
      statusesTransactionLabels,
      reasonTypesLabels,
      reasonTypesLabelsArray,
      formatDate,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.TransactionForm {
  &__container {
    margin-top: 40px;

    &:first-child {
      margin-top: 0;
    }

    &-transaction {
      min-width: 522px;
    }

    &-client {
      max-width: 448px;
      margin-left: 50px;
      margin-top: 0;
    }
  }

  &__wrapper {
    &-client {
      border-radius: 12px;
      padding: 20px;
      background: #F6F9FF;
    }
  }

  &__title {
    @include font-title-2-medium;
    color: var(--color-text-headline);
    margin-bottom: 28px;

    &--create {
      @include font-headline-medium;
    }
  }

  &__item {
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }

    &-client {
      & > label {
        padding-right: 23px;
        width: 170px;
      }
    }
  }

  &--create {
    display: flex;
    justify-content: space-between;
  }

  &__notification {
    margin-top: 4px;
    border-radius: 10px;
    padding: 12px 20px;
    background: #E6EEFF;
    display: flex;
    align-items: flex-start;

    &-title {
      @include font-text-regular;
      margin-left: 4px;
      color: var(--color-text-regular-darken);
    }
  }
}
</style>
