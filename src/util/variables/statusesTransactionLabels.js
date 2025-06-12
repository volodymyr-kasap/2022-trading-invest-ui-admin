import { statusesTransaction } from '@/enums/statusesTransaction'

export const statusesTransactionLabels = {
  [statusesTransaction.PENDING]: 'В обработке',
  [statusesTransaction.SUCCESS]: 'Проведено',
  [statusesTransaction.FAILED]: 'Отклонено',
}

export const statusesTransactionLabelsArray = [
  { value: statusesTransaction.SUCCESS, label: 'Проведено' },
  { value: statusesTransaction.FAILED, label: 'Отклонено' },
]
