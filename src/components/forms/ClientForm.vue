<template>
  <el-form
    v-loading="isLoading"
    class="ClientForm"
    element-loading-spinner="el-icon-loading"
    :model="client"
    @submit.prevent
  >
    <p class="ClientForm__title">
      Информация по клиенту
    </p>

    <el-form-item
      class="ClientForm__item"
      prop="id"
      label="ID"
    >
      <el-input
        v-model="client.id"
        class="ClientForm__input"
        size="large"
        readonly
      />
    </el-form-item>

    <el-form-item
      class="ClientForm__item"
      prop="name"
      label="Имя"
    >
      <el-input
        v-model="client.name"
        class="ClientForm__input"
        size="large"
        readonly
      />
    </el-form-item>

    <el-form-item
      class="ClientForm__item"
      prop="createdAt"
      label="Дата регистрации"
    >
      <el-input
        v-model="client.createdAt"
        class="ClientForm__input"
        size="large"
        readonly
      />
    </el-form-item>

    <el-form-item
      class="ClientForm__item"
      prop="email"
      label="Email"
    >
      <el-input
        v-model="client.email"
        class="ClientForm__input"
        size="large"
        readonly
      />
    </el-form-item>

    <el-form-item
      class="ClientForm__item"
      prop="password"
      label="Пароль"
    >
      <el-input
        v-model="client.password"
        class="ClientForm__input"
        size="large"
        show-password
        readonly
      />
    </el-form-item>

    <el-form-item
      class="ClientForm__item"
      prop="telegram"
      label="Telegram"
    >
      <el-input
        v-model="client.telegram"
        class="ClientForm__input"
        size="large"
        readonly
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/stores/client'

export default defineComponent({
  name: 'ClientForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup () {
    const store = useClientStore()

    const { client } = storeToRefs(store)

    return {
      client,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientForm {
  width: 522px;

  &__title {
    @include font-title-2-medium;
    color: var(--color-text-headline);
    margin-bottom: 28px;
  }

  &__item {
    align-items: center;
  }
}
</style>
