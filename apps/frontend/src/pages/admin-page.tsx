import type { ReactNode } from 'react'
import { CalendarDays, CircleSlash, Loader2, Users } from 'lucide-react'
import { useDisputes, useTransactions } from '../lib/queries'
import { formatAmount, formatTxnDate } from '../lib/format'
import { getReason } from '../lib/dispute-reasons'
import { card } from '../lib/ui'
import { cn } from '../lib/utils'
import { StatusBadge } from '../components/ui/status-badge'

export function AdminPage() {
  const { data: disputes = [], isLoading } = useDisputes()
  const { data: transactions = [] } = useTransactions()
  const open = disputes.filter((d) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW')
  const underReview = disputes.filter((d) => d.status === 'UNDER_REVIEW')
  const cancelled = disputes.filter((d) => d.status === 'CANCELLED')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Dispute operations</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Staff view of all customer claims across transactions.
          </p>
        </div>
        <span className="max-w-full truncate rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Demo data · refreshes on each claim
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Open claims" value={open.length} />
        <Stat icon={<CalendarDays className="h-4 w-4" />} label="Under review" value={underReview.length} />
        <Stat icon={<CircleSlash className="h-4 w-4" />} label="Cancelled" value={cancelled.length} />
      </div>

      <div className={cn(card, 'mt-6 overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/60 bg-secondary/60 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Ref</th>
                <th className="px-4 py-2.5 font-medium">Merchant</th>
                <th className="px-4 py-2.5 font-medium">Reason</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">When</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {disputes.map((d) => {
                const txn = transactions.find((t) => t.id === d.transactionId)
                const reason = getReason(d.reason)
                return (
                  <tr
                    key={d.ref}
                    className="border-t border-border/40 transition-colors duration-200 hover:bg-secondary/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">{d.ref}</td>
                    <td className="px-4 py-3">
                      <span className="block font-semibold tracking-tight text-card-foreground">
                        {txn?.merchant ?? '—'}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {txn?.category ?? ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{reason?.name}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {txn ? formatAmount(txn.amount, txn.currency) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      {txn ? formatTxnDate(txn.date) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} className="whitespace-nowrap" />
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
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}
