<template>
  <PageLayout
    v-loading="isLoadingTariff"
    class="TariffView"
    :title="'ID: ' + id"
    :breadcrumbs="breadcrumbs"
    element-loading-spinner="el-icon-loading"
  >
    <template #actionButtons>
      <el-button
        class="TariffView__button"
        size="large"
        type="danger"
        plain
        @click="showConfirmDeleteTariff"
      >
        <template #icon>
          <IconDelete />
        </template>
        Удалить
      </el-button>

      <el-button
        :loading="loading"
        class="TariffView__button"
        type="primary"
        size="large"
        @click="save"
      >
        Сохранить
      </el-button>
    </template>

    <template #mainContent>
      <TariffForm
        ref="templateForm"
        :model="form"
        class="TariffView__form"
      />
    </template>
  </PageLayout>
</template>

<script>
import { ref, defineComponent, reactive, watch, computed, onMounted } from 'vue'
import { getErrorHandler, formCustomizer, successHandler } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import { useTariffStore } from '@/stores/tariff'
import { Confirm } from '@/services/confirm'
import { cloneDeep, merge, pick } from 'lodash-es'
import PageLayout from '@/layouts/PageLayout.vue'
import TariffForm from '@/components/forms/TariffForm.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

export default defineComponent({
  name: 'TariffView',

  components: {
    TariffForm,
    PageLayout,
    IconDelete,
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const tariffStore = useTariffStore()

    const form = reactive({
      name: '',
      dayDuration: null,
      rateFrom: null,
      rateTo: null,
      amountFrom: null,
      amountTo: null,
      isVisible: false,
    })

    const formClone = cloneDeep(form)

    const loading = ref(false)
    const isLoadingTariff = ref(false)
    const isModalOpen = ref(false)
    const templateForm = ref(null)

    const id = computed(() => +route.params.id)
    const tariff = computed(() => tariffStore.tariff)
    const breadcrumbs = computed(() => [{ name: 'TariffList', label: 'Тарифы' }, 'ID: ' + id.value])

    const fetchData = async () => {
      isLoadingTariff.value = true

      await tariffStore.fetchItem(id.value)
        .catch(getErrorHandler('Не удалось загрузить тариф.'))

      isLoadingTariff.value = false
    }

    const save = async () => {
      // if (!await templateForm.value.$refs.form.validate().catch(() => 0)) return

      loading.value = true

      await tariffStore.updateItem({
        id: id.value,
        payload: pick(
          form,
          [
            'name',
            'dayDuration',
            'rateFrom',
            'rateTo',
            'amountFrom',
            'amountTo',
            'isVisible',
          ],
        ),
      })
        .then(() => {
          successHandler('Изменения по тарифу сохранены.')
          router.push({ name: 'TariffList' })
        })
        .catch(getErrorHandler('Данные были введены неправильно или некоторые поля не заполнены.'))

      loading.value = false
    }

    const deleteTariff = async () => {
      await tariffStore.deleteItem(id.value)
        .then(() => {
          successHandler('Тариф был удален.')
          router.push({ name: 'TariffList' })
        })
        .catch(getErrorHandler('Не удалось удалить тариф.'))
    }

    const showConfirmDeleteTariff = () => {
      Confirm.base({
        title: 'Удаление тарифа',
        buttonType: 'danger',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отменв',
        heading: 'Вы уверены, что хотите удалить тариф?',
        description: 'Тариф будет безвозвратно удален из системы.',
        confirmType: 'DELETE',
      }).then(deleteTariff)
    }

    watch(
      tariff,
      (data) => {
        const tariff = cloneDeep(data)

        merge(form, formCustomizer(tariff))
        merge(formClone, formCustomizer(tariff))
      }, { deep: true },
    )

    onMounted(async () => {
      if (tariff.value !== id.value) await fetchData()
    })

    return {
      form,
      loading,
      isLoadingTariff,
      isModalOpen,
      breadcrumbs,
      templateForm,
      id,
      showConfirmDeleteTariff,
      save,
    }
  },
})
</script>

<style lang="scss">
.TariffView {
  &__button {
    &-icon {
      margin-bottom: 3px;
    }
  }
}
</style>
