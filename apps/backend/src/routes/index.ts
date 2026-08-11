import { Router } from 'express'
import { transactionsRouter } from './transactions.js'
import { disputesRouter } from './disputes.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true })
})

apiRouter.use('/transactions', transactionsRouter)
apiRouter.use('/disputes', disputesRouter)
