import { reasonTypes } from '@/enums/reasonTypes'

export const reasonTypesLabelsArray = [
  { value: reasonTypes.PAYMENT, label: 'Зачисление средств' },
  { value: reasonTypes.PAYOUT, label: 'Выплата' },
  { value: reasonTypes.PAYOUT_ROLLBACK, label: 'Возврат средств по выплате' },
  { value: reasonTypes.DEPOSIT_PROFIT, label: 'Процент за депозит' },
  { value: reasonTypes.REFERRAL_PROFIT, label: 'Процент за рефпрограмму' },
  { value: reasonTypes.DEPOSIT_PAYOUT, label: 'Возврат средств за депозит' },
  { value: reasonTypes.DEPOSIT_PAYMENT, label: 'Снятие средств за депозит' },
]

export const reasonTypesLabels = {
  [reasonTypes.PAYMENT]: 'Зачисление средств',
  [reasonTypes.PAYOUT]: 'Выплата',
  [reasonTypes.PAYOUT_ROLLBACK]: 'Возврат средств по выплате',
  [reasonTypes.DEPOSIT_PROFIT]: 'Процент за депозит',
  [reasonTypes.REFERRAL_PROFIT]: 'Процент за рефпрограмму',
  [reasonTypes.DEPOSIT_PAYOUT]: 'Возврат средств за депозит',
  [reasonTypes.DEPOSIT_PAYMENT]: 'Снятие средств за депозит',
}
