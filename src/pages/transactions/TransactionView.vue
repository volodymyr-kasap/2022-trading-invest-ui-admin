<template>
  <PageLayout
    :title="`ID: ${id}`"
    :breadcrumbs="breadcrumbs"
  >
    <template
      v-if="transaction?.status === statusesTransaction.PENDING"
      #actionButtons
    >
      <el-button
        class="TransactionView__button"
        type="primary"
        size="large"
      >
        Подтвердить транзакцию
      </el-button>
    </template>

    <template #mainContent>
      <TransactionForm
        :model="transaction"
        :is-loading="isLoading"
        class="TransactionView__form"
      />
    </template>
  </PageLayout>
</template>

<script>
import { ref, defineComponent, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formCustomizer, getErrorHandler } from '@/util'
import { useTransactionStore } from '@/stores/transaction'
import { statusesTransaction } from '@/enums/statusesTransaction'
import { cloneDeep, merge } from 'lodash-es'
import PageLayout from '@/layouts/PageLayout.vue'
import TransactionForm from '@/components/forms/TransactionForm.vue'

export default defineComponent({
  name: 'TransactionView',

  components: {
    TransactionForm,
    PageLayout,
  },

  setup () {
    const transactionStore = useTransactionStore()
    const route = useRoute()

    const isLoading = ref(false)

    const form = reactive({
      amount: null,
      status: '',
      createdAt: null,
      depositTariff: null,
      client: {},
    })

    const formClone = cloneDeep(form)

    const id = computed(() => +route.params.id)
    const transaction = computed(() => transactionStore.transaction)
    const breadcrumbs = computed(() => [{ name: 'TransactionList', label: 'Транзакции' }, 'ID: ' + id.value])

    const fetchData = async () => {
      isLoading.value = true

      await transactionStore.fetchItem(id.value)
        .catch(getErrorHandler('Не удалось загрузить транзакцию.'))

      isLoading.value = false
    }

    watch(
      transaction,
      (data) => {
        const transaction = cloneDeep(data)

        merge(form, formCustomizer(transaction))
        merge(formClone, formCustomizer(transaction))
      }, { deep: true },
    )

    onMounted(async () => {
      if (transaction.value !== id.value) await fetchData()
    })

    return {
      isLoading,
      transaction,
      breadcrumbs,
      id,
      statusesTransaction,
    }
  },
})
</script>

<style lang="scss">
.TransactionView {}
</style>
