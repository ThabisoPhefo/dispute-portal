import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatAmount, formatTxnDate, TRANSACTIONS } from '../../lib/mock-data'
import { cn } from '../../lib/utils'
import { selectableCard } from '../../lib/ui'

const PAGE_SIZE = 6

export function ServiceStep({
  serviceId,
  onSelect,
}: {
  serviceId: string
  onSelect: (id: string) => void
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(TRANSACTIONS.length / PAGE_SIZE))
  const start = page * PAGE_SIZE
  const pageItems = TRANSACTIONS.slice(start, start + PAGE_SIZE)
  const from = start + 1
  const to = Math.min(start + PAGE_SIZE, TRANSACTIONS.length)

  return (
    <section aria-labelledby="step-service">
      <h2 id="step-service" className="text-sm font-bold tracking-tight">
        Recent transactions
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Select the transaction you want to dispute.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {pageItems.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn(
              'animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300',
              selectableCard.base,
              serviceId === t.id ? selectableCard.selected : selectableCard.idle,
            )}
          >
            <span className="block text-sm font-semibold tracking-tight text-card-foreground">
              {t.merchant}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {t.category}
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {formatTxnDate(t.date)} · {formatAmount(t.amount, t.currency)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Previous
        </button>
        <p className="text-[11px] tabular-nums text-muted-foreground">
          {from}–{to} of {TRANSACTIONS.length}
        </p>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  )
}
