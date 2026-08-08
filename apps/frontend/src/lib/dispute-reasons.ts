import type { DisputeReason } from '@dispute-portal/shared-types'

export type DisputeReasonOption = {
  id: DisputeReason
  name: string
  description: string
}

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

export const getReason = (id: string) => REASONS.find((r) => r.id === id)
