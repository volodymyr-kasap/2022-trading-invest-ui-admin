import { statusesPayout } from '@/enums/statusesPayout'

export const statusesPayoutLabels = {
  [statusesPayout.PENDING]: 'В обработке',
  [statusesPayout.SUCCESS]: 'Проведено',
  [statusesPayout.REJECTED]: 'Отклонено',
}

export const statusesPayoutLabelsArray = [
  { value: statusesPayout.PENDING, label: 'В обработке' },
  { value: statusesPayout.SUCCESS, label: 'Проведено' },
  { value: statusesPayout.REJECTED, label: 'Отклонено' },
]
