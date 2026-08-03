import { getTransaction } from './mock-data'

export type DisputeStatus = 'open' | 'under_review' | 'cancelled'

export type Dispute = {
  ref: string
  transactionId: string
  reasonId: string
  description: string
  status: DisputeStatus
  createdAt: string
}

type Store = { disputes: Dispute[] }

const g = globalThis as unknown as { __disputeStore?: Store }

function seed(): Dispute[] {
  return [
    {
      ref: 'DP-2026-0417',
      transactionId: 'txn-takealot',
      reasonId: 'DUPLICATE_CHARGE',
      description: 'I was charged twice for the same Takealot order.',
      status: 'under_review',
      createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
    },
    {
      ref: 'DP-2026-0400',
      transactionId: 'txn-uber',
      reasonId: 'INCORRECT_AMOUNT',
      description: 'The trip fare shown in the app was lower than what was deducted.',
      status: 'open',
      createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
    },
  ]
}

function store(): Store {
  if (!g.__disputeStore) g.__disputeStore = { disputes: seed() }
  return g.__disputeStore
}

export function allDisputes(): Dispute[] {
  return [...store().disputes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function findDispute(ref: string): Dispute | undefined {
  return store().disputes.find((d) => d.ref.toLowerCase() === ref.trim().toLowerCase())
}

export function addDispute(d: Dispute) {
  store().disputes.push(d)
}

export function cancelDispute(ref: string): Dispute | undefined {
  const d = findDispute(ref)
  if (d && d.status !== 'cancelled') d.status = 'cancelled'
  return d
}

export function newRef(): string {
  const n = Math.floor(1000 + Math.random() * 8999)
  return `DP-2026-${n}`
}

export function disputeHasTransaction(d: Dispute) {
  return Boolean(getTransaction(d.transactionId))
}
