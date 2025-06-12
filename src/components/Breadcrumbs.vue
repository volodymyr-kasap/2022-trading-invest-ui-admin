<template>
  <div class="Breadcrumbs">
    <el-button
      v-if="breadcrumbs.length > 1"
      class="Breadcrumbs__button"
      size="default"
      @click="$router.go(-1)"
    >
      Назад
    </el-button>

    <div class="Breadcrumbs__items">
      <div
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="Breadcrumbs__item"
      >
        <template v-if="typeof item === 'string'">
          {{ item }}
        </template>

        <template v-else>
          <router-link :to="item">
            {{ item.label }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Breadcrumbs',

  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.Breadcrumbs {
  display: flex;
  align-items: center;
  padding: 14px 28px;

  &__items {
    display: flex;
    align-items: center;
    margin-left: 25px;
  }

  &__item {
    @include font-text-medium;
    position: relative;
    color: var(--color-text-regular);
    margin-left: 20px;
    padding: 2px 6px;

    &::after {
      content: '/';
      position: absolute;
      right: -12px;
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
      word-break: break-word;

      &::after {
        content: none;
      }
    }
  }

  &__button {
    @include font-text-medium;
    color: var(--color-text-regular);
    padding: 3px 16px;
    border-radius: 10px;
    border: 1px solid var(--color-border-grey-light-2);
  }
}
</style>
