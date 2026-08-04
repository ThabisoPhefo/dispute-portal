import { create } from 'zustand'
import type { DisputeReason } from '@dispute-portal/shared-types'
import { getTransaction } from './mock-data'

/**
 * Intentionally diverges from the Prisma/shared `DisputeStatus` enum
 * (`OPEN | UNDER_REVIEW | APPROVED | REJECTED`) — there is no backend yet,
 * and this mock model needs a customer-facing "cancelled" state that the
 * shared schema doesn't define. Reconcile once a real API contract exists.
 */
export type DisputeStatus = 'open' | 'under_review' | 'cancelled'

export function getStatusLabel(status: DisputeStatus): string {
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'under_review') return 'Under review'
  return 'Open'
}

export type Dispute = {
  ref: string
  transactionId: string
  reasonId: DisputeReason
  description: string
  status: DisputeStatus
  createdAt: string
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400_000).toISOString()
}

function seed(): Dispute[] {
  return [
    {
      ref: 'DP-2026-0417',
      transactionId: 'txn-takealot',
      reasonId: 'DUPLICATE_CHARGE',
      description: 'I was charged twice for the same Takealot order.',
      status: 'under_review',
      createdAt: daysAgo(2),
    },
    {
      ref: 'DP-2026-0400',
      transactionId: 'txn-uber',
      reasonId: 'INCORRECT_AMOUNT',
      description: 'The trip fare shown in the app was lower than what was deducted.',
      status: 'open',
      createdAt: daysAgo(5),
    },
    {
      ref: 'DP-2026-0388',
      transactionId: 'txn-netflix',
      reasonId: 'UNAUTHORIZED_TRANSACTION',
      description: 'I did not recognise this Netflix charge on my account.',
      status: 'cancelled',
      createdAt: daysAgo(12),
    },
    {
      ref: 'DP-2026-0350',
      transactionId: 'txn-shell',
      reasonId: 'GOODS_NOT_RECEIVED',
      description: 'Fuel payment went through but the pump did not dispense.',
      status: 'under_review',
      createdAt: daysAgo(20),
    },
  ]
}

export function newRef(): string {
  const n = Math.floor(1000 + Math.random() * 8999)
  return `DP-2026-${n}`
}

export function disputeHasTransaction(d: Dispute) {
  return Boolean(getTransaction(d.transactionId))
}

type DisputeStoreState = {
  disputes: Dispute[]
  addDispute: (d: Dispute) => void
  cancelDispute: (ref: string) => Dispute | undefined
  findDispute: (ref: string) => Dispute | undefined
}

export const useDisputeStore = create<DisputeStoreState>((set, get) => ({
  disputes: seed().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  addDispute: (d) =>
    set((state) => ({
      disputes: [...state.disputes, d].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    })),

  cancelDispute: (ref) => {
    const target = get().findDispute(ref)
    if (!target || target.status === 'cancelled') return target

    const updated: Dispute = { ...target, status: 'cancelled' }
    set((state) => ({
      disputes: state.disputes.map((d) => (d.ref === target.ref ? updated : d)),
    }))
    return updated
  },

  findDispute: (ref) =>
    get().disputes.find((d) => d.ref.toLowerCase() === ref.trim().toLowerCase()),
}))
