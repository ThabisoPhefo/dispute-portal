import type { ReactNode } from 'react'
import { microLabel } from '../../lib/ui'

export function DetailItem({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className={microLabel}>{label}</dt>
        <dd className="wrap-break-word text-xs font-semibold leading-relaxed tracking-tight text-card-foreground">
          {value}
        </dd>
      </div>
    </div>
  )
}
