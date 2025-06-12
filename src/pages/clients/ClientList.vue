<template>
  <PageLayout
    class="ClientList"
    title="Клиенты"
  >
    <template #mainContent>
      <Search
        v-model="filters.search"
        class="ClientList__search"
        placeholder="Введите ID или email клиента"
      />

      <Filters class="ClientList__options">
        <template #main>
          <el-date-picker
            v-model="dateRange"
            class="ClientList__options-date"
            size="large"
            type="daterange"
            start-placeholder="От"
            end-placeholder="До"
          />

          <el-select
            v-model="filters.status"
            class="ClientList__options-select"
            size="large"
            placeholder="Статус"
            clearable
          >
            <el-option
              v-for="status in statusesClientLabelsArray"
              :key="status.value"
              :label="status.label"
              :value="status.value"
              class="ClientList__options-select-item"
            />
          </el-select>
        </template>
      </Filters>

      <ClientTable
        class="ClientList__table"
        :is-loading="isLoading"
        :clients="clients"
      />

      <Pagination
        :current-page="+filters.page"
        :page-size="limit"
        :total="total"
        @current-change="filters.page = $event"
      />
    </template>
  </PageLayout>
</template>

<script>
import { ref, defineComponent, computed, onMounted } from 'vue'
import useRouterQueryBinder from '@/util/routerQueryBinder'
import { getErrorHandler } from '@/util'
import { useClientStore } from '@/stores/client'
import { statusesClientLabelsArray } from '@/util/variables/statusesClientLabels'
import PageLayout from '@/layouts/PageLayout.vue'
import Search from '@/components/Search.vue'
import Pagination from '@/components/Pagination.vue'
import ClientTable from '@/components/client/ClientTable.vue'
import Filters from '@/components/Filters.vue'

export default defineComponent({
  name: 'ClientList',

  components: {
    Filters,
    ClientTable,
    Search,
    PageLayout,
    Pagination,
  },

  setup () {
    const clientStore = useClientStore()

    const isLoading = ref(false)

    const {
      query: filters,
      watcher: filtersWatcher,
    } = useRouterQueryBinder({
      page: 1,
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    })

    const clients = computed(() => clientStore?.clients)
    const total = computed(() => clientStore?.total)
    const limit = computed(() => clientStore?.limit)
    const dateRange = computed({
      get: () => [filters.dateFrom, filters.dateTo],

      set: (date) => {
        filters.dateFrom = date?.length ? date[0] : ''
        filters.dateTo = date?.length ? date[1] : ''
      },
    })

    const fetchData = async () => {
      isLoading.value = true

      await clientStore.fetchItems(filters)
        .catch(getErrorHandler('Не удалось загрузить список клиентов.'))

      isLoading.value = false
    }

    filtersWatcher.add(() => {
      filters.page = 1
    }, { exclude: ['page'] })
    filtersWatcher.add(fetchData)

    onMounted(async () => {
      await fetchData()
    })

    return {
      isLoading,
      clients,
      dateRange,
      filters,
      total,
      limit,
      statusesClientLabelsArray,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientList {
  &__options {
    margin-top: 20px;

    &-date {
      max-width: 312px;
    }

    &-select {
      margin-left: 24px;
    }
  }

  &__table {
    margin-top: 32px;
  }
}
</style>
