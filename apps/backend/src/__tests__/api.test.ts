import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'
import { prisma } from '../lib/prisma.js'

const app = createApp()

const fixtureTransaction = {
  id: '99999999-9999-4999-8999-999999999901',
  merchant: 'Test Merchant',
  amount: 42.5,
  currency: 'USD',
  date: new Date('2026-01-15'),
  category: 'Groceries',
}

beforeAll(async () => {
  await prisma.dispute.deleteMany({ where: { transactionId: fixtureTransaction.id } })
  await prisma.transaction.deleteMany({ where: { id: fixtureTransaction.id } })
  await prisma.transaction.create({ data: fixtureTransaction })
})

afterAll(async () => {
  await prisma.dispute.deleteMany({ where: { transactionId: fixtureTransaction.id } })
  await prisma.transaction.deleteMany({ where: { id: fixtureTransaction.id } })
  await prisma.$disconnect()
})

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})

describe('GET /api/transactions', () => {
  it('lists transactions including the fixture', async () => {
    const res = await request(app).get('/api/transactions')
    expect(res.status).toBe(200)
    expect(res.body.some((t: { id: string }) => t.id === fixtureTransaction.id)).toBe(true)
  })
})

describe('disputes lifecycle', () => {
  let disputeId: string
  let disputeRef: string

  it('creates a dispute for a valid transaction', async () => {
    const res = await request(app)
      .post('/api/disputes')
      .send({
        transactionId: fixtureTransaction.id,
        reason: 'DUPLICATE_CHARGE',
        description: 'This charge appears twice on my statement.',
      })
    expect(res.status).toBe(201)
    expect(res.body.status).toBe('OPEN')
    expect(res.body.ref).toMatch(/^DP-\d{4}-\d{4}$/)
    disputeId = res.body.id
    disputeRef = res.body.ref
  })

  it('rejects a dispute for an unknown transaction', async () => {
    const res = await request(app)
      .post('/api/disputes')
      .send({
        transactionId: '00000000-0000-4000-8000-000000000000',
        reason: 'OTHER',
        description: 'Transaction does not exist.',
      })
    expect(res.status).toBe(404)
  })

  it('rejects an invalid request body', async () => {
    const res = await request(app).post('/api/disputes').send({ reason: 'OTHER' })
    expect(res.status).toBe(400)
  })

  it('lists disputes including the newly created one', async () => {
    const res = await request(app).get('/api/disputes')
    expect(res.status).toBe(200)
    expect(res.body.some((d: { id: string }) => d.id === disputeId)).toBe(true)
  })

  it('fetches the dispute by ref', async () => {
    const res = await request(app).get(`/api/disputes/${disputeRef}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(disputeId)
  })

  it('returns 404 for an unknown ref', async () => {
    const res = await request(app).get('/api/disputes/DP-0000-0000')
    expect(res.status).toBe(404)
  })

  it('updates the dispute status', async () => {
    const res = await request(app)
      .patch(`/api/disputes/${disputeId}/status`)
      .send({ status: 'APPROVED' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('APPROVED')
  })
})
