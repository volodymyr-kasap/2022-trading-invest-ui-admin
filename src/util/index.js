import { ElMessage } from 'element-plus'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { forIn } from 'lodash-es'
import { DateTime } from 'luxon'

export const errorHandler = (err, message) => {
  message = message || err?.response?.data?.message || err?.data?.message || err
  ElMessage.error(message)

  return err
}
export const successHandler = (message) => ElMessage.success(message)

export const getErrorHandler = (message) => (err) => errorHandler(err, message)
export const getSuccessHandler = (message) => () => successHandler(message)

export const formatDate = (
  date,
  format = 'MMM DD YYYY HH:mm',
  setZone = false,
) => DateTime.fromISO(date, { setZone }).setLocale('ru').toFormat(format)

export const formatTime = (time, format = 'HH:mm') => DateTime.fromISO(time).toFormat(format)

export const formCustomizer = (form) => {
  forIn(form, (ctx, key) => {
    if (form[key] === undefined || form[key] === null) {
      form[key] = ''
    }
  })

  return form
}

export const copy = (
  value,
  message = 'Ссылка скопирована и может быть использована (Ctrl + V)',
) => {
  toClipboard(value)
  successHandler(message)
}
