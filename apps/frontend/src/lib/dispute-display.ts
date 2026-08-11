import type { Dispute, Transaction } from '@dispute-portal/shared-types'
import { getReason, type DisputeReasonOption } from './dispute-reasons'
import { formatAmount, formatTxnDate } from './format'

export type DisputeDisplay = {
  transaction: Transaction | undefined
  reason: DisputeReasonOption | undefined
  merchantLabel: string
  amountLabel: string
  transactionDateLabel: string
  reasonLabel: string
}

export function getDisputeDisplay(
  dispute: Dispute,
  transactions: Transaction[],
): DisputeDisplay {
  const transaction = transactions.find((item) => item.id === dispute.transactionId)
  const reason = getReason(dispute.reason)

  return {
    transaction,
    reason,
    merchantLabel: transaction?.merchant ?? '—',
    amountLabel: transaction
      ? formatAmount(transaction.amount, transaction.currency)
      : '—',
    transactionDateLabel: transaction ? formatTxnDate(transaction.date) : '—',
    reasonLabel: reason?.name ?? '—',
  }
}
