import type { ReactNode } from 'react'
import { CalendarDays, CircleSlash, Loader2, Users } from 'lucide-react'
import type { DisputeStatus } from '@dispute-portal/shared-types'
import { useDisputes, useTransactions, useUpdateDisputeStatus } from '../lib/queries'
import { getDisputeDisplay } from '../lib/dispute-display'
import { getErrorMessage } from '../lib/error-message'
import { getStatusLabel } from '../lib/dispute-utils'
import { card, eyebrowPill, formControl, loadingState, microLabel } from '../lib/ui'
import { cn } from '../lib/utils'
import { InlineError } from '../components/ui/inline-error'
import { QueryErrorState } from '../components/ui/query-error-state'
import { StatusBadge } from '../components/ui/status-badge'

const STAFF_STATUSES: DisputeStatus[] = [
  'OPEN',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
]

export function AdminPage() {
  const {
    data: disputes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDisputes()
  const { data: transactions = [] } = useTransactions()
  const updateStatus = useUpdateDisputeStatus()

  const open = disputes.filter(
    (dispute) => dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW',
  )
  const underReview = disputes.filter((dispute) => dispute.status === 'UNDER_REVIEW')
  const cancelled = disputes.filter((dispute) => dispute.status === 'CANCELLED')

  if (isLoading) {
    return (
      <div className={cn(loadingState, 'py-24')}>
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-12">
        <QueryErrorState
          title="We couldn't load disputes"
          message={getErrorMessage(error, 'Please try again in a moment.')}
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Dispute operations</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Review claims and update their status.
          </p>
        </div>
        <span className={cn(eyebrowPill, 'max-w-full truncate')}>
          Demo data · refreshes on each claim
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Open claims" value={open.length} />
        <Stat
          icon={<CalendarDays className="h-4 w-4" />}
          label="Under review"
          value={underReview.length}
        />
        <Stat
          icon={<CircleSlash className="h-4 w-4" />}
          label="Cancelled"
          value={cancelled.length}
        />
      </div>

      <InlineError
        message={getErrorMessage(updateStatus.error, '')}
        className="mt-4"
      />

      <div className={cn(card, 'mt-6 overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={cn('border-b border-border/60 bg-secondary/60 text-left', microLabel)}>
              <tr>
                <th className="px-4 py-2.5 font-medium">Ref</th>
                <th className="px-4 py-2.5 font-medium">Merchant</th>
                <th className="px-4 py-2.5 font-medium">Reason</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">When</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {disputes.map((dispute) => {
                const display = getDisputeDisplay(dispute, transactions)
                const isUpdating =
                  updateStatus.isPending && updateStatus.variables?.id === dispute.id

                return (
                  <tr
                    key={dispute.ref}
                    className="border-t border-border/40 transition-colors duration-200 hover:bg-secondary/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">
                      {dispute.ref}
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-semibold tracking-tight text-card-foreground">
                        {display.merchantLabel}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {display.transaction?.category ?? ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{display.reasonLabel}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {display.amountLabel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      {display.transactionDateLabel}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={dispute.status} className="whitespace-nowrap" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-40 items-center gap-2">
                        <select
                          aria-label={`Update status for ${dispute.ref}`}
                          value={dispute.status}
                          disabled={isUpdating}
                          onChange={(event) => {
                            const status = event.target.value as DisputeStatus
                            if (status === dispute.status) return
                            updateStatus.mutate({ id: dispute.id, status })
                          }}
                          className={cn(formControl, 'cursor-pointer py-1.5 disabled:opacity-50')}
                        >
                          {STAFF_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                        {isUpdating && (
                          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className={cn(card, 'p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg')}>
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className={microLabel}>{label}</p>
    </div>
  )
}
