import { Button } from './button'
import { card } from '../../lib/ui'
import { cn } from '../../lib/utils'

export function QueryErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <div className={cn(card, 'px-5 py-8 text-center')}>
      <p className="text-sm font-medium tracking-tight text-destructive">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-4 border border-border"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  )
}
