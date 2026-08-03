import { REASONS } from '../../lib/mock-data'
import { cn } from '../../lib/utils'
import { selectableCard } from '../../lib/ui'

export function BranchStep({
  branchId,
  onSelect,
}: {
  branchId: string
  onSelect: (id: string) => void
}) {
  return (
    <section aria-labelledby="step-branch">
      <h2 id="step-branch" className="text-sm font-bold tracking-tight">
        Why are you disputing this?
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Choose the reason that best matches your claim.
      </p>
      <div className="mt-4 grid gap-3">
        {REASONS.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={cn(
              'animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300 flex items-start gap-3',
              selectableCard.base,
              branchId === r.id ? selectableCard.selected : selectableCard.idle,
            )}
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-card-foreground">
                  {r.name}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {r.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
