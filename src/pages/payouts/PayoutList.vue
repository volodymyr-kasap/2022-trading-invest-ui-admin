<template>
  <PageLayout
    class="PayoutList"
    title="Выплаты"
  >
    <template #mainContent>
      <Search
        v-model="filters.search"
        class="PayoutList__search"
        placeholder="Введите ID выплаты"
      />

      <Filters
        class="PayoutList__options"
        more-filters
      >
        <template #main>
          <el-date-picker
            v-model="dateRange"
            class="PayoutList__options-date"
            size="large"
            clearable
            type="daterange"
            start-placeholder="От"
            end-placeholder="До"
          />

          <el-select
            v-model="filters.clientId"
            class="PayoutList__options-select"
            filterable
            size="large"
            clearable
            placeholder="Введите ID или email клиента"
          >
            <template #prefix>
              <img
                class="PayoutList__options-select-icon"
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
            class="PayoutList__options-select"
            size="large"
            placeholder="Статус"
            clearable
          >
            <el-option
              v-for="status in statusesPayoutLabelsArray"
              :key="status.value"
              :label="status.label"
              :value="status.value"
              class="PayoutList__options-select-item"
            />
          </el-select>
        </template>

        <template #additional>
          <el-select
            v-model="filters.network"
            class="PayoutList__options-select"
            size="large"
            placeholder="Сеть"
            clearable
          >
            <el-option
              v-for="network in networkTypes"
              :key="network"
              :label="network"
              :value="network"
              class="PayoutList__options-select-item"
            />
          </el-select>
        </template>
      </Filters>

      <el-table
        v-loading="isLoading"
        :fit="false"
        :data="payouts"
        class="PayoutList__table"
        element-loading-spinner="el-icon-loading"
        empty-text="Нет данных по этому запросу"
      >
        <el-table-column
          class="PayoutList__column"
          label="ID"
        >
          <template #default="scope">
            <p class="PayoutList__column-text">
              {{ scope.row.id }}
            </p>

            <p class="PayoutList__column-placeholder">
              {{ formatDate(scope.row.createdAt, 'dd.MM.yyyy', true) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
          label="Сумма"
          min-width="80"
        >
          <template #default="scope">
            <el-input
              :model-value="scope.row.transaction?.amount"
              class="PayoutList__column-input"
              size="large"
              readonly
            >
              <template #append>
                <img
                  class="PayoutList__column-copy-icon"
                  src="@/assets/img/icons/icon-copy.svg"
                  alt="copy"
                  @click="copy(scope.row.transaction?.amount, 'Сумма скопирована и может быть использована (Ctrl + V)')"
                >
              </template>
            </el-input>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
          label="Клиент"
          min-width="140"
        >
          <template #default="scope">
            <p class="PayoutList__column-text">
              {{ scope.row.transaction?.client?.email }}
            </p>

            <p class="PayoutList__column-placeholder">
              ID: {{ scope.row.transaction?.client?.id }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
          prop="network"
          label="Сеть"
          min-width="60"
        >
          <template #default="scope">
            <el-button
              class="PayoutList__column-button"
              type="primary"
              size="large"
              text
              bg
            >
              {{ networkTypes[scope.row.payoutInfoCrypto?.network] }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
          prop="wallet"
          label="Кошелек"
        >
          <template #default="scope">
            <el-tooltip
              class="PayoutList__column-container"
              effect="dark"
              placement="bottom-end"
              :content="scope.row.payoutInfoCrypto?.wallet"
            >
              <el-input
                :model-value="scope.row.payoutInfoCrypto?.wallet"
                class="PayoutList__column-input"
                size="large"
                readonly
              >
                <template #append>
                  <img
                    class="PayoutList__column-copy-icon"
                    src="@/assets/img/icons/icon-copy.svg"
                    alt="copy"
                    @click="copy(scope.row.payoutInfoCrypto?.wallet, 'Кошелек скопирован и может быть использован (Ctrl + V)')"
                  >
                </template>
              </el-input>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
          prop="status"
          label="Статус"
        >
          <template #default="scope">
            <p
              class="PayoutList__column-text"
              :class="`PayoutList__column-text--${lowerCase(statusesPayout[scope.row?.status])}`"
            >
              {{ statusesPayoutLabels[scope.row?.status] }}
            </p>

            <p
              v-if="scope.row.rejectedAt || scope.row.approvedAt"
              class="PayoutList__column-placeholder"
            >
              {{ selectStatusDate(scope.row) }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          class="PayoutList__column"
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
import { getErrorHandler, formatDate, copy } from '@/util'
import { useRouter } from 'vue-router'
import { networkTypes } from '@/enums/networkTypes'
import { usePayoutStore } from '@/stores/payout'
import { useResourcesStore } from '@/stores/resources'
import { statusesPayoutLabelsArray, statusesPayoutLabels } from '@/util/variables/statusesPayoutLabels'
import { statusesPayout } from '@/enums/statusesPayout'
import { lowerCase } from 'lodash-es'
import PageLayout from '@/layouts/PageLayout.vue'
import Search from '@/components/Search.vue'
import Filters from '@/components/Filters.vue'
import Pagination from '@/components/Pagination.vue'

export default defineComponent({
  name: 'PayoutList',

  components: {
    Filters,
    Search,
    PageLayout,
    Pagination,
  },

  setup () {
    const router = useRouter()
    const payoutStore = usePayoutStore()
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
      network: '',
      clientId: '',
    })

    const payouts = computed(() => payoutStore?.payouts)
    const clients = computed(() => resourcesStore?.clients)
    const total = computed(() => payoutStore?.total)
    const limit = computed(() => payoutStore?.limit)
    const dateRange = computed({
      get: () => [filters.dateFrom, filters.dateTo],

      set: (date) => {
        filters.dateFrom = date?.length ? date[0] : ''
        filters.dateTo = date?.length ? date[1] : ''
      },
    })

    const fetchData = async () => {
      isLoading.value = true

      await payoutStore.fetchItems(filters)
        .catch(getErrorHandler('Не удалось загрузить список выплат.'))

      isLoading.value = false
    }

    const fetchClients = async () => {
      await resourcesStore.fetchClients()
        .catch(getErrorHandler('Не удалось загрузить список клиентов.'))
    }

    const selectStatusDate = (row) => {
      const { status, rejectedAt, approvedAt } = row

      return formatDate(
        status === statusesPayout.REJECTED ? rejectedAt : approvedAt,
        'dd.MM.yyyy HH:mm',
        true,
      )
    }
    const view = ({ id }) => router.push({ name: 'PayoutView', params: { id } })

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
      payouts,
      clients,
      lowerCase,
      total,
      limit,
      networkTypes,
      statusesPayout,
      statusesPayoutLabels,
      statusesPayoutLabelsArray,
      view,
      copy,
      formatDate,
      selectStatusDate,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.PayoutList {
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

      &--success {
        color: var(--color-success);
      }

      &--pending {
        color: var(--color-warning);
      }

      &--rejected {
        color: var(--color-danger);
      }
    }

    &-input {
      .el-input__wrapper {
        .el-input__inner {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .el-input-group__append {
        padding: 0 9px;
      }
    }

    &-button {
      @include font-text-regular;
      background-color: var(--color-primary-lighten-1) !important;
    }

    &-placeholder {
      @include font-subhead-regular;
      color: var(--color-text-caption-lighten);
      margin-top: 2px;
      white-space: nowrap;
    }

    &-copy-icon {
      cursor: pointer;
    }
  }
}
</style>
