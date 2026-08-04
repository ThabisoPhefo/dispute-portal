import { useState, useTransition } from 'react'
import { Loader2, Search } from 'lucide-react'
import { cancelDisputeAction, lookupDispute } from '../../lib/dispute-actions'
import { formatAmount, formatTxnDate, getReason, getTransaction } from '../../lib/mock-data'
import { useDisputeStore } from '../../lib/dispute-store'
import { cn } from '../../lib/utils'
import { card, microLabel } from '../../lib/ui'
import { Button } from '../ui/button'
import { StatusBadge } from '../ui/status-badge'
import { DisputeCard } from './dispute-card'

function formatFiledDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ManagePanel() {
  const disputes = useDisputeStore((s) => s.disputes)
  const [refInput, setRefInput] = useState('')
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const activeRef = selectedRef ?? disputes[0]?.ref ?? null
  const dispute = disputes.find((d) => d.ref === activeRef) ?? null
  const transaction = dispute ? getTransaction(dispute.transactionId) : undefined
  const reason = dispute ? getReason(dispute.reason) : undefined

  function search() {
    setError('')
    startTransition(async () => {
      const res = await lookupDispute(refInput)
      if (res.ok) setSelectedRef(res.dispute.ref)
      else setError(res.error)
    })
  }

  function cancel() {
    if (!dispute) return
    startTransition(async () => {
      await cancelDisputeAction(dispute.ref)
    })
  }

  return (
    <div className="space-y-4">
      <div className={cn(card, 'p-5')}>
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
            <Button
              type="button"
              size="sm"
              className="shrink-0 shadow-md hover:shadow-lg"
              onClick={search}
              disabled={pending || !refInput.trim()}
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              Find
            </Button>
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
          <div className={cn(card, 'px-5 py-8 text-center')}>
            <p className="text-sm font-medium tracking-tight">No disputes yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Filed claims will show up here from newest to oldest.
            </p>
          </div>
        ) : (
          <ul className={cn(card, 'overflow-hidden')}>
            {disputes.map((d) => {
              const txn = getTransaction(d.transactionId)
              const selected = d.ref === activeRef
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
                    <StatusBadge status={d.status} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {dispute && (
        <DisputeCard
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
