<template>
  <div class="PageLayout">
    <Menu />

    <div class="PageLayout__content">
      <div class="PageLayout__header">
        <Breadcrumbs
          v-if="breadcrumbs.length > 0"
          :breadcrumbs="breadcrumbs"
          class="PageLayout__breadcrumbs"
        />

        <div class="PageLayout__header-main">
          <p class="PageLayout__header-title">
            {{ title }}
          </p>

          <div class="PageLayout__header-buttons">
            <slot name="actionButtons" />
          </div>
        </div>

        <div class="PageLayout__header-nav">
          <slot name="navigation" />
        </div>
      </div>

      <div class="PageLayout__main">
        <slot name="mainContent" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Menu from '@/components/Menu.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default defineComponent({
  name: 'PageLayout',

  components: {
    Breadcrumbs,
    Menu,
  },

  props: {
    breadcrumbs: {
      type: Array,
      default: () => ([]),
    },
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.PageLayout {
  display: flex;

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__header {
    width: 100%;
    border-bottom: 1px solid var(--color-border-white-light-1);

    &-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 28px;
    }

    &-title {
      @include font-title-1-bold;
      color: var(--color-text-headline);
    }

    &-nav {
      margin-top: -4px;
      padding: 0 28px;
      display: flex;
      align-items: center;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    padding: 28px;
  }
}
</style>
