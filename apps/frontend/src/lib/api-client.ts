import {
  TransactionSchema,
  DisputeSchema,
  CreateDisputeRequestSchema,
  UpdateDisputeStatusSchema,
  type CreateDisputeRequest,
  type UpdateDisputeStatusRequest,
} from '@dispute-portal/shared-types'
import { z } from 'zod'

const BASE = '/api'

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  const json = await res.json()
  return schema.parse(json)
}

export function fetchTransactions() {
  return request('/transactions', z.array(TransactionSchema))
}

export function fetchDisputes() {
  return request('/disputes', z.array(DisputeSchema))
}

export function fetchDispute(ref: string) {
  return request(`/disputes/${ref}`, DisputeSchema)
}

export function createDispute(body: CreateDisputeRequest) {
  CreateDisputeRequestSchema.parse(body)
  return request('/disputes', DisputeSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateDisputeStatus(id: string, body: UpdateDisputeStatusRequest) {
  UpdateDisputeStatusSchema.parse(body)
  return request(`/disputes/${id}/status`, DisputeSchema, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
