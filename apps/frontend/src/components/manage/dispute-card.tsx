import { CalendarDays, Clock, MapPin, Phone, XCircle } from 'lucide-react'
import type { Dispute, Transaction } from '@dispute-portal/shared-types'
import type { DisputeReasonOption } from '../../lib/dispute-reasons'
import { formatAmount, formatTxnDate } from '../../lib/format'
import { card } from '../../lib/ui'
import { cn } from '../../lib/utils'
import { StatusBadge } from '../ui/status-badge'
import { DetailItem } from '../ui/detail-item'

export function DisputeCard({
  dispute,
  transaction,
  reason,
  pending,
  onCancel,
}: {
  dispute: Dispute
  transaction: Transaction | undefined
  reason: DisputeReasonOption | undefined
  pending: boolean
  onCancel: () => void
}) {
  const active = dispute.status !== 'CANCELLED'

  return (
    <div className={cn(card, 'animate-in fade-in slide-in-from-bottom-1 p-5 duration-300 sm:p-6')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold tabular-nums tracking-tight">{dispute.ref}</p>
          <p className="text-xs text-muted-foreground">{transaction?.merchant ?? '—'}</p>
        </div>
        <StatusBadge status={dispute.status} />
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailItem
          label="Reason"
          value={reason?.name ?? '—'}
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <DetailItem
          label="Transaction date"
          value={transaction ? formatTxnDate(transaction.date) : '—'}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />
        <DetailItem
          label="Amount"
          value={
            transaction
              ? formatAmount(transaction.amount, transaction.currency)
              : '—'
          }
          icon={<MapPin className="h-3.5 w-3.5" />}
        />
        <DetailItem
          label="Description"
          value={dispute.description}
          icon={<Phone className="h-3.5 w-3.5" />}
        />
      </dl>

      {active ? (
        <div className="mt-5 border-t border-border/40 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-destructive/40 bg-card px-4 py-2 text-xs font-medium text-destructive shadow-sm transition-all duration-200 hover:bg-destructive/5 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
          >
            <XCircle className="h-3.5 w-3.5" /> Cancel dispute
          </button>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Cancelling closes this claim immediately.
          </p>
        </div>
      ) : (
        <p className="mt-5 border-t border-border/40 pt-4 text-[11px] leading-relaxed text-muted-foreground">
          This dispute has been cancelled.
        </p>
      )}
    </div>
  )
}
