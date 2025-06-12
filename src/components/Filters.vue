<template>
  <div class="Filters">
    <div class="Filters__main">
      <slot name="main" />

      <el-button
        v-if="moreFilters"
        class="Filters__button"
        size="large"
        type="primary"
        plain
        @click="isAllFilters = !isAllFilters"
      >
        <template #icon>
          <EqualizerIcon />
        </template>

        Еще
      </el-button>
    </div>

    <transition name="Filters__transition">
      <div
        v-if="isAllFilters"
        class="Filters__additional"
      >
        <slot name="additional" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import EqualizerIcon from '@/components/icons/EqualizerIcon.vue'

export default defineComponent({
  name: 'Filters',

  components: {
    EqualizerIcon,
  },

  props: {
    moreFilters: {
      type: Boolean,
      default: false,
    },
  },

  setup () {
    const isAllFilters = ref(false)

    return {
      isAllFilters,
    }
  },
})
</script>

<style lang="scss">
.Filters {
  display: flex;
  flex-direction: column;
  margin-top: 21px;

  &__main {
    display: flex;
    align-items: center;
  }

  &__additional {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  &__button {
    margin-left: auto;
  }

  &__transition {
    &-enter-active, &-leave-active {
      transition: opacity .2s;
    }
    &-enter-from, &-leave-to {
      opacity: 0;
    }
  }
}
</style>
