import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateDisputeRequest } from '@dispute-portal/shared-types'
import {
  fetchTransactions,
  fetchDisputes,
  fetchDispute,
  createDispute,
  updateDisputeStatus,
} from './api-client'

export const qk = {
  transactions: ['transactions'] as const,
  disputes: ['disputes'] as const,
  dispute: (ref: string) => ['disputes', ref] as const,
}

export function useTransactions() {
  return useQuery({ queryKey: qk.transactions, queryFn: fetchTransactions })
}

export function useDisputes() {
  return useQuery({ queryKey: qk.disputes, queryFn: fetchDisputes })
}

export function useDispute(ref: string) {
  return useQuery({
    queryKey: qk.dispute(ref),
    queryFn: () => fetchDispute(ref),
    enabled: !!ref,
  })
}

export function useCreateDispute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateDisputeRequest) => createDispute(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.disputes })
    },
  })
}

export function useCancelDispute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => updateDisputeStatus(id, { status: 'CANCELLED' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.disputes })
    },
  })
}

export function useUpdateDisputeStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateDisputeStatus(id, { status: status as never }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.disputes })
    },
  })
}
