import type { CreateDisputeRequest, UpdateDisputeStatusRequest } from '@dispute-portal/shared-types'
import { disputeRepo } from '../repositories/dispute.repo.js'
import { transactionRepo } from '../repositories/transaction.repo.js'
import { toDispute } from '../lib/mappers.js'
import { AppError } from '../lib/errors.js'

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
    let available = false
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await disputeRepo.findByRef(ref)
      if (!existing) {
        available = true
        break
      }
      ref = nextRef()
    }
    if (!available) {
      throw new AppError(409, 'Could not allocate a unique dispute reference. Please try again.')
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
