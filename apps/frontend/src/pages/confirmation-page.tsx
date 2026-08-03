import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Clock, Mail, MapPin, MessageSquare, UserRound } from 'lucide-react'
import { findDispute } from '../lib/store'
import { formatAmount, formatTxnDate, getReason, getTransaction } from '../lib/mock-data'
import { microLabel } from '../lib/ui'

export function ConfirmationPage() {
  const { ref = '' } = useParams<{ ref: string }>()
  const dispute = findDispute(ref)
  if (!dispute) return <Navigate to="/manage" replace />

  const transaction = getTransaction(dispute.transactionId)
  const reason = getReason(dispute.reasonId)
  const cancelled = dispute.status === 'cancelled'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-xl bg-card p-6 shadow-md sm:p-8">
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
          <Row
            icon={<UserRound className="h-3.5 w-3.5" />}
            label="Merchant"
            value={transaction?.merchant ?? '—'}
          />
          <Row
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Amount"
            value={
              transaction
                ? formatAmount(transaction.amount, transaction.currency)
                : '—'
            }
          />
          <Row
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            label="Transaction date"
            value={transaction ? formatTxnDate(transaction.date) : '—'}
          />
          <Row
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
            to="/manage"
            className="cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg"
          >
            View this dispute
          </Link>
          <Link
            to="/"
            className="cursor-pointer rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:bg-card hover:shadow-md"
          >
            Dispute another transaction
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt className={microLabel}>{label}</dt>
        <dd className="text-xs font-semibold leading-relaxed tracking-tight text-card-foreground">
          {value}
        </dd>
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
