import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Clock, Loader2, Mail, MapPin, MessageSquare, UserRound } from 'lucide-react'
import { useDispute, useTransactions } from '../lib/queries'
import { formatAmount, formatTxnDate, getReason } from '../lib/mock-data'
import { card, microLabel } from '../lib/ui'
import { cn } from '../lib/utils'
import { buttonVariants } from '../components/ui/button-variants'
import { DetailItem } from '../components/ui/detail-item'

export function ConfirmationPage() {
  const { ref = '' } = useParams<{ ref: string }>()
  const { data: dispute, isLoading, isError } = useDispute(ref)
  const { data: transactions = [] } = useTransactions()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }
  if (isError || !dispute) return <Navigate to="/disputes" replace />

  const transaction = transactions.find((t) => t.id === dispute.transactionId)
  const reason = getReason(dispute.reason)
  const cancelled = dispute.status === 'CANCELLED'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className={cn(card, 'p-6 sm:p-8')}>
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={cancelled ? 'mt-0.5 h-5 w-5 text-destructive' : 'mt-0.5 h-5 w-5 text-foreground'}
          />
          <div>
            <h1 className="text-base font-bold tracking-tight">
              {cancelled ? 'Dispute cancelled' : 'Dispute submitted'}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {cancelled
                ? 'This claim is no longer active.'
                : 'Thanks — we have logged your claim and will review it shortly.'}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-secondary/50 p-5">
          <p className={microLabel}>Claim reference</p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{dispute.ref}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Keep this reference to track or cancel your dispute.
          </p>
        </div>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={<UserRound className="h-3.5 w-3.5" />}
            label="Merchant"
            value={transaction?.merchant ?? '—'}
          />
          <DetailItem
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Amount"
            value={
              transaction
                ? formatAmount(transaction.amount, transaction.currency)
                : '—'
            }
          />
          <DetailItem
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Transaction date"
            value={transaction ? formatTxnDate(transaction.date) : '—'}
          />
          <DetailItem
            icon={<MapPin className="h-3.5 w-3.5" />}
            label="Reason"
            value={reason?.name ?? '—'}
          />
        </dl>

        <div className="mt-6 space-y-2.5 border-t border-border/40 pt-5">
          <p className={microLabel}>Confirmation sent</p>
          <Notice
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            title="SMS notification"
            body={`Capitec: Dispute ${dispute.ref} filed for ${transaction?.merchant ?? 'your transaction'}. Reply C to cancel.`}
          />
          <Notice
            icon={<Mail className="h-3.5 w-3.5" />}
            title="Email confirmation"
            body="Your claim details have been sent to your inbox."
          />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Simulated for this prototype — no real messages are delivered
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            to="/disputes"
            className={cn(buttonVariants({ size: 'sm' }), 'shadow-md hover:shadow-lg')}
          >
            View this dispute
          </Link>
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'border border-border hover:shadow-md',
            )}
          >
            Dispute another transaction
          </Link>
        </div>
      </div>
    </div>
  )
}

function Notice({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/40 p-3.5">
      <span className="mt-0.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold tracking-tight text-card-foreground">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
