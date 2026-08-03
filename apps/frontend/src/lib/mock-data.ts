export type Transaction = {
  id: string
  merchant: string
  amount: number
  currency: string
  date: string // ISO date YYYY-MM-DD
  category: string
}

export type DisputeReasonOption = {
  id: string
  name: string
  description: string
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-woolworths',
    merchant: 'Woolworths',
    amount: 452.5,
    currency: 'ZAR',
    date: '2026-07-02',
    category: 'Groceries',
  },
  {
    id: 'txn-takealot',
    merchant: 'Takealot',
    amount: 1299,
    currency: 'ZAR',
    date: '2026-07-10',
    category: 'Online shopping',
  },
  {
    id: 'txn-uber',
    merchant: 'Uber',
    amount: 87.3,
    currency: 'ZAR',
    date: '2026-07-18',
    category: 'Transport',
  },
  {
    id: 'txn-checkers',
    merchant: 'Checkers',
    amount: 312.8,
    currency: 'ZAR',
    date: '2026-07-21',
    category: 'Groceries',
  },
  {
    id: 'txn-netflix',
    merchant: 'Netflix',
    amount: 199,
    currency: 'ZAR',
    date: '2026-07-25',
    category: 'Subscriptions',
  },
  {
    id: 'txn-shell',
    merchant: 'Shell',
    amount: 650,
    currency: 'ZAR',
    date: '2026-07-28',
    category: 'Fuel',
  },
  {
    id: 'txn-dischem',
    merchant: 'Dis-Chem',
    amount: 278.4,
    currency: 'ZAR',
    date: '2026-07-29',
    category: 'Health',
  },
  {
    id: 'txn-picknpay',
    merchant: "Pick n Pay",
    amount: 534.9,
    currency: 'ZAR',
    date: '2026-07-30',
    category: 'Groceries',
  },
  {
    id: 'txn-spotify',
    merchant: 'Spotify',
    amount: 79.99,
    currency: 'ZAR',
    date: '2026-07-31',
    category: 'Subscriptions',
  },
  {
    id: 'txn-mrprice',
    merchant: 'Mr Price',
    amount: 449,
    currency: 'ZAR',
    date: '2026-08-01',
    category: 'Retail',
  },
  {
    id: 'txn-engen',
    merchant: 'Engen',
    amount: 720,
    currency: 'ZAR',
    date: '2026-08-01',
    category: 'Fuel',
  },
  {
    id: 'txn-makro',
    merchant: 'Makro',
    amount: 1899.5,
    currency: 'ZAR',
    date: '2026-08-02',
    category: 'Wholesale',
  },
  {
    id: 'txn-bolt',
    merchant: 'Bolt',
    amount: 65.2,
    currency: 'ZAR',
    date: '2026-08-02',
    category: 'Transport',
  },
  {
    id: 'txn-clicks',
    merchant: 'Clicks',
    amount: 156.75,
    currency: 'ZAR',
    date: '2026-08-03',
    category: 'Health',
  },
  {
    id: 'txn-steers',
    merchant: 'Steers',
    amount: 98.5,
    currency: 'ZAR',
    date: '2026-08-03',
    category: 'Dining',
  },
].sort((a, b) => b.date.localeCompare(a.date))

export const REASONS: DisputeReasonOption[] = [
  {
    id: 'UNAUTHORIZED_TRANSACTION',
    name: 'Unauthorised transaction',
    description: 'I did not make or approve this payment.',
  },
  {
    id: 'DUPLICATE_CHARGE',
    name: 'Duplicate charge',
    description: 'I was charged more than once for the same purchase.',
  },
  {
    id: 'INCORRECT_AMOUNT',
    name: 'Incorrect amount',
    description: 'The amount charged is different from what I expected.',
  },
  {
    id: 'GOODS_NOT_RECEIVED',
    name: 'Goods not received',
    description: 'I paid but never received the goods or service.',
  },
  {
    id: 'OTHER',
    name: 'Other',
    description: 'Something else is wrong with this transaction.',
  },
]

export const getTransaction = (id: string) => TRANSACTIONS.find((t) => t.id === id)
export const getReason = (id: string) => REASONS.find((r) => r.id === id)

export function formatAmount(amount: number, currency = 'ZAR') {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatTxnDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
  })
}
