import { merge } from 'lodash-es'
import { confirmationInfo } from '@/services/confirm/confirmationInfo'

const close = async () => {
  confirmationInfo.isVisible = false
}

export const baseConfirm = (options) => new Promise((resolve, reject) => {
  merge(confirmationInfo, {
    resolve: async () => {
      await close()
      return resolve()
    },
    reject: async () => {
      await close()
      return reject()
    },
    close,
    ...options,
  })

  confirmationInfo.isVisible = true
})
