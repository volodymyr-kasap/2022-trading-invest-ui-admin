<template>
  <PageLayout
    :title="client.email"
    :breadcrumbs="breadcrumbs"
  >
    <template #actionButtons>
      <el-button
        class="ClientView__button"
        size="large"
        :type="client.blockedAt ? 'warning' : 'danger'"
        plain
        @click="isModalOpen = true"
      >
        <template v-if="client.blockedAt">
          <img
            class="ClientView__button-icon"
            src="@/assets/img/icons/icon-unlock.svg"
            alt="icon"
          >

          Unlock
        </template>

        <template v-else>
          <img
            class="ClientView__button-icon"
            src="@/assets/img/icons/icon-lock.svg"
            alt="icon"
          >

          Lock
        </template>
      </el-button>

      <el-button
        class="ClientView__button"
        type="primary"
        size="large"
      >
        Save
      </el-button>
    </template>

    <template #navigation>
      <el-menu
        class="ClientView__menu"
        :default-active="menuActiveItem"
        mode="horizontal"
        :ellipsis="false"
        @select="(index) => menuActiveItem = index"
      >
        <el-menu-item
          v-for="(item, index) in menuItems"
          class="ClientView__menu-item"
          :key="index"
          :index="item.value"
        >
          {{ item.label }}
        </el-menu-item>
      </el-menu>
    </template>

    <template #mainContent>
      <component
        :is="currentComponentEnum[menuActiveItem]"
        :is-loading="isLoading"
      />
    </template>
  </PageLayout>
</template>

<script>
import { onBeforeMount, ref, defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import PageLayout from '@/layouts/PageLayout.vue'
import ClientMainSection from '@/components/client/ClientMainSection.vue'
import ClientReferralSection from '@/components/client/ClientReferralSection.vue'

export default defineComponent({
  name: 'ClientView',

  components: {
    PageLayout,
    ClientMainSection,
    ClientReferralSection,
  },

  setup () {
    const route = useRoute()
    const clientStore = useClientStore()

    const isLoading = ref(false)

    const id = computed(() => +route.params.id)
    const client = computed(() => clientStore.client)
    const breadcrumbs = computed(() => [{ name: 'ClientList', label: 'Клиенты' }, 'ID: ' + id.value])

    const menuItems = [
      {
        label: 'Main information',
        value: 'Main',
      },
      {
        label: 'Referral program',
        value: 'Referral',
      },
    ]
    const menuActiveItem = ref(menuItems[0].value)

    const currentComponentEnum = {
      [menuItems[0].value]: ClientMainSection,
      [menuItems[1].value]: ClientReferralSection,
    }

    onBeforeMount(async () => {
      isLoading.value = true

      await store.getClientById(route.params.id)

      isLoading.value = false
    })

    return {
      isLoading,
      menuActiveItem,
      menuItems,
      currentComponentEnum,
      client,
      breadcrumbs,
    }
  },
})
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientView {
  &__button {
    margin-left: 24px;

    &:first-child {
      margin-left: 0;
    }

    &-icon {
      margin-bottom: 2px;
      margin-right: 6px;
    }
  }

  &__menu {
    &-item {
      @include font-text-regular;
      padding: 12px 0;
      margin-left: 32px !important;

      &:first-child {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
