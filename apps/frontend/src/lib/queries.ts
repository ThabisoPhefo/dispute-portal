import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateDisputeRequest, DisputeStatus } from '@dispute-portal/shared-types'
import {
  fetchTransactions,
  fetchDisputes,
  fetchDispute,
  createDispute,
  updateDisputeStatus,
} from './api-client'

const queryKeys = {
  transactions: ['transactions'] as const,
  disputes: ['disputes'] as const,
  dispute: (ref: string) => ['disputes', ref] as const,
}

export function useTransactions() {
  return useQuery({ queryKey: queryKeys.transactions, queryFn: fetchTransactions })
}

export function useDisputes() {
  return useQuery({ queryKey: queryKeys.disputes, queryFn: fetchDisputes })
}

export function useDispute(ref: string) {
  return useQuery({
    queryKey: queryKeys.dispute(ref),
    queryFn: () => fetchDispute(ref),
    enabled: !!ref,
  })
}

export function useCreateDispute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateDisputeRequest) => createDispute(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disputes })
    },
  })
}

export function useCancelDispute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => updateDisputeStatus(id, { status: 'CANCELLED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disputes })
    },
  })
}

export function useUpdateDisputeStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DisputeStatus }) =>
      updateDisputeStatus(id, { status }),
    onSuccess: (dispute) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disputes })
      queryClient.invalidateQueries({ queryKey: queryKeys.dispute(dispute.ref) })
    },
  })
}
