<template>
  <div class="ClientReferralSection">
    <div class="ClientReferralSection__cards">
      <ClientInfoCard
        v-for="(item, index) in cards"
        class="ClientReferralSection__card"
        :key="index"
        :headline="item.headline"
        :title="item.title"
        :description="item.description"
      >
        <template #icon>
          <img
            :src="item.icon"
            alt="icon"
          >
        </template>
      </ClientInfoCard>
    </div>

    <div class="ClientReferralSection__content">
      <p class="ClientReferralSection__title">
        Referrals information
      </p>

      <ClientTable
        class="ClientReferralSection__table"
        :is-loading="isLoading"
        :clients="clients"
      />
    </div>
  </div>
</template>

<script>
import { useClientStore } from '@/stores/client'
import { storeToRefs } from 'pinia'
import ClientInfoCard from '@/components/client/ClientInfoCard.vue'
import ClientTable from '@/components/client/ClientTable.vue'

import iconPeople from '@/assets/img/icons/icon-people.svg'
import iconCoins from '@/assets/img/icons/icon-coins.svg'

export default {
  name: 'ClientReferralSection',

  components: {
    ClientTable,
    ClientInfoCard,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup () {
    const store = useClientStore()

    const { clients } = storeToRefs(store)

    const cards = [
      {
        icon: iconPeople,
        headline: 'Registered',
        title: 5,
        description: 'Persons has registered with a referral link.',
      },
      {
        icon: iconCoins,
        headline: 'Opened deposits',
        title: '3 ($900)',
        description: 'Amount of referrals who opened deposits.',
      },
    ]

    return {
      clients,
      cards,
    }
  },
}
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientReferralSection {
  &__cards {
    max-width: 512px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__card {
    width: calc(50% - 40px);
  }

  &__content {
    margin-top: 40px;
  }

  &__title {
    @include font-title-2-medium;
    color: var(--color-text-headline);
  }

  &__table {
    margin-top: 28px;
  }
}
</style>
