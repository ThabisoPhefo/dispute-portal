import { REASONS } from '../../lib/dispute-reasons'
import { cn } from '../../lib/utils'
import { sectionLead, sectionTitle, selectableCard } from '../../lib/ui'

export function ReasonStep({
  reasonId,
  onSelect,
}: {
  reasonId: string
  onSelect: (id: string) => void
}) {
  return (
    <section aria-labelledby="step-reason">
      <h2 id="step-reason" className={sectionTitle}>
        Why are you disputing this?
      </h2>
      <p className={sectionLead}>
        Choose the reason that best matches your claim.
      </p>
      <div className="mt-4 grid gap-3">
        {REASONS.map((reason, index) => (
          <button
            key={reason.id}
            type="button"
            onClick={() => onSelect(reason.id)}
            style={{ animationDelay: `${index * 60}ms` }}
            className={cn(
              'animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300 flex items-start gap-3',
              selectableCard.base,
              reasonId === reason.id ? selectableCard.selected : selectableCard.idle,
            )}
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-card-foreground">
                  {reason.name}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {reason.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
