import { create } from 'zustand'
import type { DisputeReason, DisputeStatus } from '@dispute-portal/shared-types'
import { getTransaction } from './mock-data'

export type { DisputeStatus }

export function getStatusLabel(status: DisputeStatus): string {
  switch (status) {
    case 'CANCELLED': return 'Cancelled'
    case 'UNDER_REVIEW': return 'Under review'
    case 'APPROVED': return 'Approved'
    case 'REJECTED': return 'Rejected'
    default: return 'Open'
  }
}

export type Dispute = {
  ref: string
  transactionId: string
  reason: DisputeReason
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
      reason: 'DUPLICATE_CHARGE',
      description: 'I was charged twice for the same Takealot order.',
      status: 'UNDER_REVIEW',
      createdAt: daysAgo(2),
    },
    {
      ref: 'DP-2026-0400',
      transactionId: 'txn-uber',
      reason: 'INCORRECT_AMOUNT',
      description: 'The trip fare shown in the app was lower than what was deducted.',
      status: 'OPEN',
      createdAt: daysAgo(5),
    },
    {
      ref: 'DP-2026-0388',
      transactionId: 'txn-netflix',
      reason: 'UNAUTHORIZED_TRANSACTION',
      description: 'I did not recognise this Netflix charge on my account.',
      status: 'CANCELLED',
      createdAt: daysAgo(12),
    },
    {
      ref: 'DP-2026-0350',
      transactionId: 'txn-shell',
      reason: 'GOODS_NOT_RECEIVED',
      description: 'Fuel payment went through but the pump did not dispense.',
      status: 'UNDER_REVIEW',
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
    if (!target || target.status === 'CANCELLED') return target

    const updated: Dispute = { ...target, status: 'CANCELLED' }
    set((state) => ({
      disputes: state.disputes.map((d) => (d.ref === target.ref ? updated : d)),
    }))
    return updated
  },

  findDispute: (ref) =>
    get().disputes.find((d) => d.ref.toLowerCase() === ref.trim().toLowerCase()),
}))
