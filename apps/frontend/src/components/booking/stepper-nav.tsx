import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const STEPS = ['Transaction', 'Reason', 'Details']

export function StepperNav({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-200',
              i <= step
                ? 'bg-foreground text-primary-foreground'
                : 'border border-border bg-secondary text-muted-foreground',
            )}
            aria-current={i === step ? 'step' : undefined}
          >
            {i < step ? <Check className="h-3 w-3" /> : i + 1}
          </div>
          <span
            className={cn(
              'hidden text-[10px] font-medium uppercase tracking-wider sm:block',
              i === step ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border/60" />}
        </li>
      ))}
    </ol>
  )
}
