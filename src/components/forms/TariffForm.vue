<template>
  <el-form
    class="TariffForm"
    :model="model"
    @submit.prevent
  >
    <el-form-item
      v-if="!!id"
      class="TariffForm__elem"
      prop="id"
      label="ID"
    >
      <el-input
        v-model="formData.id"
        class="TariffForm__input"
        size="large"
        type="number"
        readonly
      />
    </el-form-item>

    <el-form-item
      v-if="!!formData.createdAt"
      class="TariffForm__elem"
      prop="createAt"
      label="Дата создания"
    >
      <el-input
        v-model="formData.createdAt"
        class="TariffForm__input"
        readonly
        size="large"
      />
    </el-form-item>

    <el-form-item
      class="TariffForm__elem"
      prop="name"
      label="Название"
    >
      <el-input
        v-model="formData.name"
        class="TariffForm__input"
        size="large"
      />
    </el-form-item>

    <el-form-item
      class="TariffForm__elem"
      prop="dayDuration"
      label="Длительность (дни)"
    >
      <el-input
        v-model.number="formData.dayDuration"
        class="TariffForm__input"
        size="large"
      />
    </el-form-item>

    <div class="TariffForm__row">
      <el-form-item
        class="TariffForm__row-item"
        prop="rateFrom"
        label="Ставка от (%)"
      >
        <el-input
          v-model.number="formData.rateFrom"
          class="TariffForm__input TariffForm__row-item-input"
          size="large"
          type="number"
        />
      </el-form-item>

      <el-form-item
        class="TariffForm__row-item"
        prop="rateTo"
        label="Ставка до (%)"
      >
        <el-input
          v-model.number="formData.rateTo"
          class="TariffForm__input TariffForm__row-item-input"
          size="large"
          type="number"
        />
      </el-form-item>
    </div>

    <div class="TariffForm__row">
      <el-form-item
        class="TariffForm__row-item"
        prop="amountFrom"
        label="Сумма депозита от ($)"
      >
        <el-input
          v-model.number="formData.amountFrom"
          class="TariffForm__input TariffForm__row-item-input"
          size="large"
          type="number"
        />
      </el-form-item>

      <el-form-item
        class="TariffForm__row-item"
        prop="amountTo"
        label="Сумма депозита до ($)"
      >
        <el-input
          v-model.number="formData.amountTo"
          class="TariffForm__input TariffForm__row-item-input"
          size="large"
          type="number"
        />
      </el-form-item>
    </div>

    <el-form-item
      class="TariffForm__elem TariffForm__checkbox-container"
      prop="isVisible"
    >
      <el-checkbox
        v-model="formData.isVisible"
        class="TariffForm__checkbox"
        label="Тариф виден для клиента"
        size="large"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'TariffForm',

  props: {
    model: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const route = useRoute()
    const formData = ref(props.model)

    const id = computed(() => +route.params.id)

    return {
      id,
      formData,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.TariffForm {
  width: 522px;

  &__input {
    @include font-text-regular;
    height: 38px;
  }

  &__elem {
    align-items: center;
  }

  &__checkbox {
    @include font-text-regular;
  }

  &__row {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    &-item {
      display: flex;
      flex-direction: column;
      width: calc(50% - 10px);

      &-input {
        margin-top: 8px;
      }
    }
  }
}
</style>
