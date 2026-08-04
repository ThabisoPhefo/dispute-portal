import { useState, useTransition } from 'react'
import { Loader2, Search } from 'lucide-react'
import { cancelDisputeAction, lookupDispute } from '../../lib/actions'
import { formatAmount, formatTxnDate, getReason, getTransaction } from '../../lib/mock-data'
import { allDisputes, type Dispute } from '../../lib/store'
import { cn } from '../../lib/utils'
import { microLabel } from '../../lib/ui'
import { BookingCard } from './booking-card'

function statusLabel(status: Dispute['status']) {
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'under_review') return 'Under review'
  return 'Open'
}

function formatFiledDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ManagePanel() {
  const [refInput, setRefInput] = useState('')
  const [disputes, setDisputes] = useState(() => allDisputes())
  const [selectedRef, setSelectedRef] = useState<string | null>(disputes[0]?.ref ?? null)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const dispute = disputes.find((d) => d.ref === selectedRef) ?? null
  const transaction = dispute ? getTransaction(dispute.transactionId) : undefined
  const reason = dispute ? getReason(dispute.reasonId) : undefined

  function refresh(nextSelected?: string | null) {
    const next = allDisputes()
    setDisputes(next)
    if (nextSelected !== undefined) setSelectedRef(nextSelected)
    else if (selectedRef && !next.some((d) => d.ref === selectedRef)) {
      setSelectedRef(next[0]?.ref ?? null)
    }
  }

  function search() {
    setError('')
    startTransition(async () => {
      const res = await lookupDispute(refInput)
      if (res.ok) {
        refresh(res.dispute.ref)
      } else {
        setError(res.error)
      }
    })
  }

  function cancel() {
    if (!dispute) return
    startTransition(async () => {
      const res = await cancelDisputeAction(dispute.ref)
      if (res.ok) refresh(res.dispute.ref)
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card p-5 shadow-md">
        <label className="block">
          <span className={cn(microLabel, 'mb-1.5 block')}>Claim reference</span>
          <div className="flex gap-2">
            <input
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) search()
              }}
              placeholder="DP-2026-0417"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold uppercase tabular-nums tracking-wider outline-none transition-all duration-200 focus:border-foreground/30 focus:bg-card focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="button"
              onClick={search}
              disabled={pending || !refInput.trim()}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg disabled:pointer-events-none disabled:opacity-30"
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              Find
            </button>
          </div>
        </label>
        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>

      <section aria-labelledby="dispute-history">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="dispute-history" className="text-sm font-bold tracking-tight">
              Dispute history
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Newest claims first.</p>
          </div>
          <p className="text-[11px] tabular-nums text-muted-foreground">
            {disputes.length} claim{disputes.length === 1 ? '' : 's'}
          </p>
        </div>

        {disputes.length === 0 ? (
          <div className="rounded-xl bg-card px-5 py-8 text-center shadow-md">
            <p className="text-sm font-medium tracking-tight">No disputes yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Filed claims will show up here from newest to oldest.
            </p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-xl bg-card shadow-md">
            {disputes.map((d) => {
              const txn = getTransaction(d.transactionId)
              const selected = d.ref === selectedRef
              const active = d.status !== 'cancelled'
              return (
                <li key={d.ref} className="border-b border-border/30 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setSelectedRef(d.ref)}
                    aria-pressed={selected}
                    className={cn(
                      'flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3.5 text-left transition-colors duration-200 sm:px-5',
                      selected ? 'bg-secondary' : 'hover:bg-secondary/50',
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold tabular-nums tracking-tight">{d.ref}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {txn?.merchant ?? '—'}
                        {txn
                          ? ` · ${formatAmount(txn.amount, txn.currency)} · ${formatTxnDate(txn.date)}`
                          : ''}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Filed {formatFiledDate(d.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
                        active
                          ? 'bg-foreground text-primary-foreground'
                          : 'border border-destructive/30 bg-destructive/10 text-destructive',
                      )}
                    >
                      {statusLabel(d.status)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {dispute && (
        <BookingCard
          dispute={dispute}
          transaction={transaction}
          reason={reason}
          pending={pending}
          onCancel={cancel}
        />
      )}
    </div>
  )
}
