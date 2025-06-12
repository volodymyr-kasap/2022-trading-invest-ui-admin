import { statusesClient } from '@/enums/statusesClient'

export const statusesClientLabels = {
  [statusesClient.ACTIVE]: 'Активный',
  [statusesClient.BLOCKED]: 'Заблокированный',
}

export const statusesClientLabelsArray = [
  { value: statusesClient.ACTIVE, label: 'Активный' },
  { value: statusesClient.BLOCKED, label: 'Заблокированный' },
]
