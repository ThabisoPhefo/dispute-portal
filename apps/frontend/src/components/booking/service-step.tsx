import { useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react'
import { formatAmount, formatTxnDate, TRANSACTIONS, type Transaction } from '../../lib/mock-data'
import { cn } from '../../lib/utils'
import { selectableCard } from '../../lib/ui'

const PAGE_SIZE = 6

type ViewMode = 'cards' | 'list'

export function ServiceStep({
  serviceId,
  onSelect,
}: {
  serviceId: string
  onSelect: (id: string) => void
}) {
  const [page, setPage] = useState(0)
  const [view, setView] = useState<ViewMode>('cards')
  const totalPages = Math.max(1, Math.ceil(TRANSACTIONS.length / PAGE_SIZE))
  const start = page * PAGE_SIZE
  const pageItems = TRANSACTIONS.slice(start, start + PAGE_SIZE)
  const from = start + 1
  const to = Math.min(start + PAGE_SIZE, TRANSACTIONS.length)

  return (
    <section aria-labelledby="step-service">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="step-service" className="text-sm font-bold tracking-tight">
            Recent transactions
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Select the transaction you want to dispute.
          </p>
        </div>

        <div
          className="relative hidden grid-cols-2 rounded-lg bg-secondary/60 p-0.5 sm:inline-grid"
          role="group"
          aria-label="View mode"
        >
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-foreground shadow-sm transition-transform duration-300 ease-out',
              view === 'list' && 'translate-x-full',
            )}
          />
          <button
            type="button"
            onClick={() => setView('cards')}
            aria-pressed={view === 'cards'}
            className={cn(
              'relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors duration-200',
              view === 'cards'
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            className={cn(
              'relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors duration-200',
              view === 'list'
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pageItems.map((t, i) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              selected={serviceId === t.id}
              onSelect={onSelect}
              delay={i * 60}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 -mx-1 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/40 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-medium">Date</th>
                <th className="px-3 py-2.5 font-medium">Merchant</th>
                <th className="px-3 py-2.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {pageItems.map((t) => {
                const selected = serviceId === t.id
                return (
                  <tr
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect(t.id)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected}
                    className={cn(
                      'cursor-pointer border-b border-border/30 transition-colors duration-200 last:border-b-0',
                      selected
                        ? 'bg-secondary'
                        : 'hover:bg-secondary/50',
                    )}
                  >
                    <td className="whitespace-nowrap px-3 py-3 tabular-nums text-muted-foreground">
                      {formatTxnDate(t.date)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="block font-semibold tracking-tight text-card-foreground">
                        {t.merchant}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">{t.category}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-medium tabular-nums">
                      {formatAmount(t.amount, t.currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

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

function TransactionCard({
  transaction: t,
  selected,
  onSelect,
  delay,
}: {
  transaction: Transaction
  selected: boolean
  onSelect: (id: string) => void
  delay: number
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(t.id)}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        'animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300',
        selectableCard.base,
        selected ? selectableCard.selected : selectableCard.idle,
      )}
    >
      <span className="block text-sm font-semibold tracking-tight text-card-foreground">
        {t.merchant}
      </span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{t.category}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {formatTxnDate(t.date)} · {formatAmount(t.amount, t.currency)}
      </span>
    </button>
  )
}
