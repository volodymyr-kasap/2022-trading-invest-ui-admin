import { statusesPayment } from '@/enums/statusesPayment'

export const statusesPaymentLabels = {
  [statusesPayment.PENDING]: 'В обработке',
  [statusesPayment.SUCCESS]: 'Проведено',
  [statusesPayment.FAILED]: 'Отклонено',
}

