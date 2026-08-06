import { Router } from 'express'
import { transactionsRouter } from './transactions'
import { disputesRouter } from './disputes'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true })
})

apiRouter.use('/transactions', transactionsRouter)
apiRouter.use('/disputes', disputesRouter)
