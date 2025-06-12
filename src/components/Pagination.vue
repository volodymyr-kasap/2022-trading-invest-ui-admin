<template>
  <div
    v-if="$attrs.total"
    class="Pagination"
  >
    <el-pagination
      v-bind="$attrs"
      :pager-count="5"
      layout="prev, pager, next"
      @current-change="$emit('current-change', $event)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pagination',
  inheritAttrs: false,
  emits: ['current-change'],
})
</script>

<style lang="scss">
.Pagination {
  display: flex;
  justify-content: center;
  margin: 30px auto 0;

  .el-pagination {
    color: var(--color-text-regular-darken);

    button {
      min-width: 20px;
      height: 100%;
      line-height: 37px;
      background: none;

      &:hover {
        color: var(--color-text-caption-darken);
      }
    }

    .el-icon {
      font-size: 15px;
      line-height: 37px;
      height: inherit;

      &-arrow-left {
        line-height: 44px;
      }

      &-arrow-right {
        line-height: 43px;
      }

      &-more {
        font-size: 16px;
        line-height: 50px;
      }
    }

    .btn-prev, .btn-next {
      color: var(--color-text-regular-darken);

      i {
        font-weight: var(--font-weight-bold);

        svg {
          vertical-align: middle;
        }
      }
    }
  }

  .el-pager li {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-regular-darken);
    border-radius: 50%;
    font-size: 14px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    margin: 0 0 0 11px;

    &.is-active {
      color: var(--color-text-regular) !important;
      background: var(--color-bg-highlighting);
    }

    &:first-child {
      margin-left: 0;
    }

    &:hover {
      color: var(--color-text-regular);
      background: var(--color-bg-highlighting);
    }
  }
}
</style>
