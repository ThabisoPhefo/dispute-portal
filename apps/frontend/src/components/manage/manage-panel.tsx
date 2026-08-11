import { useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { useDisputes, useTransactions, useCancelDispute } from '../../lib/queries'
import { formatFiledDate } from '../../lib/format'
import { getDisputeDisplay } from '../../lib/dispute-display'
import { getErrorMessage } from '../../lib/error-message'
import { cn } from '../../lib/utils'
import {
  card,
  formControl,
  microLabel,
  sectionLead,
  sectionTitle,
  loadingState,
} from '../../lib/ui'
import { Button } from '../ui/button'
import { InlineError } from '../ui/inline-error'
import { QueryErrorState } from '../ui/query-error-state'
import { StatusBadge } from '../ui/status-badge'
import { DisputeCard } from './dispute-card'

export function ManagePanel() {
  const {
    data: disputes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDisputes()
  const { data: transactions = [] } = useTransactions()
  const cancelDispute = useCancelDispute()

  const [refInput, setRefInput] = useState('')
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [searchError, setSearchError] = useState('')

  const activeRef = selectedRef ?? disputes[0]?.ref ?? null
  const dispute = disputes.find((item) => item.ref === activeRef) ?? null
  const display = dispute ? getDisputeDisplay(dispute, transactions) : null

  function search() {
    setSearchError('')
    const found = disputes.find(
      (item) => item.ref.toLowerCase() === refInput.trim().toLowerCase(),
    )
    if (found) setSelectedRef(found.ref)
    else setSearchError('No dispute found for that reference.')
  }

  function cancel() {
    if (!dispute) return
    cancelDispute.mutate(dispute.id)
  }

  if (isLoading) {
    return (
      <div className={cn(loadingState, 'py-16')}>
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
        <QueryErrorState
          title="We couldn't load your disputes"
          message={getErrorMessage(
            error,
            'Please try again in a moment.',
          )}
          onRetry={() => {
            void refetch()
          }}
        />
    )
  }

  return (
    <div className="space-y-4">
      <div className={cn(card, 'p-4 sm:p-5')}>
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
              className={cn(formControl, 'font-semibold uppercase tabular-nums tracking-wider')}
            />
            <Button
              type="button"
              size="sm"
              className="shrink-0 shadow-md hover:shadow-lg"
              onClick={search}
              disabled={!refInput.trim()}
            >
              <Search className="h-3.5 w-3.5" />
              Find
            </Button>
          </div>
        </label>
        <InlineError message={searchError} className="mt-3" />
      </div>

      <section aria-labelledby="dispute-history">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="dispute-history" className={sectionTitle}>
              Dispute history
            </h2>
            <p className={sectionLead}>Newest claims first.</p>
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
            {disputes.map((item) => {
              const itemDisplay = getDisputeDisplay(item, transactions)
              const selected = item.ref === activeRef
              return (
                <li key={item.ref} className="border-b border-border/30 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setSelectedRef(item.ref)}
                    aria-pressed={selected}
                    className={cn(
                      'flex w-full cursor-pointer items-start justify-between gap-2 px-3 py-3 text-left transition-colors duration-200 sm:gap-3 sm:px-5 sm:py-3.5',
                      selected ? 'bg-secondary' : 'hover:bg-secondary/50',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold tabular-nums tracking-tight">{item.ref}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {itemDisplay.merchantLabel}
                        {itemDisplay.transaction
                          ? ` · ${itemDisplay.amountLabel} · ${itemDisplay.transactionDateLabel}`
                          : ''}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Filed {formatFiledDate(item.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {dispute && display && (
        <DisputeCard
          dispute={dispute}
          transaction={display.transaction}
          reason={display.reason}
          pending={cancelDispute.isPending}
          errorMessage={getErrorMessage(cancelDispute.error, '')}
          onCancel={cancel}
        />
      )}
    </div>
  )
}
