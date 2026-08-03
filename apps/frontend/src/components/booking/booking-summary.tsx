import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { formatTxnDate } from '../../lib/mock-data'

function ClaimRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-3.5 flex items-baseline gap-2.5 last:mb-0">
      <div className="w-15.5 shrink-0 font-mono text-[10px] tracking-wider text-claim-muted">
        {label}
      </div>
      <div
        className={cn(
          'text-sm font-medium',
          value ? 'text-claim-value' : 'font-normal text-claim-pending',
        )}
      >
        {value ?? 'Not selected'}
      </div>
    </div>
  )
}

function TimelineItem({ done, children }: { done?: boolean; children: ReactNode }) {
  return (
    <div className="mb-2.5 flex gap-2.5 last:mb-0">
      <div
        className={cn(
          'mt-1.5 size-1.5 shrink-0 rounded-full',
          done ? 'bg-confirmed' : 'bg-claim-pending',
        )}
      />
      <div className="text-xs leading-snug text-claim-timeline">{children}</div>
    </div>
  )
}

export function BookingSummary({
  merchant,
  amount,
  reasonName,
  txnDate,
  step,
}: {
  merchant?: string
  amount?: string
  reasonName?: string
  txnDate?: string
  step: number
}) {
  const stamp = step >= 2 ? 'READY' : step >= 1 ? 'IN PROGRESS' : 'DRAFT'

  return (
    <aside className="relative overflow-hidden rounded-lg bg-ink text-white shadow-lg lg:sticky lg:top-20">
      <div className="relative px-5.5 pb-4.5 pt-5">
        <p className="mb-3.5 font-mono text-[10px] tracking-widest text-claim-muted">
          CLAIM DETAIL
        </p>

        <div className="absolute top-2 right-5 -rotate-6 rounded border-2 border-review bg-review/10 px-2.5 py-1 font-display text-xs font-bold tracking-wider text-review">
          {stamp}
        </div>

        <ClaimRow label="MERCHANT" value={merchant} />
        <ClaimRow label="AMOUNT" value={amount} />
        <ClaimRow label="REASON" value={reasonName} />
        <ClaimRow label="DATE" value={txnDate ? formatTxnDate(txnDate) : undefined} />
      </div>

      <div className="relative h-0 border-t border-dashed border-claim-divider">
        <span className="absolute -top-2 -left-2 size-4 rounded-full bg-background" />
        <span className="absolute -top-2 -right-2 size-4 rounded-full bg-background" />
      </div>

      <div className="relative px-5.5 pt-4.5 pb-5.5">
        <p className="mb-1.5 font-mono text-[10px] tracking-widest text-claim-muted">
          CLAIM REFERENCE
        </p>
        <p className="mb-4 font-mono text-lg font-medium tracking-wide text-white">
          {step >= 2 ? 'Pending submit' : '—'}
        </p>

        <div>
          <TimelineItem done={step >= 1}>
            {step >= 1 ? (
              <b className="font-medium text-white">Transaction selected</b>
            ) : (
              'Select a transaction'
            )}
          </TimelineItem>
          <TimelineItem done={step >= 2}>
            {step >= 2 ? (
              <b className="font-medium text-white">Reason chosen</b>
            ) : (
              'Choose a reason'
            )}
          </TimelineItem>
          <TimelineItem done={step >= 2}>
            {step >= 2 ? (
              <b className="font-medium text-white">Describe the issue</b>
            ) : (
              'Add claim details'
            )}
          </TimelineItem>
          <TimelineItem done={false}>Resolution pending</TimelineItem>
        </div>
      </div>
    </aside>
  )
}
