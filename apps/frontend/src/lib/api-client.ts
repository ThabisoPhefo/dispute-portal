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

function messageForStatus(status: number): string {
  if (status === 400) return 'Please check your details and try again.'
  if (status === 404) return "We couldn't find what you were looking for."
  if (status === 409) return 'This action conflicts with existing data. Please try again.'
  if (status >= 500) return 'Something went wrong on our side. Please try again in a moment.'
  return 'Something went wrong. Please try again.'
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch {
    throw new Error('Unable to connect right now. Please try again in a moment.')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const serverMessage = (body as { error?: string }).error?.trim()
    throw new Error(serverMessage || messageForStatus(res.status))
  }

  const json = await res.json().catch(() => {
    throw new Error('Something went wrong on our side. Please try again in a moment.')
  })

  try {
    return schema.parse(json)
  } catch {
    throw new Error('We received an unexpected response. Please try again.')
  }
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
