<template>
  <div class="Search">
    <el-input
      :model-value="modelValue"
      :placeholder="placeholder"
      :style="{ 'width': width + 'px' }"
      class="Search__input"
      size="large"
      clearable
      type="text"
      @input="$emit('update:modelValue', $event)"
      @clear="$emit('update:modelValue', $event)"
    >
      <template #suffix>
        <img
          class="Search_icon"
          src="@/assets/img/icons/icon-search.svg"
          alt="search"
        >
      </template>
    </el-input>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Search',

  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 312,
    },
  },

  emits: ['update:modelValue'],
})
</script>

<style lang="scss">
.Search {
  &__input {
    .el-input {
      &__inner {
        &::placeholder {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
