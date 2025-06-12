<template>
  <PageLayout
    class="DepositList"
    title="Депозиты"
  >
    <template #mainContent>
      <Search
        v-model="filters.search"
        placeholder="Введите ID депозита"
      />

      <Filters more-filters>
        <template #main>
          <el-date-picker
            v-model="dateRange"
            class="DepositList__options-date"
            size="large"
            type="daterange"
            clearable
            start-placeholder="От"
            end-placeholder="До"
          />

          <el-select
            v-model="filters.status"
            class="DepositList__options-select"
            placeholder="Статус"
            size="large"
            clearable
          >
            <el-option
              v-for="status in statusesDepositLabelsArray"
              :key="status.value"
              :value="status.value"
              :label="status.label"
            />
          </el-select>

          <el-select
            v-model="filters.depositTariffId"
            class="DepositList__options-select"
            placeholder="Тариф"
            size="large"
            clearable
          >
            <el-option
              v-for="tariff in tariffs"
              :key="tariff.id"
              :value="tariff.id"
              :label="`${tariff.name} ${tariff.description}`"
            />
          </el-select>
        </template>

        <template #additional>
          <el-select
            v-model="filters.clientId"
            class="PayoutListPage__options-select"
            style="min-width: 312px"
            filterable
            clearable
            size="large"
            placeholder="Введите ID или email клиента"
          >
            <template #prefix>
              <img
                class="PayoutListPage__options-select-icon"
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
        </template>
      </Filters>

      <el-table
        v-loading="isLoading"
        :fit="false"
        :data="deposits"
        class="DepositList__table"
        element-loading-spinner="el-icon-loading"
        empty-text="Нет данных по этому запросу"
      >
        <el-table-column
          label="ID"
          min-width="50"
        >
          <template #default="scope">
            <div class="DepositList__column-item">
              <p class="DepositList__column-text">
                {{ scope.row.id }}
              </p>

              <p class="DepositList__column-placeholder">
                {{ formatDate(scope.row.createdAt, 'dd.MM.yyyy', true) }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="Сумма"
          min-width="50"
        >
          <template #default="scope">
            <p class="DepositList__column-text">
              ${{ scope.row.amount }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="Тариф">
          <template #default="scope">
            <div
              v-if="scope.row.depositTariff"
              class="DepositList__column-item"
            >
              <p class="DepositList__column-text">
                {{ scope.row.depositTariff.duration / 3600 / 24 }} дней {{ scope.row.depositTariff.rateFrom }}-{{ scope.row.depositTariff.rateTo }}%
              </p>

              <p class="DepositList__column-placeholder">
                ID: {{ scope.row.depositTariff.id }}
              </p>
            </div>

            <div v-else>
              –
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="Клиент"
          min-width="100"
        >
          <template #default="scope">
            <div class="DepositList__column-item">
              <p class="DepositList__column-text">
                {{ scope.row.client.email }}
              </p>

              <p class="DepositList__column-placeholder">
                ID: {{ scope.row.client.id }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Статус">
          <template #default="scope">
            <div class="DepositList__column-item">
              <p
                class="DepositList__column-text"
                :class="statusCssClass(scope.row)"
              >
                {{ statusesDepositLabels[scope.row.status] }}
              </p>

              <p
                v-if="scope.row.status !== statusesDeposit.CREATED"
                class="DepositList__column-placeholder"
              >
                {{ selectStatusDate(scope.row) }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="Действие"
          min-width="100"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === statusesDeposit.CREATED || scope.row.status === statusesDeposit.WORKING"
              type="primary"
              size="large"
              text
              bg
              @click="scope.row.status === statusesDeposit.WORKING ? showConfirmCloseDeposit(scope.row) : updateStatus(scope.row)"
            >
              {{ namesAction(scope.row.status) }}
            </el-button>

            <span
              v-else
              class="DepositList__column-hyphen"
            >
              —
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          width="20"
        >
          <template #default="scope">
            <button @click="view(scope.row)">
              <img
                class="DepositList__arrow"
                src="@/assets/img/icons/icon-arrow-right.svg"
                alt="arrow"
              >
            </button>
          </template>
        </el-table-column>
      </el-table>

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
import { useDepositStore } from '@/stores/deposit'
import { useResourcesStore } from '@/stores/resources'
import { statusesDeposit } from '@/enums/statusesDeposit'
import { statusesDepositLabelsArray, statusesDepositLabels } from '@/util/variables/statusesDepositLabels'
import { Confirm } from '@/services/confirm'
import useRouterQueryBinder from '@/util/routerQueryBinder'
import { getErrorHandler, formatDate, successHandler } from '@/util'
import { useRouter } from 'vue-router'
import PageLayout from '@/layouts/PageLayout.vue'
import Search from '@/components/Search.vue'
import Pagination from '@/components/Pagination.vue'
import Filters from '@/components/Filters.vue'

const statusCssClasses = {
  [statusesDeposit.CREATED]: 'DepositList__column-text--waiting',
  [statusesDeposit.WORKING]: 'DepositList__column-text--working',
  [statusesDeposit.COMPLETED]: 'DepositList__column-text--completed',
  [statusesDeposit.CLOSED]: 'DepositList__column-text--closed',
}

export default defineComponent({
  name: 'DepositList',

  components: {
    Filters,
    PageLayout,
    Search,
    Pagination,
  },

  setup () {
    const router = useRouter()
    const depositStore = useDepositStore()
    const resourcesStore = useResourcesStore()

    const isLoading = ref(false)

    const {
      query: filters,
      watcher: filtersWatcher,
    } = useRouterQueryBinder({
      page: 1,
      search: '',
      status: '',
      clientId: '',
      dateFrom: '',
      dateTo: '',
      depositTariffId: '',
    })

    const deposits = computed(() => depositStore?.deposits)
    const clients = computed(() => resourcesStore?.clients)
    const tariffs = computed(() => resourcesStore?.tariffs)
    const total = computed(() => depositStore?.total)
    const limit = computed(() => depositStore?.limit)
    const dateRange = computed({
      get: () => [filters.dateFrom, filters.dateTo],

      set: (date) => {
        filters.dateFrom = date?.length ? date[0] : ''
        filters.dateTo = date?.length ? date[1] : ''
      },
    })

    const fetchData = async () => {
      isLoading.value = true

      await depositStore.fetchItems(filters)
        .catch(getErrorHandler('Не удалось загрузить список депозитов.'))

      isLoading.value = false
    }

    const fetchClients = async () => {
      await resourcesStore.fetchClients()
        .catch(getErrorHandler('Не удалось загрузить список клиентов.'))
    }

    const fetchTariffs = async () => {
      await resourcesStore.fetchTariffs()
        .catch(getErrorHandler('Не удалось загрузить список тарифов.'))
    }

    const updateStatus = async ({ id, status }) => {
      status = status === statusesDeposit.CREATED ? statusesDeposit.WORKING : statusesDeposit.CLOSED

      await depositStore.updateItemStatus({
        id,
        payload: { status },
      })
        .then((res) => {
          const { status } = res

          successHandler(status === statusesDeposit.WORKING ? 'Депозит был принят в работу.' : 'Депозит был досрочно закрыт.')
        })
        .catch(getErrorHandler('Не удалось обновить статус.'))
    }

    const showConfirmCloseDeposit = (item) => {
      Confirm.base({
        title: 'Досрочное закрытие',
        buttonType: 'danger',
        confirmButtonText: 'Закрыть',
        cancelButtonText: 'Отмена',
        heading: 'Вы уверены, что хотите досрочно закрыть депозит?',
        description: 'Депозит будет закрыт раньше срока, указанного в контракте.',
        confirmType: 'DELETE',
      }).then(async () => await updateStatus(item))
    }

    const namesAction = (status) => status === statusesDeposit.CREATED ? 'Принять в работу' : 'Досрочно закрыть'
    const statusCssClass = ({ status }) => statusCssClasses[status]
    const view = ({ id }) => router.push({ name: 'DepositView', params: { id } })
    const selectStatusDate = (row) => {
      const { status, closedAt, startWorkingAt, completedAt } = row

      if (status === statusesDeposit.WORKING) return formatDate(startWorkingAt, 'dd.MM.yyyy HH:mm', true)
      if (status === statusesDeposit.COMPLETED) return formatDate(completedAt, 'dd.MM.yyyy HH:mm', true)
      if (status === statusesDeposit.CLOSED) return formatDate(closedAt, 'dd.MM.yyyy HH:mm', true)
    }

    filtersWatcher.add(() => {
      filters.page = 1
    }, { exclude: ['page'] })
    filtersWatcher.add(fetchData)

    onMounted(async () => {
      await fetchData()
      await fetchClients()
      await fetchTariffs()
    })

    return {
      deposits,
      clients,
      tariffs,
      dateRange,
      filters,
      isLoading,
      total,
      limit,
      statusesDeposit,
      statusesDepositLabels,
      statusesDepositLabelsArray,
      statusCssClass,
      formatDate,
      namesAction,
      view,
      updateStatus,
      selectStatusDate,
      showConfirmCloseDeposit,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.DepositList {
  &__options {
    margin-top: 20px;
    display: flex;
    align-items: center;

    &-date {
      max-width: 312px;
    }

    &-select {
      margin-left: 24px;

      &--clients {
        min-width: 312px;
      }
    }

    &-more {
      margin-left: auto;

      &-icon {
        margin-right: 6px;
      }
    }
  }

  &__table {
    margin-top: 32px;
  }

  &__column {
    &-item {
      display: flex;
      flex-direction: column;
    }

    &-text {
      @include font-text-regular;
      color: var(--color-text-regular);
      white-space: nowrap;

      &--waiting {
        color: var(--color-warning);
      }

      &--working {
        color: var(--color-primary);
      }

      &--completed {
        color: var(--color-success);
      }

      &--closed {
        color: var(--color-danger);
      }
    }

    &-placeholder {
      @include font-subhead-regular;
      color: var(--color-text-caption-lighten);
      margin-top: 2px;
      white-space: nowrap;
    }

    &-hyphen {
      @include font-text-regular;
    }
  }
}
</style>
