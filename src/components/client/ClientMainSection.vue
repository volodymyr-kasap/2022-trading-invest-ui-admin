<template>
  <div class="ClientMainSection">
    <div class="ClientMainSection__cards">
      <ClientInfoCard
        v-for="(item, index) in cards"
        class="ClientMainSection__card"
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

    <ClientForm
      class="ClientMainSection__form"
      :is-loading="isLoading"
    />
  </div>
</template>

<script>
import ClientForm from '@/components/forms/ClientForm.vue'
import ClientInfoCard from '@/components/client/ClientInfoCard.vue'

import iconWallet from '@/assets/img/icons/icon-wallet.svg'
import iconDollar from '@/assets/img/icons/icon-dollar.svg'
import iconStonks from '@/assets/img/icons/icon-stonks.svg'
import iconPayout from '@/assets/img/icons/icon-payout.svg'

export default {
  name: 'ClientMainSection',

  components: {
    ClientInfoCard,
    ClientForm,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup () {
    const cards = [
      {
        icon: iconWallet,
        headline: 'Personal wallet',
        title: '$1000',
        description: 'Money in the wallet that belongs to the client.',
      },
      {
        icon: iconDollar,
        headline: 'Deposits',
        title: '3 $(2200)',
        description: 'Frozen wallet, money "in work".',
      },
      {
        icon: iconStonks,
        headline: 'Deposit bonus',
        title: '$1000',
        description: 'Money earned on deposits.',
      },
      {
        icon: iconPayout,
        headline: 'Paid out',
        title: '$900',
        description: 'The sum of all payouts sent by customers.',
      },
    ]

    return {
      cards,
    }
  },
}
</script>

<style lang="scss">
.ClientMainSection {
  &__form {
    margin-top: 40px;
  }

  &__cards {
    max-width: 1040px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__card {
    width: calc(25% - 46px);
  }
}
</style>
