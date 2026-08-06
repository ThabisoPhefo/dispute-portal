import type { CreateDisputeRequest, UpdateDisputeStatusRequest } from '@dispute-portal/shared-types'
import { disputeRepo } from '../repositories/dispute.repo'
import { transactionRepo } from '../repositories/transaction.repo'
import { toDispute } from '../lib/mappers'
import { AppError } from '../lib/errors'

function nextRef() {
  const n = Math.floor(1000 + Math.random() * 8999)
  return `DP-2026-${n}`
}

export const disputeService = {
  async list() {
    const rows = await disputeRepo.findAll()
    return rows.map(toDispute)
  },

  async getByRef(ref: string) {
    const row = await disputeRepo.findByRef(ref)
    if (!row) throw new AppError(404, 'Dispute not found')
    return toDispute(row)
  },

  async create(input: CreateDisputeRequest) {
    const txn = await transactionRepo.findById(input.transactionId)
    if (!txn) throw new AppError(404, 'Transaction not found')

    let ref = nextRef()
    for (let i = 0; i < 5; i++) {
      const existing = await disputeRepo.findByRef(ref)
      if (!existing) break
      ref = nextRef()
    }

    const row = await disputeRepo.create({
      ref,
      reason: input.reason,
      description: input.description,
      status: 'OPEN',
      transaction: { connect: { id: input.transactionId } },
    })
    return toDispute(row)
  },

  async updateStatus(id: string, input: UpdateDisputeStatusRequest) {
    const existing = await disputeRepo.findById(id)
    if (!existing) throw new AppError(404, 'Dispute not found')

    const row = await disputeRepo.updateStatus(id, input.status)
    return toDispute(row)
  },
}
