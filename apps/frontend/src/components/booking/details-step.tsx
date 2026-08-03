import { cn } from '../../lib/utils'
import { microLabel } from '../../lib/ui'

export type DetailsForm = {
  description: string
}

export function DetailsStep({
  form,
  error,
  onChange,
}: {
  form: DetailsForm
  error: string
  onChange: (patch: Partial<DetailsForm>) => void
}) {
  return (
    <section aria-labelledby="step-details">
      <h2 id="step-details" className="text-sm font-bold tracking-tight">
        Describe the issue
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Give us a short explanation so we can review your claim.
      </p>
      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className={cn(microLabel, 'mb-1.5 block')}>What happened?</span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs leading-relaxed outline-none transition-all duration-200 focus:border-foreground/30 focus:bg-card focus:ring-2 focus:ring-ring/20"
            placeholder="I was charged twice for the same order on Takealot…"
          />
        </label>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </section>
  )
}
