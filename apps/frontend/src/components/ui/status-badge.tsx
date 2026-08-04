import { getStatusLabel, type DisputeStatus } from '../../lib/dispute-store'
import { cn } from '../../lib/utils'

export function StatusBadge({
  status,
  className,
}: {
  status: DisputeStatus
  className?: string
}) {
  const active = status !== 'cancelled'
  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
        active
          ? 'bg-foreground text-primary-foreground'
          : 'border border-destructive/30 bg-destructive/10 text-destructive',
        className,
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
