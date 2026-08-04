import {
  addDispute,
  cancelDispute,
  findDispute,
  newRef,
  type Dispute,
} from './store'
import { getReason, getTransaction } from './mock-data'

export type DisputeInput = {
  transactionId: string
  reasonId: string
  description: string
}

export async function createDispute(
  input: DisputeInput,
): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  if (!getTransaction(input.transactionId) || !getReason(input.reasonId)) {
    return { ok: false, error: 'Please choose a valid transaction and reason.' }
  }
  if (input.description.trim().length < 10) {
    return { ok: false, error: 'Please describe the issue in at least 10 characters.' }
  }

  const dispute: Dispute = {
    ...input,
    ref: newRef(),
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  addDispute(dispute)
  console.log('[demo] Simulated dispute confirmation for', dispute.ref)
  return { ok: true, ref: dispute.ref }
}

export async function lookupDispute(ref: string) {
  const d = findDispute(ref)
  if (!d) return { ok: false as const, error: 'No dispute found for that reference.' }
  return { ok: true as const, dispute: d }
}

export async function cancelDisputeAction(ref: string) {
  const d = cancelDispute(ref)
  if (!d) return { ok: false as const, error: 'No dispute found for that reference.' }
  console.log('[demo] Simulated dispute cancellation for', d.ref)
  return { ok: true as const, dispute: d }
}
