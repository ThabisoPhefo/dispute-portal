import { http, HttpResponse } from 'msw'
import { CreateDisputeRequestSchema, UpdateDisputeStatusSchema } from '@dispute-portal/shared-types'
import type { Dispute } from '@dispute-portal/shared-types'
import { disputes, transactions, nextRef, nextId } from './db'

export const handlers = [
  http.get('/api/transactions', () => {
    return HttpResponse.json(transactions)
  }),

  http.get('/api/disputes', () => {
    return HttpResponse.json([...disputes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }),

  http.get('/api/disputes/:ref', ({ params }) => {
    const ref = String(params.ref)
    const d = disputes.find((x) => x.ref.toLowerCase() === ref.toLowerCase())
    if (!d) return HttpResponse.json({ error: 'Dispute not found' }, { status: 404 })
    return HttpResponse.json(d)
  }),

  http.post('/api/disputes', async ({ request }) => {
    const body = await request.json()
    const parsed = CreateDisputeRequestSchema.safeParse(body)
    if (!parsed.success) {
      return HttpResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }

    const txn = transactions.find((t) => t.id === parsed.data.transactionId)
    if (!txn) {
      return HttpResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const dispute: Dispute = {
      id: nextId(),
      ref: nextRef(),
      transactionId: parsed.data.transactionId,
      reason: parsed.data.reason,
      description: parsed.data.description,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    }
    disputes.push(dispute)
    return HttpResponse.json(dispute, { status: 201 })
  }),

  http.patch('/api/disputes/:id/status', async ({ params, request }) => {
    const id = String(params.id)
    const idx = disputes.findIndex((d) => d.id === id)
    if (idx === -1) return HttpResponse.json({ error: 'Dispute not found' }, { status: 404 })

    const body = await request.json()
    const parsed = UpdateDisputeStatusSchema.safeParse(body)
    if (!parsed.success) {
      return HttpResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid status' }, { status: 400 })
    }

    const updated: Dispute = {
      ...disputes[idx],
      status: parsed.data.status,
      updatedAt: new Date().toISOString(),
    }
    disputes[idx] = updated
    return HttpResponse.json(updated)
  }),
]
