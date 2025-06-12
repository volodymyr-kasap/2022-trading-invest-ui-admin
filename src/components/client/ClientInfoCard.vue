<template>
  <div class="ClientInfoCard">
    <div class="ClientInfoCard__header">
      <slot name="icon" />

      <p class="ClientInfoCard__header-title">
        {{ headline }}
      </p>
    </div>

    <p class="ClientInfoCard__title">
      {{ title }}
    </p>

    <p class="ClientInfoCard__description">
      {{ description }}
    </p>

    <el-button
      class="ClientInfoCard__button"
      size="large"
      type="primary"
      text
    >
      More

      <img
        class="ClientInfoCard__button-icon"
        src="@/assets/img/icons/icon-arrow-right-blue.svg"
        alt="arrow"
      >
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ClientInfoCard',

  props: {
    headline: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import "@/styles/mixins";

.ClientInfoCard {
  border-radius: 12px;
  background: #E6EEFF;
  height: 172px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;

    &-title {
      @include font-text-medium;
      color: var(--color-text-regular);
      margin-left: 8px;
    }
  }

  &__title {
    @include font-title-2-medium;
    color: var(--color-headline);
    margin-top: 16px;
  }

  &__description {
    @include font-subhead-regular;
    color: var(--color-text-regular-darken);
    margin-top: 8px;
  }

  &__button {
    margin-top: auto;
    margin-left: auto;

    &-icon {
      margin-left: 6px;
    }
  }
}
</style>
