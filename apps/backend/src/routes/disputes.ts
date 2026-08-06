import { Router } from 'express'
import {
  CreateDisputeRequestSchema,
  UpdateDisputeStatusSchema,
} from '@dispute-portal/shared-types'
import { disputeService } from '../services/dispute.service'

export const disputesRouter = Router()

disputesRouter.get('/', async (_req, res, next) => {
  try {
    const data = await disputeService.list()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

disputesRouter.get('/:ref', async (req, res, next) => {
  try {
    const data = await disputeService.getByRef(String(req.params.ref))
    res.json(data)
  } catch (err) {
    next(err)
  }
})

disputesRouter.post('/', async (req, res, next) => {
  try {
    const body = CreateDisputeRequestSchema.parse(req.body)
    const data = await disputeService.create(body)
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
})

disputesRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const body = UpdateDisputeStatusSchema.parse(req.body)
    const data = await disputeService.updateStatus(String(req.params.id), body)
    res.json(data)
  } catch (err) {
    next(err)
  }
})
