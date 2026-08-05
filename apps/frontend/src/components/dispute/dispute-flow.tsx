import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useTransactions, useCreateDispute } from '../../lib/queries'
import { formatAmount, getReason } from '../../lib/mock-data'
import { card } from '../../lib/ui'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { StepperNav } from './stepper-nav'
import { TransactionStep } from './transaction-step'
import { ReasonStep } from './reason-step'
import { DetailsStep, type DetailsForm } from './details-step'
import { ClaimSummary } from './claim-summary'

export function DisputeFlow() {
  const navigate = useNavigate()
  const { data: transactions = [], isLoading: txnLoading } = useTransactions()
  const createDispute = useCreateDispute()

  const [step, setStep] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [reason, setReason] = useState('')
  const [form, setForm] = useState<DetailsForm>({ description: '' })

  const transaction = transactions.find((t) => t.id === transactionId)
  const reasonOption = getReason(reason)
  const pending = createDispute.isPending

  const canContinue =
    (step === 0 && !!transactionId) ||
    (step === 1 && !!reason) ||
    step === 2

  function submit() {
    createDispute.mutate(
      { transactionId, reason: reason as never, description: form.description },
      {
        onSuccess: (dispute) => navigate(`/confirmation/${dispute.ref}`),
        onError: (err) => console.error(err),
      },
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className={cn(card, 'min-w-0 p-4 sm:p-6')}>
        <StepperNav step={step} />

        {step === 0 && (
          <TransactionStep
            transactions={transactions}
            isLoading={txnLoading}
            transactionId={transactionId}
            onSelect={setTransactionId}
          />
        )}
        {step === 1 && <ReasonStep reasonId={reason} onSelect={setReason} />}
        {step === 2 && (
          <DetailsStep
            form={form}
            error={createDispute.error?.message ?? ''}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          />
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              size="sm"
              className="shadow-md hover:shadow-lg"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="shadow-md hover:shadow-lg"
              onClick={submit}
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Submit dispute
            </Button>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <ClaimSummary
          merchant={transaction?.merchant}
          amount={
            transaction
              ? formatAmount(transaction.amount, transaction.currency)
              : undefined
          }
          reasonName={reasonOption?.name}
          txnDate={transaction?.date}
          step={step}
        />
      </div>
    </div>
  )
}
