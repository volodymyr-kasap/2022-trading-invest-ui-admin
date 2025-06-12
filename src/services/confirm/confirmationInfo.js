import { reactive } from 'vue'
import { defaults } from '@/services/confirm/defaults'

export const confirmationInfo = reactive({
  isVisible: false,
  ...defaults,
})
