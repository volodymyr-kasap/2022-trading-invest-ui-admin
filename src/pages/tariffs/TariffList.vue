<template>
  <PageLayout title="Тарифы">
    <template #actionButtons>
      <el-button
        type="primary"
        size="large"
        @click="$router.push({ name: 'TariffAdd' })"
      >
        Создать тариф
      </el-button>
    </template>

    <template #mainContent>
      <Search
        v-model="filters.search"
        placeholder="Введите название тарифа или ID"
      />

      <el-table
        v-loading="loading"
        :fit="false"
        :data="tariffs"
        element-loading-spinner="el-icon-loading"
        empty-text="Нет данных по этому запросу"
        class="TariffList__table"
      >
        <el-table-column label="Тариф">
          <template #default="scope">
            <div class="TariffList__table-main">
              <p class="TariffList__table-text">
                {{ scope.row.name }}
              </p>

              <p class="TariffList__table-placeholder">
                ID: {{ scope.row.id }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Длительность">
          <template #default="scope">
            <p class="TariffList__table-text">
              {{ scope.row.dayDuration }} дней
            </p>
          </template>
        </el-table-column>

        <el-table-column label="Ставка">
          <template #default="scope">
            <p class="TariffList__table-text">
              {{ scope.row.rateFrom }} - {{ scope.row.rateTo }}%
            </p>
          </template>
        </el-table-column>

        <el-table-column
          label="Отображение для клиента"
          width="100"
        >
          <template #default="scope">
            <el-switch
              :model-value="scope.row.isVisible"
              size="default"
              class="TariffList__table-checkbox"
              @change="changeClientVisibility(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          width="20"
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
import { useTariffStore } from '@/stores/tariff'
import useRouterQueryBinder from '@/util/routerQueryBinder'
import { getErrorHandler, successHandler } from '@/util'
import { useRouter } from 'vue-router'
import { pick } from 'lodash-es'
import PageLayout from '@/layouts/PageLayout.vue'
import Search from '@/components/Search.vue'
import Pagination from '@/components/Pagination.vue'

export default defineComponent({
  name: 'TariffList',

  components: {
    PageLayout,
    Search,
    Pagination,
  },

  setup () {
    const router = useRouter()
    const tariffStore = useTariffStore()

    const loading = ref(false)

    const {
      query: filters,
      watcher: filtersWatcher,
    } = useRouterQueryBinder({
      page: 1,
      search: '',
    })

    const tariffs = computed(() => tariffStore?.tariffs)
    const total = computed(() => tariffStore?.total)
    const limit = computed(() => tariffStore?.limit)

    const fetchData = async () => {
      loading.value = true

      await tariffStore.fetchItems(filters)
        .catch(getErrorHandler('Не удалось загрузить список тарифов.'))

      loading.value = false
    }

    const changeClientVisibility = async (data) => {
      await tariffStore.updateItem({
        id: data.id,
        payload: {
          ...pick(data,
            [
              'name',
              'dayDuration',
              'rateFrom',
              'rateTo',
              'amountFrom',
              'amountTo',
            ],
          ),
          isVisible: !data.isVisible,
        },
      })
        .then((res) => {
          const { isVisible } = res

          successHandler(isVisible ? 'Тариф отображается у клиентов.' : 'Тариф был скрыт от клиентов.')
        })
    }
    const view = ({ id }) => router.push({ name: 'TariffView', params: { id } })

    filtersWatcher.add(() => {
      filters.page = 1
    }, { exclude: ['page'] })
    filtersWatcher.add(fetchData)

    onMounted(async () => {
      await fetchData()
    })

    return {
      total,
      filters,
      tariffs,
      limit,
      loading,
      changeClientVisibility,
      view,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.TariffList {
  &__table {
    margin-top: 28px;

    &-text {
      @include font-text-regular;
    }

    &-placeholder {
      margin-top: 2px;
      @include font-subhead-regular;
      color: var(--color-text-caption-lighten);
    }
  }
}
</style>
