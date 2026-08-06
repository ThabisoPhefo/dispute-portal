import type { Dispute as PrismaDispute, Transaction as PrismaTransaction } from '@prisma/client'
import type { Dispute, Transaction } from '@dispute-portal/shared-types'

export function toTransaction(row: PrismaTransaction): Transaction {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: Number(row.amount),
    currency: row.currency,
    date: row.date.toISOString().slice(0, 10),
    category: row.category,
  }
}

export function toDispute(row: PrismaDispute): Dispute {
  return {
    id: row.id,
    ref: row.ref,
    transactionId: row.transactionId,
    reason: row.reason,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
