import { cn } from '../../lib/utils'
import { formError } from '../../lib/ui'

export function InlineError({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  if (!message) return null

  return (
    <p role="alert" className={cn(formError, className)}>
      {message}
    </p>
  )
}
