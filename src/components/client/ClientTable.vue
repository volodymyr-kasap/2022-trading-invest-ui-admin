<template>
  <el-table
    v-loading="isLoading"
    class="ClientTable"
    element-loading-spinner="el-icon-loading"
    empty-text="Нет данных по этому запросу"
    :fit="false"
    :data="clients"
  >
    <el-table-column
      class="ClientTable__column"
      label="Клиент"
      min-width="140"
    >
      <template #default="scope">
        <p class="ClientTable__column-text">
          {{ scope.row.email }}
        </p>

        <p class="ClientTable__column-placeholder">
          ID: {{ scope.row.id }}
        </p>
      </template>
    </el-table-column>

    <el-table-column
      class="ClientTable__column"
      label="Баланс"
      min-width="50"
    >
      <template #default="scope">
        <p class="ClientTable__column-text">
          ${{ scope.row.balanceAmount }}
        </p>
      </template>
    </el-table-column>

    <el-table-column
      class="ClientTable__column"
      label="Депозиты"
      min-width="50"
    >
      <template #default="scope">
        <p class="ClientTable__column-text">
          {{ scope.row.depositsInfo.count }} (${{ scope.row.depositsInfo.amount }})
        </p>
      </template>
    </el-table-column>

    <el-table-column
      class="ClientTable__column"
      prop="referralsCount"
      label="Рефералы"
      min-width="50"
    />

    <el-table-column
      class="ClientTable__column"
      label="Дата регистрации"
    >
      <template #default="scope">
        <p class="ClientTable__column-text">
          {{ formatDate(scope.row.createdAt, 'dd.MM.yyyy', true) }}
        </p>
      </template>
    </el-table-column>

    <el-table-column
      class="ClientTable__column"
      label="Статус"
      min-width="50"
    >
      <template #default="scope">
        <p
          class="ClientTable__column-text"
          :class="statusCssClass(scope.row)"
        >
          {{ statusesClientLabels[scope.row.status] }}
        </p>

        <p
          v-if="scope.row.status === statusesClient.BLOCKED"
          class="ClientTable__column-placeholder"
        >
          {{ formatDate(scope.row.blockedAt, 'dd.MM.yyyy HH:mm', true) }}
        </p>
      </template>
    </el-table-column>

    <el-table-column
      class="ClientTable__column"
      width="20"
      align="right"
    >
      <template #default="scope">
        <button @click="view(scope.row)">
          <img
            src="@/assets/img/icons/icon-arrow-right.svg"
            alt="arrow"
          >
        </button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/util'
import { statusesClient } from '@/enums/statusesClient'
import { statusesClientLabels } from '@/util/variables/statusesClientLabels'

export default defineComponent({
  name: 'ClientTable',

  props: {
    clients: {
      type: Array,
      default: () => ([]),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup () {
    const router = useRouter()

    const statusCssClass = ({ status }) =>
      status === statusesClient.ACTIVE
        ? 'ClientTable__column-text--active'
        : 'ClientTable__column-text--blocked'
    const view = ({ id }) => router.push({ name: 'ClientView', params: { id } })

    return {
      statusesClient,
      statusesClientLabels,
      statusCssClass,
      formatDate,
      view,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientTable {
  &__column {
    &-text {
      @include font-text-regular;
      color: var(--color-text-regular);
      white-space: nowrap;

      &--active {
        color: var(--color-success);
      }

      &--blocked {
        color: var(--color-danger);
      }
    }

    &-placeholder {
      @include font-subhead-regular;
      color: var(--color-text-caption-lighten);
      margin-top: 2px;
      white-space: nowrap;
    }
  }
}
</style>
