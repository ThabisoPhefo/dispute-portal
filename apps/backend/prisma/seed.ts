import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400_000)
}

const transactions = [
  { id: '11111111-1111-4111-8111-111111111001', merchant: 'Woolworths', amount: 452.5, currency: 'ZAR', date: new Date('2026-07-02'), category: 'Groceries' },
  { id: '11111111-1111-4111-8111-111111111002', merchant: 'Takealot', amount: 1299, currency: 'ZAR', date: new Date('2026-07-10'), category: 'Online shopping' },
  { id: '11111111-1111-4111-8111-111111111003', merchant: 'Uber', amount: 87.3, currency: 'ZAR', date: new Date('2026-07-18'), category: 'Transport' },
  { id: '11111111-1111-4111-8111-111111111004', merchant: 'Checkers', amount: 312.8, currency: 'ZAR', date: new Date('2026-07-21'), category: 'Groceries' },
  { id: '11111111-1111-4111-8111-111111111005', merchant: 'Netflix', amount: 199, currency: 'ZAR', date: new Date('2026-07-25'), category: 'Subscriptions' },
  { id: '11111111-1111-4111-8111-111111111006', merchant: 'Shell', amount: 650, currency: 'ZAR', date: new Date('2026-07-28'), category: 'Fuel' },
  { id: '11111111-1111-4111-8111-111111111007', merchant: 'Dis-Chem', amount: 278.4, currency: 'ZAR', date: new Date('2026-07-29'), category: 'Health' },
  { id: '11111111-1111-4111-8111-111111111008', merchant: 'Pick n Pay', amount: 534.9, currency: 'ZAR', date: new Date('2026-07-30'), category: 'Groceries' },
  { id: '11111111-1111-4111-8111-111111111009', merchant: 'Spotify', amount: 79.99, currency: 'ZAR', date: new Date('2026-07-31'), category: 'Subscriptions' },
  { id: '11111111-1111-4111-8111-111111111010', merchant: 'Mr Price', amount: 449, currency: 'ZAR', date: new Date('2026-08-01'), category: 'Retail' },
  { id: '11111111-1111-4111-8111-111111111011', merchant: 'Engen', amount: 720, currency: 'ZAR', date: new Date('2026-08-01'), category: 'Fuel' },
  { id: '11111111-1111-4111-8111-111111111012', merchant: 'Makro', amount: 1899.5, currency: 'ZAR', date: new Date('2026-08-02'), category: 'Wholesale' },
  { id: '11111111-1111-4111-8111-111111111013', merchant: 'Bolt', amount: 65.2, currency: 'ZAR', date: new Date('2026-08-02'), category: 'Transport' },
  { id: '11111111-1111-4111-8111-111111111014', merchant: 'Clicks', amount: 156.75, currency: 'ZAR', date: new Date('2026-08-03'), category: 'Health' },
  { id: '11111111-1111-4111-8111-111111111015', merchant: 'Steers', amount: 98.5, currency: 'ZAR', date: new Date('2026-08-03'), category: 'Dining' },
]

const disputes = [
  {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaa1',
    ref: 'DP-2026-0417',
    transactionId: '11111111-1111-4111-8111-111111111002',
    reason: 'DUPLICATE_CHARGE' as const,
    description: 'I was charged twice for the same Takealot order.',
    status: 'UNDER_REVIEW' as const,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaa2',
    ref: 'DP-2026-0400',
    transactionId: '11111111-1111-4111-8111-111111111003',
    reason: 'INCORRECT_AMOUNT' as const,
    description: 'The trip fare shown in the app was lower than what was deducted.',
    status: 'OPEN' as const,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaa3',
    ref: 'DP-2026-0388',
    transactionId: '11111111-1111-4111-8111-111111111005',
    reason: 'UNAUTHORIZED_TRANSACTION' as const,
    description: 'I did not recognise this Netflix charge on my account.',
    status: 'CANCELLED' as const,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(10),
  },
  {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaa4',
    ref: 'DP-2026-0350',
    transactionId: '11111111-1111-4111-8111-111111111006',
    reason: 'GOODS_NOT_RECEIVED' as const,
    description: 'Fuel payment went through but the pump did not dispense.',
    status: 'UNDER_REVIEW' as const,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(18),
  },
]

async function main() {
  await prisma.dispute.deleteMany()
  await prisma.transaction.deleteMany()

  for (const txn of transactions) {
    await prisma.transaction.create({ data: txn })
  }

  for (const dispute of disputes) {
    await prisma.dispute.create({ data: dispute })
  }

  console.log(`Seeded ${transactions.length} transactions and ${disputes.length} disputes`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
