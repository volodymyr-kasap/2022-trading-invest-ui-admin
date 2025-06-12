<template>
  <div class="AuthPage">
    <h1 class="AuthPage__title">
      Trading Invest ADM System
    </h1>

    <h2 class="AuthPage__role">
      ADMIN
    </h2>

    <AuthForm />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AuthForm from '@/components/forms/AuthForm.vue'

export default defineComponent({
  name: 'AuthPage',

  components: {
    AuthForm,
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.AuthPage {
  padding-top: 80px;
  position: relative;

  &__title {
    @include font-title-1-bold;
    color: #3371E5;
    text-align: center;
    margin-bottom: 10px;
  }

  &__role {
    @include font-title-2-medium;
    text-align: center;
    color: #747485;
  }
}
</style>
