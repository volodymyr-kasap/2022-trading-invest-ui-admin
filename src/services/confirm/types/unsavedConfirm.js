import { isEqual } from 'lodash-es'
import { baseConfirm } from '@/services/confirm/types/baseConfirm'

export const unsavedConfirm = (options) => {
  return async (to, from, next) => new Promise((resolve, reject) => {
    if (isEqual(options.form, options.formClone)) {
      next()
    } else {
      baseConfirm({
        title: 'Unsaved changes',
        cancelButtonText: 'Don`t save',
        buttonType: 'primary',
        confirmButtonText: 'Save',
        heading: 'There are unsaved changes on the page. Want to save before leaving?',
        description: '',
        confirmType: 'UNSAVED',
      })
        .then(resolve)
        .catch(reject)

      next(false)
    }
  })
}
