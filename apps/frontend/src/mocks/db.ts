import type { Dispute, Transaction } from '@dispute-portal/shared-types'

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400_000).toISOString()
}

export const transactions: Transaction[] = [
  { id: '11111111-0000-0000-0000-000000000001', merchant: 'Woolworths',   amount: 452.5,  currency: 'ZAR', date: '2026-07-02', category: 'Groceries' },
  { id: '11111111-0000-0000-0000-000000000002', merchant: 'Takealot',     amount: 1299,   currency: 'ZAR', date: '2026-07-10', category: 'Online shopping' },
  { id: '11111111-0000-0000-0000-000000000003', merchant: 'Uber',         amount: 87.3,   currency: 'ZAR', date: '2026-07-18', category: 'Transport' },
  { id: '11111111-0000-0000-0000-000000000004', merchant: 'Checkers',     amount: 312.8,  currency: 'ZAR', date: '2026-07-21', category: 'Groceries' },
  { id: '11111111-0000-0000-0000-000000000005', merchant: 'Netflix',      amount: 199,    currency: 'ZAR', date: '2026-07-25', category: 'Subscriptions' },
  { id: '11111111-0000-0000-0000-000000000006', merchant: 'Shell',        amount: 650,    currency: 'ZAR', date: '2026-07-28', category: 'Fuel' },
  { id: '11111111-0000-0000-0000-000000000007', merchant: 'Dis-Chem',     amount: 278.4,  currency: 'ZAR', date: '2026-07-29', category: 'Health' },
  { id: '11111111-0000-0000-0000-000000000008', merchant: 'Pick n Pay',   amount: 534.9,  currency: 'ZAR', date: '2026-07-30', category: 'Groceries' },
  { id: '11111111-0000-0000-0000-000000000009', merchant: 'Spotify',      amount: 79.99,  currency: 'ZAR', date: '2026-07-31', category: 'Subscriptions' },
  { id: '11111111-0000-0000-0000-000000000010', merchant: 'Mr Price',     amount: 449,    currency: 'ZAR', date: '2026-08-01', category: 'Retail' },
  { id: '11111111-0000-0000-0000-000000000011', merchant: 'Engen',        amount: 720,    currency: 'ZAR', date: '2026-08-01', category: 'Fuel' },
  { id: '11111111-0000-0000-0000-000000000012', merchant: 'Makro',        amount: 1899.5, currency: 'ZAR', date: '2026-08-02', category: 'Wholesale' },
  { id: '11111111-0000-0000-0000-000000000013', merchant: 'Bolt',         amount: 65.2,   currency: 'ZAR', date: '2026-08-02', category: 'Transport' },
  { id: '11111111-0000-0000-0000-000000000014', merchant: 'Clicks',       amount: 156.75, currency: 'ZAR', date: '2026-08-03', category: 'Health' },
  { id: '11111111-0000-0000-0000-000000000015', merchant: 'Steers',       amount: 98.5,   currency: 'ZAR', date: '2026-08-03', category: 'Dining' },
].sort((a, b) => b.date.localeCompare(a.date))

export const disputes: Dispute[] = [
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    ref: 'DP-2026-0417',
    transactionId: '11111111-0000-0000-0000-000000000002',
    reason: 'DUPLICATE_CHARGE',
    description: 'I was charged twice for the same Takealot order.',
    status: 'UNDER_REVIEW',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000002',
    ref: 'DP-2026-0400',
    transactionId: '11111111-0000-0000-0000-000000000003',
    reason: 'INCORRECT_AMOUNT',
    description: 'The trip fare shown in the app was lower than what was deducted.',
    status: 'OPEN',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000003',
    ref: 'DP-2026-0388',
    transactionId: '11111111-0000-0000-0000-000000000005',
    reason: 'UNAUTHORIZED_TRANSACTION',
    description: 'I did not recognise this Netflix charge on my account.',
    status: 'CANCELLED',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(10),
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000004',
    ref: 'DP-2026-0350',
    transactionId: '11111111-0000-0000-0000-000000000006',
    reason: 'GOODS_NOT_RECEIVED',
    description: 'Fuel payment went through but the pump did not dispense.',
    status: 'UNDER_REVIEW',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(18),
  },
]

let refCounter = 5000

export function nextRef(): string {
  return `DP-2026-${refCounter++}`
}

export function nextId(): string {
  return crypto.randomUUID()
}
