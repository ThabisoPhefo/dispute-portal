import { useDisputeStore, newRef, type Dispute, type DisputeStatus } from './dispute-store'
import { getReason, getTransaction } from './mock-data'

export type DisputeInput = {
  transactionId: string
  reasonId: string
  description: string
}

/**
 * Thin service layer around the Zustand store. Kept async so components can
 * keep using startTransition/pending UX unchanged, and so this is a drop-in
 * swap point once a real API exists.
 */
export async function createDispute(
  input: DisputeInput,
): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  const reason = getReason(input.reasonId)
  if (!getTransaction(input.transactionId) || !reason) {
    return { ok: false, error: 'Please choose a valid transaction and reason.' }
  }
  if (input.description.trim().length < 10) {
    return { ok: false, error: 'Please describe the issue in at least 10 characters.' }
  }

  const dispute: Dispute = {
    transactionId: input.transactionId,
    reasonId: reason.id,
    description: input.description,
    ref: newRef(),
    status: 'open' satisfies DisputeStatus,
    createdAt: new Date().toISOString(),
  }
  useDisputeStore.getState().addDispute(dispute)
  return { ok: true, ref: dispute.ref }
}

export async function lookupDispute(ref: string) {
  const d = useDisputeStore.getState().findDispute(ref)
  if (!d) return { ok: false as const, error: 'No dispute found for that reference.' }
  return { ok: true as const, dispute: d }
}

export async function cancelDisputeAction(ref: string) {
  const d = useDisputeStore.getState().cancelDispute(ref)
  if (!d) return { ok: false as const, error: 'No dispute found for that reference.' }
  return { ok: true as const, dispute: d }
}
