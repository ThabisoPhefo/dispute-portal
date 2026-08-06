import { Router } from 'express'
import { transactionService } from '../services/transaction.service'

export const transactionsRouter = Router()

transactionsRouter.get('/', async (_req, res, next) => {
  try {
    const data = await transactionService.list()
    res.json(data)
  } catch (err) {
    next(err)
  }
})
