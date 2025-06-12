import { statusesDeposit } from '@/enums/statusesDeposit'

export const statusesDepositLabels = {
  [statusesDeposit.CREATED]: 'На подтверждении',
  [statusesDeposit.WORKING]: 'В работе',
  [statusesDeposit.COMPLETED]: 'Завершен',
  [statusesDeposit.CLOSED]: 'Закрыт',
}

export const statusesDepositLabelsArray = [
  { value: statusesDeposit.CREATED, label: 'На подтверждении' },
  { value: statusesDeposit.WORKING, label: 'В работе' },
  { value: statusesDeposit.COMPLETED, label: 'Завершен' },
  { value: statusesDeposit.CLOSED, label: 'Закрыт' },
]
