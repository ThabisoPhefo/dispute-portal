import { transactionRepo } from '../repositories/transaction.repo.js'
import { toTransaction } from '../lib/mappers.js'

export const transactionService = {
  async list() {
    const rows = await transactionRepo.findAll()
    return rows.map(toTransaction)
  },
}
