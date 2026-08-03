import { useState, useTransition } from 'react'
import { Loader2, Search } from 'lucide-react'
import { cancelDisputeAction, lookupDispute } from '../../lib/actions'
import { getReason, getTransaction } from '../../lib/mock-data'
import type { Dispute } from '../../lib/store'
import { cn } from '../../lib/utils'
import { microLabel } from '../../lib/ui'
import { BookingCard } from './booking-card'

export function ManagePanel() {
  const [refInput, setRefInput] = useState('')
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function search() {
    setError('')
    startTransition(async () => {
      const res = await lookupDispute(refInput)
      if (res.ok) setDispute(res.dispute)
      else {
        setDispute(null)
        setError(res.error)
      }
    })
  }

  function cancel() {
    if (!dispute) return
    startTransition(async () => {
      const res = await cancelDisputeAction(dispute.ref)
      if (res.ok) setDispute({ ...res.dispute })
    })
  }

  const transaction = dispute ? getTransaction(dispute.transactionId) : undefined
  const reason = dispute ? getReason(dispute.reasonId) : undefined

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
