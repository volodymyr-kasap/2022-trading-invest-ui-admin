<template>
  <PageLayout
    title="Новая транзакция"
    :breadcrumbs="breadcrumbs"
  >
    <template #actionButtons>
      <el-button
        :loading="isLoading"
        class="TransactionAdd__button"
        type="primary"
        size="large"
        @click="save"
      >
        Создать
      </el-button>
    </template>

    <template #mainContent>
      <TransactionForm
        :model="form"
        class="TransactionAdd__form"
        create-format
      />
    </template>
  </PageLayout>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { getErrorHandler, successHandler } from '@/util'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transaction'
import PageLayout from '@/layouts/PageLayout.vue'
import TransactionForm from '@/components/forms/TransactionForm.vue'

export default defineComponent({
  name: 'TransactionAdd',

  components: {
    TransactionForm,
    PageLayout,
  },

  setup () {
    const router = useRouter()
    const transactionStore = useTransactionStore()

    const isLoading = ref(false)

    const form = reactive({
      clientId: '',
      amount: null,
      reasonType: null,
      description: '',
    })

    const breadcrumbs = computed(() => [{ name: 'TransactionList', label: 'Транзакции' }, 'Новая транзакция'])

    const save = async () => {
      isLoading.value = true

      await transactionStore.addItem(form)
        .then(() => {
          router.push('TransactionList')
          successHandler('Транзакция была создана.')
        })
        .catch(getErrorHandler('Не удалось добавить транзакцию.'))

      isLoading.value = false
    }

    return {
      form,
      breadcrumbs,
      isLoading,
      save,
    }
  },
})
</script>

<style lang="scss">
.TransactionAdd {}
</style>
