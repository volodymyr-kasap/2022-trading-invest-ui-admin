<template>
  <PageLayout
    v-loading="isLoadingDeposit"
    :title="'ID: ' + id"
    :breadcrumbs="breadcrumbs"
    element-loading-spinner="el-icon-loading"
  >
    <template #actionButtons>
      <el-button
        v-if="buttonVisibility"
        :type="buttonType"
        class="DepositView__button"
        size="large"
        @click="deposit.status === statusesDeposit.WORKING ? showConfirmCloseDeposit() : updateStatus()"
      >
        {{ buttonTitle }}
      </el-button>
    </template>

    <template #mainContent>
      <DepositForm
        :model="deposit"
        class="DepositView__form"
      />
    </template>
  </PageLayout>
</template>

<script>
import { ref, defineComponent, onMounted, reactive, computed, watch } from 'vue'
import { useDepositStore } from '@/stores/deposit'
import { statusesDeposit } from '@/enums/statusesDeposit'
import { statusesDepositLabels } from '@/util/variables/statusesDepositLabels'
import { Confirm } from '@/services/confirm'
import { useRoute } from 'vue-router'
import { formCustomizer, getErrorHandler, successHandler } from '@/util'
import { cloneDeep, merge } from 'lodash-es'
import PageLayout from '@/layouts/PageLayout.vue'
import DepositForm from '@/components/forms/DepositForm.vue'

export default defineComponent({
  name: 'DepositView',

  components: {
    DepositForm,
    PageLayout,
  },

  setup () {
    const depositStore = useDepositStore()
    const route = useRoute()

    const isLoadingDeposit = ref(false)

    const form = reactive({
      amount: null,
      status: '',
      createdAt: null,
      depositTariff: null,
      client: {},
    })

    const formClone = cloneDeep(form)

    const id = computed(() => +route.params.id)
    const deposit = computed(() => depositStore.deposit)
    const breadcrumbs = computed(() => [{ name: 'DepositList', label: 'Депозиты' }, 'ID: ' + id.value])
    const buttonVisibility = computed(() =>
      deposit?.value.status && deposit?.value.status !== statusesDeposit.COMPLETED && deposit?.value.status !== statusesDeposit.CLOSED)
    const buttonType = computed(() => deposit.value.status === statusesDeposit.CREATED ? 'primary' : 'danger')
    const buttonTitle = computed(() =>
      deposit.value.status === statusesDeposit.CREATED
        ? 'Принять в работу'
        : 'Досрочно закрыть',
    )

    const fetchData = async () => {
      isLoadingDeposit.value = true

      await depositStore.fetchItem(id.value)
        .catch(getErrorHandler('Не удалось загрузить депозит.'))

      isLoadingDeposit.value = false
    }

    const updateStatus = async () => {
      const status = deposit.value.status === statusesDeposit.CREATED ? statusesDeposit.WORKING : statusesDeposit.CLOSED

      await depositStore.updateItemStatus({
        id: id.value,
        payload: { status },
      })
        .then((res) => {
          const { status } = res

          successHandler(status === statusesDeposit.WORKING ? 'Депозит был принят в работу.' : 'Депозит был досрочно закрыт.')
        })
        .catch(getErrorHandler('Не удалось обновить статус.'))
    }

    const showConfirmCloseDeposit = () => {
      Confirm.base({
        title: 'Досрочное закрытие',
        buttonType: 'danger',
        confirmButtonText: 'Закрыть',
        cancelButtonText: 'Отмена',
        heading: 'Вы уверены, что хотите досрочно закрыть депозит?',
        description: 'Депозит будет закрыт раньше срока, указанного в контракте. Сумма депозита вернется клиенту, выплаты по депозиту перестанут начисляться. При этом все начисленные выплаты останутся на личном счете клиента.',
        confirmType: 'DELETE',
      }).then(updateStatus)
    }

    watch(
      deposit,
      (data) => {
        const deposit = cloneDeep(data)

        merge(form, formCustomizer(deposit))
        merge(formClone, formCustomizer(deposit))
      }, { deep: true },
    )

    onMounted(async () => {
      if (deposit.value !== id.value) await fetchData()
    })

    return {
      isLoadingDeposit,
      buttonTitle,
      buttonType,
      buttonVisibility,
      deposit,
      id,
      breadcrumbs,
      statusesDepositLabels,
      statusesDeposit,
      updateStatus,
      showConfirmCloseDeposit,
    }
  },
})
</script>

<style lang="scss">
.DepositView {}
</style>
