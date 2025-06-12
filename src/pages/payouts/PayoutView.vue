<template>
  <PageLayout
    :title="`ID: ${id}`"
    :breadcrumbs="breadcrumbs"
  >
    <template
      v-if="payout?.status === statusesPayout.PENDING"
      #actionButtons
    >
      <el-button
        class="PayoutView__button"
        type="danger"
        size="large"
        plain
        @click="showConfirmCancelPayout"
      >
        Отклонить
      </el-button>

      <el-button
        class="PayoutView__button"
        type="primary"
        size="large"
        @click="showConfirmationModal = true"
      >
        Подтвердить
      </el-button>
    </template>

    <template #mainContent>
      <PayoutForm
        :model="payout"
        :is-loading="isLoading"
        class="PayoutView__form"
      />
    </template>
  </PageLayout>

  <el-dialog
    v-model="showConfirmationModal"
    title="Подтверждение выплаты"
    width="572px"
  >
    <el-form
      ref="templateForm"
      :model="form"
      @submit.prevent
    >
      <el-form-item
        :rules="{ required: true, message: 'Обязательное поле', trigger: 'blur' }"
        label="Hash"
        prop="hash"
      >
        <el-input
          v-model="form.hash"
          clearable
          size="large"
          @keyup.enter="updateStatus(statusesPayout.SUCCESS)"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          size="large"
          @click="showConfirmationModal = false"
        >
          Отмена
        </el-button>

        <el-button
          size="large"
          type="primary"
          @click="updateStatus(statusesPayout.SUCCESS)"
        >
          Подтвердить
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, defineComponent, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getErrorHandler, successHandler } from '@/util'
import { statusesPayout } from '@/enums/statusesPayout'
import { Confirm } from '@/services/confirm'
import { usePayoutStore } from '@/stores/payout'
import PageLayout from '@/layouts/PageLayout.vue'
import PayoutForm from '@/components/forms/PayoutForm.vue'

export default defineComponent({
  name: 'PayoutView',

  components: {
    PayoutForm,
    PageLayout,
  },

  setup () {
    const payoutStore = usePayoutStore()
    const route = useRoute()

    const isLoading = ref(false)
    const showConfirmationModal = ref(false)

    const templateForm = ref(null)

    const id = computed(() => +route.params.id)
    const payout = computed(() => payoutStore.payout)
    const transaction = computed(() => payout.value?.transaction)
    const breadcrumbs = computed(() => [{ name: 'PayoutList', label: 'Выплаты' }, 'ID: ' + id.value])

    const form = reactive({
      status: payout?.value?.status,
      hash: '',
    })

    const fetchData = async () => {
      isLoading.value = true

      await payoutStore.fetchItem(id.value)
        .catch(getErrorHandler('Не удалось загрузить выплату.'))

      isLoading.value = false
    }

    const updateStatus = async (status) => {
      if (!await templateForm.value?.validate().catch(() => 0) && status === statusesPayout.SUCCESS) return

      isLoading.value = true

      await payoutStore.updateItemStatus({
        id: id.value,
        payload: status === statusesPayout.SUCCESS ? { status, hash: form.hash } : { status },
      })
        .then((res) => {
          const { status } = res

          successHandler(status === statusesPayout.REJECTED ? 'Выплата отклонена.' : 'Выплата подтверждена.')
        })
        .catch(getErrorHandler('Не удалось обновить статус.'))

      showConfirmationModal.value = false
      isLoading.value = false
    }

    const showConfirmCancelPayout = () => {
      Confirm.base({
        title: 'Отклонение выплаты',
        buttonType: 'danger',
        confirmButtonText: 'Отклонить',
        cancelButtonText: 'Отмена',
        heading: 'Вы уверены, что хотите отклонить выплату?',
        description: 'В этом случае, запрос клиента на выплату будет отклонен.',
        confirmType: 'DELETE',
      }).then(async () => {
        await updateStatus(statusesPayout.REJECTED)
      })
    }

    onMounted(async () => {
      if (payout.value !== id.value) await fetchData()
    })

    return {
      id,
      breadcrumbs,
      payout,
      transaction,
      isLoading,
      form,
      showConfirmationModal,
      templateForm,
      statusesPayout,
      showConfirmCancelPayout,
      updateStatus,
    }
  },
})
</script>

<style lang="scss">
.PayoutView {
  &__button {
    margin-left: 24px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
