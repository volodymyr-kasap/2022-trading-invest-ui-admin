<template>
  <div class="Menu">
    <div class="Menu__user">
      <div class="Menu__user-info">
        <div class="Menu__user-info-main">
          <img
            class="Menu__user-info-icon"
            src="@/assets/img/icons/icon-menu-user.svg"
            alt="avatar"
          >

          <p class="Menu__user-info-name">
            {{ admin?.name }}
          </p>
        </div>

        <p class="Menu__user-info-role">
          АДМИНИСТРАТОР
        </p>
      </div>

      <div class="Menu__user-buttons">
        <div class="Menu__user-button">
          <img
            class="Menu__user-button-icon"
            src="@/assets/img/icons/icon-menu-settings.svg"
            alt="icon"
          >

          <p class="Menu__user-button-title">
            Настройки
          </p>
        </div>

        <div
          class="Menu__user-button"
          @click="logout"
        >
          <img
            class="Menu__user-button-icon"
            src="@/assets/img/icons/icon-menu-logout.svg"
            alt="icon"
          >

          <p class="Menu__user-button-title">
            Выход
          </p>
        </div>
      </div>
    </div>

    <div
      v-for="(item, index) in nav"
      :key="index"
      class="Menu__menu"
    >
      <div class="Menu__menu-title">
        {{ item.title }}
      </div>

      <ul class="Menu__menu-nav">
        <li
          v-for="(route, index) in item.routes"
          :key="index"
          class="Menu__menu-nav-item"
          :class="{ 'Menu__menu-nav-item--active': activeMenu === route.slug }"
          @click="route.name && $router.push({ name: route.name })"
        >
          {{ route.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { navigation } from '@/router/navigation'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Menu',

  setup () {
    const authStore = useAuthStore()
    const adminStore = useAdminStore()

    const route = useRoute()
    const router = useRouter()

    const nav = ref(navigation)

    const admin = computed(() => adminStore?.admin)
    const activeMenu = computed(() => route.meta?.section)

    const logout = async () => {
      await authStore.signOut()
      await router.push({ name: 'Auth' })
    }

    return {
      nav,
      activeMenu,
      admin,
      logout,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.Menu {
  background: #F5F5F5;
  min-width: 340px;
  min-height: 100vh;
  border-right: 1px solid var(--color-border-grey-light-2);

  &__user {
    border-bottom: 1px solid var(--color-border-grey-light-2);
    padding: 12px 0 28px 16px;

    &-info {
      &-main {
        display: flex;
        align-items: center;
      }

      &-name {
        @include font-headline-medium;
        color: var(--color-text-headline);
        margin-left: 10px;
      }

      &-role {
        @include font-text-medium;
        color: var(--color-text-caption-lighten);
        margin-top: 12px;
      }
    }

    &-buttons {
      margin-top: 24px;
    }

    &-button {
      display: flex;
      align-items: center;
      margin-top: 16px;
      cursor: pointer;
      width: fit-content;

      &:first-child {
        margin-top: 0;
      }

      &-title {
        @include font-text-medium;
        margin-left: 8px;
        color: var(--color-text-regular);
      }
    }
  }

  &__menu {
    margin-top: 28px;

    &-title {
      @include font-subhead-medium;
      color: var(--color-text-regular-darken);
      margin-left: 16px;
      text-transform: uppercase;
    }

    &-nav {
      margin-top: 8px;
      width: 100%;

      &-item {
        @include font-text-medium;
        color: var(--color-text-regular);
        padding: 8px 0 8px 16px;
        cursor: pointer;

        &--active {
          background: #E7E7E7;
        }

        &:hover {
          background: #E7E7E7;
        }
      }
    }
  }
}
</style>
