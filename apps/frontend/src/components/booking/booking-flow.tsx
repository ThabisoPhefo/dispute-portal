import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { createDispute } from '../../lib/actions'
import { formatAmount, getReason, getTransaction } from '../../lib/mock-data'
import { StepperNav } from './stepper-nav'
import { ServiceStep } from './service-step'
import { BranchStep } from './branch-step'
import { DetailsStep, type DetailsForm } from './details-step'
import { BookingSummary } from './booking-summary'

export function BookingFlow() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [reasonId, setReasonId] = useState('')
  const [form, setForm] = useState<DetailsForm>({ description: '' })
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const transaction = getTransaction(transactionId)
  const reason = getReason(reasonId)

  const canContinue =
    (step === 0 && !!transactionId) ||
    (step === 1 && !!reasonId) ||
    step === 2

  function submit() {
    setError('')
    startTransition(async () => {
      const res = await createDispute({
        transactionId,
        reasonId,
        description: form.description,
      })
      if ('error' in res) {
        setError(res.error)
        return
      }
      navigate(`/confirmation/${res.ref}`)
    })
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="min-w-0 rounded-xl bg-card p-5 shadow-md sm:p-6">
        <StepperNav step={step} />

        {step === 0 && <ServiceStep serviceId={transactionId} onSelect={setTransactionId} />}
        {step === 1 && <BranchStep branchId={reasonId} onSelect={setReasonId} />}
        {step === 2 && (
          <DetailsStep
            form={form}
            error={error}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          />
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg disabled:pointer-events-none disabled:opacity-30"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg disabled:pointer-events-none disabled:opacity-40"
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Submit dispute
            </button>
          )}
        </div>
      </div>

      <BookingSummary
        merchant={transaction?.merchant}
        amount={
          transaction
            ? formatAmount(transaction.amount, transaction.currency)
            : undefined
        }
        reasonName={reason?.name}
        txnDate={transaction?.date}
        step={step}
      />
    </div>
  )
}
