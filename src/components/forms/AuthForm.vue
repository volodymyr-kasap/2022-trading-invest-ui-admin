<template>
  <el-form
    ref="templateForm"
    class="AuthForm"
    :model="form"
    :rules="rules"
    :disabled="loading"
    @submit.prevent
  >
    <div class="AuthForm__title">
      Авторизация
    </div>

    <el-form-item
      prop="email"
      label="Email"
    >
      <el-input
        v-model="form.email"
        placeholder="Enter email address"
        size="large"
        @blur="form.email = form.email.replace(/\s*/gi, '')"
      />
    </el-form-item>

    <el-form-item
      prop="password"
      label="Пароль"
    >
      <el-input
        v-model="form.password"
        placeholder="Enter password"
        size="large"
        show-password
      />
    </el-form-item>

    <div class="AuthForm__button">
      <el-button
        :loading="loading"
        type="primary"
        size="large"
        @click="submit"
      >
        Войти
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { reactive, ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorHandler } from '@/util'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'AuthForm',

  setup () {
    const authStore = useAuthStore()
    const router = useRouter()
    const templateForm = ref('')
    const loading = ref(false)

    const form = reactive({
      email: '',
      password: '',
    })

    const rules = reactive({
      email: [
        { required: true, message: 'Required field', trigger: 'blur' },
        { type: 'email', message: 'Invalid email address', trigger: 'blur' },
      ],
      password: [
        { required: true, message: 'Required field', trigger: 'blur' },
      ],
    })

    const submit = async () => {
      if (!await templateForm.value.validate().catch(() => 0)) return

      loading.value = true

      await authStore.signIn(form)
        .then(() => router.push({ name: 'TariffList' }))
        .catch(getErrorHandler('Incorrect login and password combination.'))

      loading.value = false
    }

    return {
      templateForm,
      loading,
      form,
      rules,
      submit,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.AuthForm {
  max-width: 642px;
  padding: 55px 60px 50px 60px;
  border-radius: 40px;
  margin: 110px auto 0;
  background: #F5F4F5;

  &__title {
    @include font-title-2-bold;
    text-align: center;
    margin-bottom: 40px;
    color: #4A4A56;
  }

  &__button {
    margin-top: 30px;
    text-align: right;
  }

  .el-form {
    &-item {
      &__content {
        display: flex;
      }

      &__label {
        color: var(--color-text-regular-darken);
        font-size: 16px;
        min-width: 200px;
        text-align: left;
      }

      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
