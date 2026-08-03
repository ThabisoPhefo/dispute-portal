import { Link } from 'react-router-dom'
import { CalendarCheck, ShieldCheck, Timer, Wallet } from 'lucide-react'
import { BookingFlow } from '../components/booking/booking-flow'
import { TRANSACTIONS } from '../lib/mock-data'
import type { ReactNode } from 'react'

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
      <section className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-foreground" aria-hidden="true" />
          Transactions & disputes
        </span>
        <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
          Something doesn&apos;t add up? Flag it in under a minute.
        </h1>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground text-pretty sm:text-sm">
          Review your recent transactions and raise a dispute on anything that looks wrong — track every
          claim from open to resolved.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Fact icon={<Timer className="h-3.5 w-3.5" />} label="Avg resolution 3 days" />
          <Fact icon={<Wallet className="h-3.5 w-3.5" />} label={`${TRANSACTIONS.length} transactions`} />
          <Fact icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Claims encrypted" />
        </div>
      </section>

      <section className="mt-8" id="book">
        <BookingFlow />
      </section>

      <section className="mt-6 flex flex-col items-start gap-4 rounded-xl bg-card p-5 shadow-md transition-all duration-200 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-card-foreground">
              Already have a claim?
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Look it up with your claim reference to view or cancel it.
            </p>
          </div>
        </div>
        <Link
          to="/manage"
          className="cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-primary-foreground transition-all duration-200 hover:opacity-90"
        >
          View disputes
        </Link>
      </section>
    </div>
  )
}

function Fact({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  )
}
