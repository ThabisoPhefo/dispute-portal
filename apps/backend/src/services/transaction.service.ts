import { transactionRepo } from '../repositories/transaction.repo'
import { toTransaction } from '../lib/mappers'

export const transactionService = {
  async list() {
    const rows = await transactionRepo.findAll()
    return rows.map(toTransaction)
  },
}
