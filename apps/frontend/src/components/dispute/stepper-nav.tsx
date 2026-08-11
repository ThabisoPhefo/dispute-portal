import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { microLabel } from '../../lib/ui'

const STEPS = ['Transaction', 'Reason', 'Details']

export function StepperNav({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {STEPS.map((label, index) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-200',
              index <= step
                ? 'bg-foreground text-primary-foreground'
                : 'border border-border bg-secondary text-muted-foreground',
            )}
            aria-current={index === step ? 'step' : undefined}
          >
            {index < step ? <Check className="h-3 w-3" /> : index + 1}
          </div>
          <span
            className={cn(
              microLabel,
              'hidden sm:block',
              index === step ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
          {index < STEPS.length - 1 && <span className="h-px flex-1 bg-border/60" />}
        </li>
      ))}
    </ol>
  )
}
