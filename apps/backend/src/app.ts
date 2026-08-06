import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes'
import { errorHandler } from './middleware/error-handler'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? true,
    }),
  )
  app.use(express.json())
  app.use('/api', apiRouter)
  app.use(errorHandler)

  return app
}
