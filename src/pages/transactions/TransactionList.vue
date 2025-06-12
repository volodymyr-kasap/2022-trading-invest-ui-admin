<template>
  <PageLayout
    class="TransactionList"
    title="Транзакции"
  >
    <template #actionButtons>
      <el-button
        class="TransactionList__button"
        size="large"
        type="primary"
        @click="$router.push({ name: 'TransactionAdd' })"
      >
        Создать транзакцию
      </el-button>
    </template>

    <template #mainContent>
      <Search
        v-model="filters.search"
        class="TransactionList__search"
        placeholder="Введите ID транзакции"
      />

      <Filters
        class="TransactionList__options"
        more-filters
      >
        <template #main>
          <el-date-picker
            v-model="dateRange"
            class="TransactionList__options-date"
            size="large"
            clearable
            type="daterange"
            start-placeholder="От"
            end-placeholder="До"
          />

          <el-select
            v-model="filters.clientId"
            class="TransactionList__options-select"
            filterable
            size="large"
            clearable
            placeholder="Введите ID или email клиента"
          >
            <template #prefix>
              <img
                class="TransactionList__options-select-icon"
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

          <el-select
            v-model="filters.status"
            class="TransactionList__options-select"
            size="large"
            placeholder="Статус"
            clearable
          >
            <el-option
              v-for="status in statusesTransactionLabelsArray"
              :key="status.value"
              :label="status.label"
              :value="status.value"
              class="TransactionList__options-select-item"
            />
          </el-select>
        </template>

        <template #additional>
          <el-select
            v-model="filters.reasonType"
            class="TransactionList__options-select"
            size="large"
            placeholder="Тип"
            clearable
          >
            <el-option
              v-for="type in reasonTypesLabelsArray"
              :key="type.value"
              :label="type.label"
              :value="type.value"
              class="TransactionList__options-select-item"
            />
          </el-select>
        </template>
      </Filters>

      <el-table
        v-loading="isLoading"
        :fit="false"
        :data="transactions"
        class="TransactionList__table"
        element-loading-spinner="el-icon-loading"
        empty-text="Нет данных по этому запросу"
      >
        <el-table-column
          class="TransactionList__column"
          label="ID"
          min-width="50"
        >
          <template #default="scope">
            <p class="TransactionList__column-text">
              {{ scope.row.id }}
            </p>

            <p class="TransactionList__column-placeholder">
              {{ formatDate(scope.row.createdAt, 'dd.MM.yyyy', true) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          label="Сумма"
          min-width="50"
        >
          <template #default="scope">
            <p class="TransactionList__column-text">
              ${{ scope.row.amount }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          label="Тип транзакции"
          min-width="100"
        >
          <template #default="scope">
            <el-tooltip
              :content="reasonTypesLabels[scope.row.reasonType]"
              class="TransactionList__column-container"
              effect="dark"
              placement="bottom-end"
            >
              <p class="TransactionList__column-type">
                {{ reasonTypesLabels[scope.row.reasonType] }}
              </p>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          label="Клиент"
          min-width="110"
        >
          <template #default="scope">
            <p class="TransactionList__column-text">
              {{ scope.row.client.email }}
            </p>

            <p class="TransactionList__column-placeholder">
              ID: {{ scope.row.client.id }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          prop="description"
          label="Описание"
        >
          <template #default="scope">
            <el-tooltip
              :content="scope.row.description ?? '–'"
              class="TransactionList__column-container"
              effect="dark"
              placement="bottom-end"
            >
              <p class="TransactionList__column-text">
                {{ scope.row.description ?? '–' }}
              </p>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          label="Статус"
        >
          <template #default="scope">
            <p
              class="TransactionList__column-text"
              :class="`TransactionList__column-text--${setStatusColor(scope.row)}`"
            >
              {{ selectStatus(scope.row) }}
            </p>

            <p class="TransactionList__column-placeholder">
              {{ selectStatusDate(scope.row) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="TransactionList__column"
          align="right"
          min-width="20"
        >
          <template #default="scope">
            <button @click.stop="view(scope.row)">
              <img
                class="TariffList__table-arrow"
                src="@/assets/img/icons/icon-arrow-right.svg"
                alt="arrow"
              >
            </button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :current-page="+filters.page"
        :page-size="2"
        :total="3"
        @current-change="filters.page = $event"
      />
    </template>
  </PageLayout>
</template>

<script>
import { ref, defineComponent, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorHandler, formatDate } from '@/util'
import useRouterQueryBinder from '@/util/routerQueryBinder'
import { lowerCase } from 'lodash-es'
import { useTransactionStore } from '@/stores/transaction'
import { useResourcesStore } from '@/stores/resources'
import { statusesTransaction } from '@/enums/statusesTransaction'
import { statusesPayout } from '@/enums/statusesPayout'
import { statusesPayment } from '@/enums/statusesPayment'
import { statusesPaymentLabels } from '@/util/variables/statusesPaymentLabels'
import { statusesPayoutLabels } from '@/util/variables/statusesPayoutLabels'
import { statusesTransactionLabelsArray, statusesTransactionLabels } from '@/util/variables/statusesTransactionLabels'
import { reasonTypesLabelsArray, reasonTypesLabels } from '@/util/variables/reasonTypesLabels'
import PageLayout from '@/layouts/PageLayout.vue'
import Search from '@/components/Search.vue'
import Filters from '@/components/Filters.vue'
import Pagination from '@/components/Pagination.vue'

export default defineComponent({
  name: 'TransactionList',

  components: {
    Filters,
    Search,
    PageLayout,
    Pagination,
  },

  setup () {
    const router = useRouter()
    const transactionStore = useTransactionStore()
    const resourcesStore = useResourcesStore()

    const isLoading = ref(false)

    const {
      query: filters,
      watcher: filtersWatcher,
    } = useRouterQueryBinder({
      page: 1,
      search: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      reasonType: '',
      clientId: '',
    })

    const transactions = computed(() => transactionStore?.transactions)
    const clients = computed(() => resourcesStore?.clients)
    const total = computed(() => transactionStore?.total)
    const limit = computed(() => transactionStore?.limit)
    const dateRange = computed({
      get: () => [filters.dateFrom, filters.dateTo],

      set: (date) => {
        filters.dateFrom = date?.length ? date[0] : ''
        filters.dateTo = date?.length ? date[1] : ''
      },
    })

    const fetchData = async () => {
      isLoading.value = true

      await transactionStore.fetchItems(filters)
        .catch(getErrorHandler('Не удалось загрузить список транзакций.'))

      isLoading.value = false
    }

    const fetchClients = async () => {
      await resourcesStore.fetchClients()
        .catch(getErrorHandler('Не удалось загрузить список клиентов.'))
    }

    const setStatusColor = (row) => {
      const status = row?.transactionInfoPayment?.status || row?.transactionInfoPayout?.status || row.status

      return lowerCase(statusesTransaction[status])
    }

    const selectStatus = (row) => {
      const { status, transactionInfoPayment, transactionInfoPayout } = row

      if (transactionInfoPayment) return statusesPaymentLabels[status]
      if (transactionInfoPayout) return statusesPayoutLabels[status]

      return statusesTransactionLabels[status]
    }

    const selectStatusDate = (row) => {
      const { transactionInfoPayment, transactionInfoPayout, updatedAt } = row

      if (transactionInfoPayment) {
        const { status, rejectedAt, approvedAt } = transactionInfoPayment

        if (status === statusesPayment.FAILED) return formatDate(rejectedAt, 'dd.MM.yyyy HH:mm', true)
        if (status === statusesPayment.SUCCESS) return formatDate(approvedAt, 'dd.MM.yyyy HH:mm', true)
      }

      if (transactionInfoPayout) {
        const { status, rejectedAt, approvedAt } = transactionInfoPayout

        if (status === statusesPayout.REJECTED) return formatDate(rejectedAt, 'dd.MM.yyyy HH:mm', true)
        if (status === statusesPayout.SUCCESS) return formatDate(approvedAt, 'dd.MM.yyyy HH:mm', true)
      }

      return formatDate(updatedAt, 'dd.MM.yyyy HH:mm', true)
    }

    const view = ({ id }) => router.push({ name: 'TransactionView', params: { id } })

    filtersWatcher.add(() => {
      filters.page = 1
    }, { exclude: ['page'] })
    filtersWatcher.add(fetchData)

    onMounted(async () => {
      await fetchData()
      await fetchClients()
    })

    return {
      isLoading,
      filters,
      dateRange,
      transactions,
      clients,
      lowerCase,
      total,
      limit,
      statusesTransaction,
      reasonTypesLabelsArray,
      reasonTypesLabels,
      statusesTransactionLabelsArray,
      statusesTransactionLabels,
      formatDate,
      selectStatusDate,
      selectStatus,
      setStatusColor,
      view,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.TransactionList {
  &__options {
    margin-top: 20px;

    &-date {
      max-width: 312px;
    }

    &-select {
      margin-left: 24px;

      &:first-child {
        margin-left: 0;
      }

      &--full-size {
        width: 312px;
      }
    }
  }

  &__table {
    margin-top: 32px;
  }

  &__column {
    &-text {
      @include font-text-regular;
      color: var(--color-text-regular);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &--success {
        color: var(--color-success);
      }

      &--pending {
        color: var(--color-warning);
      }

      &--failed {
        color: var(--color-danger);
      }

      &--rejected {
        color: var(--color-danger);
      }
    }

    &-button {
      @include font-text-regular;
      background-color: var(--color-primary-lighten-1) !important;

      & > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-placeholder {
      @include font-subhead-regular;
      color: var(--color-text-caption-lighten);
      margin-top: 2px;
      white-space: nowrap;
    }

    &-type {
      @include font-text-regular;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-radius: 8px;
      color: var(--color-primary);
      background-color: var(--color-primary-lighten-1);
      padding: 6px 8px;
    }
  }
}
</style>
