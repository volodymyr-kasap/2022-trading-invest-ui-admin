<template>
  <el-dialog
    :model-value="confirmationInfo?.isVisible"
    custom-class="Confirm"
    width="700px"
    @close="confirmationInfo?.close()"
  >
    <template #title>
      <div class="Confirm__title">
        <component
          :is="componentIconType"
          :state="confirmationInfo?.isBlocked ? 'unblock': 'block'"
          color="var(--color-text-headline)"
        />

        {{ confirmationInfo?.title }}
      </div>
    </template>

    <h2>{{ confirmationInfo?.heading }}</h2>
    <p>{{ confirmationInfo?.description }}</p>

    <template #footer>
      <span class="Confirm__footer dialog-footer">
        <el-button
          size="large"
          @click="confirmationInfo?.reject()"
        >
          {{ confirmationInfo?.cancelButtonText }}
        </el-button>

        <el-button
          :type="confirmationInfo?.buttonType"
          size="large"
          @click="confirmationInfo?.resolve()"
        >
          {{ confirmationInfo?.confirmButtonText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { confirmationInfo } from '@/services/confirm/confirmationInfo'
import { confirmTypes } from '@/enums/confirmTypes'
// import InfoIcon from '@shared/components/icons/InfoIcon'
import DeleteIcon from '@/components/icons/IconDelete.vue'
// import LockIcon from '@shared/components/icons/LockIcon'

export default defineComponent ({
  name: 'Confirm',

  components: {
    // LockIcon,
    DeleteIcon,
    // InfoIcon,
  },

  setup () {
    const type = computed(() => confirmTypes[confirmationInfo.confirmType])
    const componentIconType = computed(() => {
      if (type.value === confirmTypes.DELETE) return 'DeleteIcon'
      else if (type.value === confirmTypes.BLOCK) return 'LockIcon'
      else return 'InfoIcon'
    })

    return {
      type,
      componentIconType,
      confirmationInfo,
    }
  },
})
</script>

<style lang="scss">
.Confirm {
  &__title {
    display: flex;
    align-items: center;
    color: var(--color-text-headline);
    font-weight: var(--font-weight-medium);

    svg, img {
      margin-right: 15px;
    }
  }
}
</style>
