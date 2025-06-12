<template>
  <PageLayout
    class="TariffAdd"
    title="Новый тариф"
    :breadcrumbs="breadcrumbs"
  >
    <template #actionButtons>
      <el-button
        :loading="loading"
        type="primary"
        size="large"
        @click="save"
      >
        Создать
      </el-button>
    </template>

    <template #mainContent>
      <TariffForm
        ref="templateForm"
        :model="form"
        class="TariffAdd__form"
      />
    </template>
  </PageLayout>
</template>

<script>
import { computed, reactive, ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorHandler, successHandler } from '@/util'
import { useTariffStore } from '@/stores/tariff'
import PageLayout from '@/layouts/PageLayout.vue'
import TariffForm from '@/components/forms/TariffForm.vue'

export default defineComponent({
  name: 'TariffAdd',

  components: {
    PageLayout,
    TariffForm,
  },

  setup () {
    const tariffStore = useTariffStore()
    const router = useRouter()
    const form = reactive({
      name: '',
      dayDuration: null,
      rateFrom: null,
      rateTo: null,
      amountFrom: null,
      amountTo: null,
      isVisible: false,
    })
    
    const loading = ref(false)
    const templateForm = ref(null)
    
    const breadcrumbs = computed(() => [{ name: 'TariffList', label: 'Тарифы' }, 'Новый тариф'])

    const save = async () => {
      // if (!await templateForm.value.$refs.form.validate().catch(() => 0)) return

      loading.value = true

      await tariffStore.addItem(form)
        .then(() => {
          successHandler('Новый тариф был создан.')
          router.push({ name: 'TariffList' })
        })
        .catch(getErrorHandler('Данные были введены неправильно или некоторые поля не заполнены.'))

      loading.value = false
    }

    return {
      templateForm,
      form,
      loading,
      breadcrumbs,
      save,
    }
  },
})
</script>

<style lang="scss">
.TariffAdd {}
</style>
