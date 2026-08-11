import { cn } from '../../lib/utils'
import { formControl, formError, microLabel, sectionLead, sectionTitle } from '../../lib/ui'

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
      <h2 id="step-details" className={sectionTitle}>
        Describe the issue
      </h2>
      <p className={sectionLead}>
        Give us a short explanation so we can review your claim.
      </p>
      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className={cn(microLabel, 'mb-1.5 block')}>What happened?</span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={cn(formControl, 'leading-relaxed')}
            placeholder="I was charged twice for the same order on Takealot…"
          />
        </label>
      </div>
      {error && (
        <p role="alert" className={cn(formError, 'mt-4')}>
          {error}
        </p>
      )}
    </section>
  )
}
